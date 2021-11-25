const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').BetHistory } BetHistory
 * @typedef { import('./dataTypes').GameRound } GameRound
 * @typedef { import('./dataTypes').User } User
 */

function validateBetData(betData) {
  const createBetData = ['gameRoundId', 'userId', 'betAmount', 'betStake'];
  return createBetData.filter((field) => !betData[field]);
}

async function retrieveUserAndGameRound(betData) {
  const gameRoundsDb = new Database('GameRounds');
  /** @type { GameRound } */
  const gameRoundData = gameRoundsDb.findOne({ _id: getObjectId(betData.gameRoundId) });

  const usersDb = new Database('Users');
  /** @type { User } */
  const user = usersDb.findOne({ _id: getObjectId(betData.userId) });

  return {
    user: await user,
    gameRoundData: await gameRoundData,
  };
}

class BetsController {
  static getAllBets(req, res) {
    const betsDb = new Database('BetHistory');
    betsDb
      .findAggregate([
        {
          $lookup: {
            from: 'Users',
            localField: 'userId',
            foreignField: '_id',
            as: 'fromUser',
          },
        },
        {
          $lookup: {
            from: 'GameRounds',
            localField: 'gameRoundId',
            foreignField: '_id',
            as: 'fromGameRound',
          },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromUser', 0] }, '$$ROOT'] } },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromGameRound', 0] }, '$$ROOT'] } },
        },
        {
          $lookup: {
            from: 'Games',
            localField: 'gameId',
            foreignField: '_id',
            as: 'fromGame',
          },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromGame', 0] }, '$$ROOT'] } },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            userId: 1,
            gameRoundId: 1,
            gameName: 1,
            betDate: 1,
            betAmount: 1,
            betPayout: 1,
            betStake: 1,
          },
        },
      ])
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No bets have been made yet!' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static getBetById(req, res) {
    const betsDb = new Database('BetHistory');
    betsDb
      .findOne({ _id: getObjectId(req.params.betId) }, {})
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send({ err: 'Bet with Id ' + req.params.betId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static async createBet(req, res) {
    /** @type { BetHistory } */
    const betData = req.body;

    const missingFields = validateBetData(betData);
    if (missingFields.length > 0) {
      res.status(400).send({ err: 'The following fields are missing: ' + missingFields.join(', ') });
      return;
    }

    if (req.userId !== betData.userId) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    if (isNaN(Number(betData.betAmount)) || Number(betData.betAmount) <= 0) {
      res.status(400).send({ err: 'BetAmount can only be a positive number' });
      return;
    }

    /** Before accepting the bet we need to verify the current game is accepting bets and the user has the remaining balance*/
    try {
      const { user, gameRoundData } = await retrieveUserAndGameRound(betData);
      if (gameRoundData.acceptingBets === false) {
        res.status(400).send({ err: 'The game with id ' + betData.gameRoundId + ' is not accepting bets anymore' });
        return;
      }

      if (user.balance < betData.betAmount) {
        res.status(400).send({ err: 'Not enough balance to make the bet' });
        return;
      }
    } catch (err) {
      res.status(400).send({ err: 'You can not make a bet to a non existing GameRound with id: ' + betData.gameRoundId });
      return;
    }

    /** We insert the bet before reducing the users balance */
    const newBetToInsert = {
      userId: getObjectId(req.userId),
      gameRoundId: getObjectId(betData.gameRoundId),
      betDate: new Date(),
      betAmount: betData.betAmount,
      betPayout: undefined,
      betStake: betData.betStake,
    };

    const betsDb = new Database('BetHistory');
    const usersDb = new Database('Users');
    try {
      const betInsertStatus = await betsDb.insertOne(newBetToInsert);

      /** Bet has been made, we need to update the user's balance*/
      await usersDb.updateOne({ _id: newBetToInsert.userId }, { $inc: { balance: newBetToInsert.betAmount * -1 } });

      res.send({ msg: 'Bet placed successfully', ...betInsertStatus });
    } catch (err) {
      /** If an error ocurred inserting the bet or updating the users balance, we need to delete the bet */
      await betsDb.deleteOne(newBetToInsert);
      res.status(400).send({ err: 'You can only place one bet per game round' });
    }
  }

  static async updateBet(req, res) {
    /** Users can only update their betStake for Crash and Blackjack while the game does not have a result yet */
    /******** Crash only accepts one update because the bet stake is at X.XXx when the bet is created */
    /******** Blackjack should accept the card increments if the user hits, doubles, etc */
    /** After the game ends, Socket server should call updateAllBetsInGameRound after the game ends */
    /** @type { BetHistory } */
    const betData = req.body;
    const betFields = ['userId', 'gameRoundId', 'betDate', 'betAmount', 'betPayout', 'betStake'];
    const overrideBetData = {};

    betFields.forEach((betField) => {
      if (betData[betField]) {
        overrideBetData[betField] = betData[betField];
      }
    });

    const betsDb = new Database('BetHistory');
    // Retrieve the original bet and the gameround details to know if it can be updated
    betsDb
      .findAggregate([
        { $match: { _id: getObjectId(req.params.betId) } },
        {
          $lookup: {
            from: 'GameRounds',
            localField: 'gameRoundId',
            foreignField: '_id',
            as: 'fromGameRound',
          },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromGameRound', 0] }, '$$ROOT'] } },
        },
        {
          $lookup: {
            from: 'Games',
            localField: 'gameId',
            foreignField: '_id',
            as: 'fromGame',
          },
        },
        {
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromGame', 0] }, '$$ROOT'] } },
        },
        {
          $project: {
            _id: 1,
            username: 1,
            userId: 1,
            gameRoundId: 1,
            gameName: 1,
            betDate: 1,
            betAmount: 1,
            betPayout: 1,
            betStake: 1,
            result: 1,
            acceptingBets: 1,
          },
        },
      ])
      .next()
      .then((fullBetAndGameRound) => {
        if (fullBetAndGameRound.gameName === 'Roulette' || fullBetAndGameRound.result !== null) {
          throw 'This bet cannot be updated';
        }

        if (
          fullBetAndGameRound.gameName === 'Crash' &&
          overrideBetData.betStake &&
          fullBetAndGameRound.acceptingBets === false
        ) {
          const initialCrashBetStake = fullBetAndGameRound.betStake.split('-');
          const newCrashBetStake = overrideBetData.betStake.split('-');
          const initialCrashVal = parseFloat(initialCrashBetStake[1]);
          const newCrashVal = parseFloat(newCrashBetStake[1]);
          if (newCrashVal < initialCrashVal && initialCrashBetStake[2] === 'running') {
            return { betStake: 'crash-' + newCrashVal.toFixed(2) + 'x-exited' };
          }
        }
        if (fullBetAndGameRound.gameName === 'Blackjack' && fullBetAndGameRound.result === null) {
          return { betStake: req.body.betStake, betAmount: req.body.betAmount };
        }

        throw 'This bet cannot be updated';
      })
      .then((updateBet) => {
        betsDb.updateOne({ _id: getObjectId(req.params.betId) }, { $set: updateBet }).then((result) => {
          res.send({ msg: 'Successfully modified the bet data' });
        });
      })
      .catch((err) => {
        res.status(500).send({ err: err ? err : 'Unexpected error, please try again' });
      });
  }

  static async updateAllBetsInGameRound(req, res) {
    /** This method can only be called by the server when a game round ends,
     * the purpose of this method is to update all the bets that were made and
     * payout the winners
     */
    const { gameRoundId } = req.body;
    try {
      const gameRoundsDb = new Database('GameRounds');
      /** @type { GameRound } */
      const gameRoundData = await gameRoundsDb.findOne({ _id: getObjectId(gameRoundId) }, {});
      if (typeof gameRoundData.result !== 'string') {
        throw 'This game round has not ended';
      }

      const betsDb = new Database('BetHistory');
      /** @type { BetHistory[] } */
      const betsMadeInGameRoundCursor = await betsDb.find({ gameRoundId: getObjectId(gameRoundId) }, {});
      const betsMadeInGameRound = await betsMadeInGameRoundCursor.toArray();
      if (betsMadeInGameRound.length === 0) {
        res.status(400).send({ err: 'No bets were made in this game round' });
        return;
      }

      /** Update all of the bets depending on the results */
      const game = gameRoundData.result.split('-')[0];
      switch (game) {
        case 'roulette':
          const winningColor = gameRoundData.result.split('-')[1];
          const gameRoundResult = game + '-' + winningColor;
          betsMadeInGameRound.forEach((bet) => {
            if (bet.betStake === gameRoundResult && gameRoundResult === 'roulette-green') {
              bet.betPayout = bet.betAmount * 14;
            } else if (bet.betStake === gameRoundResult) {
              bet.betPayout = bet.betAmount * 2;
            } else {
              bet.betPayout = bet.betAmount * -1;
            }
          });
          break;

        case 'crash':
          const crashResult = gameRoundData.result.split('-')[1];
          betsMadeInGameRound.forEach((bet) => {
            const playerStake = bet.betStake.split('-')[1];
            if (parseFloat(playerStake) <= parseFloat(crashResult)) {
              bet.betPayout = bet.betAmount * parseFloat(playerStake);
            } else {
              bet.betPayout = betAmount * -1;
            }
          });
          break;

        case 'blackjack':
          const dealerResult = parseInt(gameRoundData.result.split('-')[1]);
          betsMadeInGameRound.forEach((bet) => {
            const userNumber = parseInt(bet.betStake.split('-')[1]);
            if (dealerResult > 21 && userNumber <= 21) {
              bet.betPayout = bet.betAmount * 2;
            } else if (userNumber <= 21 && userNumber > dealerResult) {
              bet.betPayout = bet.betAmount * 2;
            } else if (userNumber === dealerResult) {
              bet.betPayout = bet.betAmount;
            } else {
              bet.betPayout = bet.betAmount * -1;
            }
          });
          break;
      }

      const promisesArray = [];
      /** We now have the bets updated, we need to update them and update the user's balances */
      betsMadeInGameRound.forEach((bet) =>
        promisesArray.push(betsDb.updateOne({ _id: getObjectId(bet._id) }, { $set: bet }))
      );
      const usersDb = new Database('Users');
      betsMadeInGameRound.forEach((bet) =>
        promisesArray.push(
          usersDb.updateOne({ _id: getObjectId(bet.userId) }, { $inc: { balance: bet.betPayout <= 0 ? 0 : bet.betPayout } })
        )
      );

      await Promise.all(promisesArray);
      res.send({ msg: 'Bets and users updated successfully' });
    } catch (err) {
      res.status(500).send({ err: err ? err : 'Unexpected error, please try again' });
    }
  }

  static deleteBet(req, res) {
    const betsDb = new Database('BetHistory');
    betsDb
      .deleteOne({ _id: getObjectId(req.params.betId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Bet deleted successfully' });
        } else {
          throw 'Could not find the specified bet';
        }
      })
      .catch((err) => {
        res.status(400).send({ err: 'Could not find the specified bet' });
      });
  }
}

module.exports = BetsController;
