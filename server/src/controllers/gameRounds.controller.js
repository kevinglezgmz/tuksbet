const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').GameRound } GameRound
 */

class GameRoundsController {
  static getAllGameRounds(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .findAggregate([
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
            fromGame: 0,
          },
        },
      ])
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No game rounds found!' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static getGameRoundById(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .findAggregate([
        { $match: { _id: getObjectId(req.params.gameRoundId) } },
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
            fromGame: 0,
          },
        },
      ])
      .limit(1)
      .next()
      .then((result) => {
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(400).send({ err: 'Game round with id ' + req.params.gameRoundId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static createGameRound(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    /** @type { GameRound } */
    const gameRoundData = req.body;

    const gameRoundToInsert = {
      gameId: getObjectId(gameRoundData.gameId),
      acceptingBets: true,
      roundDate: new Date(),
      result: undefined,
    };

    gameRoundsDb
      .insertOne(gameRoundToInsert)
      .then((result) => {
        res.status(201).send(result);
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static updateGameRound(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .updateOne({ _id: getObjectId(req.params.gameRoundId) }, { $set: req.body })
      .then((result) => {
        res.send({ msg: 'Game round updated successfully' });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  static deleteGameRound(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .deleteOne({ _id: getObjectId(req.params.gameRoundId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Game round deleted successfully' });
        } else {
          throw 'Could not find the specified game round';
        }
      })
      .catch((err) => {
        res.status(400).send({ err: 'Could not find the specified game round' });
      });
  }
}

module.exports = GameRoundsController;
