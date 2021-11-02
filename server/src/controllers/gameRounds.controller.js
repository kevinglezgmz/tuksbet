const { ObjectID } = require('bson');
const Database = require('../models/database.model.js');

/**
 * @typedef { import('./dataTypes').GameRound } GameRound
 */

class GameRoundsController {
  static getAllGameRounds(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No game rounds found!' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static getGameRoundById(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .findOne({ _id: ObjectID(req.params.gameRoundId) }, {})
      .then((result) => {
        if (result) {
          res.status(200).send({ data: result });
        } else {
          res.status(500).send({ err: 'Game round with id ' + req.params.gameRoundId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static createGameRound(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    /** @type { GameRound } */
    const gameRoundData = req.body;
    gameRoundsDb
      .insertOne(gameRoundData)
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  static updateGameRound(req, res) {
    const gameRoundsDb = new Database('GameRounds');
    gameRoundsDb
      .updateOne({ _id: ObjectID(req.params.gameRoundId) }, { $set: req.body })
      .then((result) => {
        res.send({ status: result });
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
          res.send({ msg: 'Game round deleted successfuly' });
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
