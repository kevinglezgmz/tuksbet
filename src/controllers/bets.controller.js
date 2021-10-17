const { ObjectID } = require('bson');
const Database = require('../models/database.model.js');

/**
 * @typedef { import('./dataTypes').BetHistory } BetHistory
 */

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
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static getBetById(req, res) {
    const betsDb = new Database('BetHistory');
    betsDb
      .findOne({ _id: ObjectID(req.params.betId) }, {})
      .then((result) => {
        if (result) {
          res.status(200).send({ data: result });
        } else {
          res.status(500).send({ err: 'Bet with Id ' + req.params.betId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static createBet(req, res) {
    const betsDb = new Database('BetHistory');
    /** @type { BetHistory } */
    const betData = req.body;
    betsDb
      .insertOne(betData)
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}

module.exports = BetsController;
