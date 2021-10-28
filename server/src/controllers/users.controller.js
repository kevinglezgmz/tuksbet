const { ObjectID } = require('bson');
const Database = require('../models/database.model.js');

/**
 * @typedef { import('./dataTypes').User } User
 */

class UsersController {
  static getAllUsers(req, res) {
    const usersDb = new Database('Users');
    usersDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'No users found!' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static getUserById(req, res) {
    const usersDb = new Database('Users');
    usersDb
      .findOne({ _id: ObjectID(req.params.userId) }, {})
      .then((result) => {
        if (result) {
          res.status(200).send({ data: result });
        } else {
          res.status(500).send({ err: 'User ' + req.params.userId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static createUser(req, res) {
    const usersDb = new Database('Users');
    /** @type { User} */
    const userData = req.body;
    usersDb
      .insertOne(userData)
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  static deleteUser(req, res) {
    const usersDb = new Database('Users');
    usersDb
      .deleteOne({ _id: ObjectID(req.params.userId) })
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }

  static updateUser(req, res) {
    const usersDb = new Database('Users');
    usersDb
      .updateOne({ _id: ObjectID(req.params.userId) }, { $set: req.body })
      .then((result) => {
        res.send({ status: result });
      })
      .catch((err) => {
        res.status(400).send(err);
      });
  }
}

module.exports = UsersController;
