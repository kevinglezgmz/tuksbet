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
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No bets have been made yet!' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
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
          res.status(500).send({ err: 'Bet with Id ' + req.params.betId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
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
      await betsDb.insertOne(newBetToInsert);

      /** Bet has been made, we need to update the user's balance*/
      await usersDb.updateOne({ _id: newBetToInsert.userId }, { $inc: { balance: newBetToInsert.betAmount * -1 } });

      res.send({ msg: 'Bet placed successfuly' });
    } catch (err) {
      /** If an error ocurred inserting the bet or updating the users balance, we need to delete the bet */
      await betsDb.deleteOne(newBetToInsert);
      res.status(400).send({ err: 'You can only place one bet per game round' });
    }
  }

  static async updateBet(req, res) {
    /** Only the server running the games can update the bet and payout the bet to the corresponding users */
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
    betsDb
      .updateOne({ _id: getObjectId(req.params.betId) }, { $set: overrideBetData })
      .then((result) => {
        res.send({ msg: 'Successfuly modified the bet data' });
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
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
      const betsDb = new Database('BetHistory');
      /** @type { GameRound } */
      const gameRoundData = await gameRoundsDb.findOne({ _id: getObjectId(gameRoundId) }, {});
      if (!gameRoundData.result) {
        throw 'Unexpected error, please try again';
      }

      /** @type { BetHistory[] } */
      const betsMadeInGameRound = await betsDb.find({ gameRoundId: getObjectId(gameRoundId) }, {}).toArray();
      if (betsMadeInGameRound.length === 0) {
        res.status(400).send({ err: 'No bets were made in this game round' });
        return;
      }

      /** Update all of the bets depending on the results */
      const game = gameRoundData.result.split('-')[0];
      switch (game) {
        case 'roulette':
          betsMadeInGameRound.forEach((bet) => {
            if (bet.betStake === gameRoundData.result && gameRoundData.result === 'roulette-green') {
              bet.betPayout = bet.betAmount * 14;
            }
            if (bet.betStake === gameRoundData.result) {
              bet.betPayout = bet.betAmount * 2;
            } else {
              bet.betPayout = betAmount * -1;
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
          const dealerResult = gameRoundData.result.split('-')[1];
          betsMadeInGameRound.forEach((bet) => {
            const userNumber = parseFloat(bet.betStake.split('-')[1]);
            if (userNumber <= 21 && userNumber > parseFloat(gameRoundData.result)) {
              bet.betPayout = bet.betAmount * parseFloat(gameRoundData.result);
            } else if (userNumber === parseFloat(gameRoundData.result)) {
              bet.betPayout = betAmount;
            } else {
              bet.betPayout = betAmount * -1;
            }
          });
          break;
      }

      /** We now have the bets updated, we need to update them and update the user's balances */
      const betPromises = betsMadeInGameRound.map((bet) => betsDb.updateOne({ _id: getObjectId(bet._id) }, { $set: bet }));
      const usersDb = new Database('Users');
      const usersPromises = betsMadeInGameRound.map(async (bet) =>
        usersDb.updateOne({ _id: getObjectId(bet.userId) }, { $inc: { balance: bet.betPayout <= 0 ? 0 : bet.betPayout } })
      );

      await Promise.all(...betPromises, ...usersPromises);
      res.send({ msg: 'Bets and users updated successfuly' });
    } catch (err) {
      res.status(500).send({ err: 'Unexpected error, please try again' });
    }
  }

  static deleteBet(req, res) {
    const betsDb = new Database('BetHistory');
    betsDb
      .deleteOne({ _id: getObjectId(req.params.betId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Bet deleted successfuly' });
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
