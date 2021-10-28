const { ObjectID } = require('bson');
const Database = require('../models/database.model.js');

/**
 * @typedef { import('./dataTypes').Transaction } Transaction
 */

class TransactionsController {
  static getAllTransactions(req, res) {
    const transactionsDb = new Database('Transactions');
    transactionsDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No transactions found!' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static getTransactionById(req, res) {
    const transactionsDb = new Database('Transactions');
    transactionsDb
      .findOne({ _id: ObjectID(req.params.transactionId) }, {})
      .then((result) => {
        if (result) {
          res.status(200).send({ data: result });
        } else {
          res.status(400).send({ err: 'Transaction ' + req.params.transactionId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static createTransaction(req, res) {
    const transactionsDb = new Database('Transactions');
    /** @type { Transaction } */
    const transactionData = req.body;
    transactionsDb
      .insertOne(transactionData)
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  static updateTransaction(req, res) {
    const transactionsDb = new Database('Transactions');
    transactionsDb
      .updateOne({ _id: ObjectID(req.params.transactionId) }, { $set: req.body })
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}

module.exports = TransactionsController;
