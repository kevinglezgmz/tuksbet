const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').Transaction } Transaction
 */

function validateTransactionData(transactionData) {
  const createTransactionFields = ['userId', 'amount', 'isDeposit'];
  return createTransactionFields.filter((field) => transactionData[field] === undefined);
}

class TransactionsController {
  static getAllTransactions(req, res) {
    const transactionsDb = new Database('Transactions');
    transactionsDb
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
          $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromUser', 0] }, '$$ROOT'] } },
        },
        { $match: { userId: getObjectId(req.userId) } },
        {
          $project: {
            _id: 1,
            username: 1,
            userId: 1,
            amount: 1,
            isDeposit: 1,
            status: 1,
            transactionDate: 1,
          },
        },
      ])
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No transactions found!' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
      });
  }

  static async getTransactionById(req, res) {
    const transactionsDb = new Database('Transactions');
    try {
      /** @type { Transaction } */
      const transaction = await transactionsDb.findOne({ _id: getObjectId(req.params.transactionId) }, {});
      if (transaction && transaction.userId.equals(getObjectId(req.userId))) {
        res.status(200).send(transaction);
      } else {
        res.status(401).send({ err: 'Not authorized' });
      }
    } catch (err) {
      res.status(500).send({ err: 'Unexpected error, please try again' });
    }
  }

  static async createTransaction(req, res) {
    const transactionsDb = new Database('Transactions');
    /** @type { Transaction } */
    const transactionData = req.body;
    const missingFields = validateTransactionData(transactionData);
    if (missingFields.length > 0) {
      res.status(400).send({ err: 'The following fields are missing: ' + missingFields.join(', ') });
      return;
    }

    if (req.userId !== transactionData.userId) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const transactionToInsert = {
      userId: getObjectId(transactionData.userId),
      amount: parseFloat(transactionData.amount),
      isDeposit: transactionData.isDeposit,
      status: 'pending',
      transactionDate: new Date(),
    };

    const insertStatus = await transactionsDb.insertOne(transactionToInsert);
    if (insertStatus.acknowledged) {
      res.status(201).send(transactionToInsert);
    } else {
      res.status(500).send({ err: 'Unexpected error, please try again' });
    }
  }

  static async updateTransaction(req, res) {
    const transactionsDb = new Database('Transactions');
    const { status } = req.body;
    if (!status) {
      res.status(400).send({ err: 'You can only update the status of a transaction' });
      return;
    }

    /** @type { Transaction } */
    const transaction = await transactionsDb.findOne({ _id: getObjectId(req.params.transactionId) }, {});
    if (transaction.status !== 'pending') {
      res.status(403).send({ err: 'You can not update a transaction that has already been completed' });
      return;
    }
    const updateStatus = await transactionsDb.updateOne(
      { _id: getObjectId(req.params.transactionId) },
      { $set: { status } }
    );
    if (updateStatus.acknowledged && updateStatus.modifiedCount > 0) {
      /** If the transaction was completed update the user's balance */
      const usersDb = new Database('Users');
      if (status === 'completed') {
        await usersDb.updateOne(
          { _id: transaction.userId },
          { $inc: { balance: transaction.isDeposit ? transaction.amount : transaction.amount * -1 } }
        );
      }
      res.status(200).send({ msg: 'Transaction updated successfully' });
    } else {
      res.status(500).send({ err: 'Unexpected error, please try again' });
    }
  }

  static deleteTransaction(req, res) {
    const transactionsDb = new Database('Transactions');
    transactionsDb
      .deleteOne({ _id: getObjectId(req.params.transactionId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Transaction deleted successfully' });
        } else {
          throw 'Could not find the specified transaction';
        }
      })
      .catch((err) => {
        res.status(400).send({ err: 'Could not find the specified transaction' });
      });
  }
}

module.exports = TransactionsController;
