const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').Game } Game
 */

class GamesController {
  static getAllGames(req, res) {
    const gamesDb = new Database('Games');
    gamesDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'The are no games in the database yet' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: 'Unexpected error ocurred, please try again' });
      });
  }

  static createNewGame(req, res) {
    const gamesDb = new Database('Games');
    const { gameName } = req.body;
    if (!gameName) {
      res.status(400).send({ msg: 'Please set the name of the game' });
      return;
    }

    gamesDb
      .insertOne({ gameName })
      .then((status) => {
        if (status.acknowledged) {
          res.status(201).send({ msg: gameName + ' game created successfully' });
        } else {
          res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
        }
      })
      .catch((err) => {
        res.status(400).send({ err: 'This game already exists!' });
      });
  }

  static updateGame(req, res) {
    const { gameName } = req.body;
    const gamesDb = new Database('Games');
    gamesDb
      .updateOne({ _id: getObjectId(req.params.gameId) }, { $set: { gameName } })
      .then((result) => {
        if (result.acknowledged && result.modifiedCount === 1) {
          res.status(200).send({ msg: 'Successfully changed the  game name' });
        } else {
          res.status(400).send({ msg: 'Could not find the specified game' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteGame(req, res) {
    const gamesDb = new Database('Games');
    gamesDb
      .deleteOne({ _id: getObjectId(req.params.gameId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Game deleted successfully' });
        } else {
          res.status(400).send({ err: 'Could not find the specified game' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }
}

module.exports = GamesController;
