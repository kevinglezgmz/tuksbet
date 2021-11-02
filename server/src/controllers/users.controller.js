const { getObjectId } = require('../utils');
const Database = require('../models/database.model.js');
const bcrypt = require('bcrypt');

/**
 * @typedef { import('./dataTypes').User } User
 */

function validateUserData(userData) {
  const createUserFields = ['username', 'email', 'password'];
  return createUserFields.filter((field) => !userData[field]);
}

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
          const filteredUsersData = results.map((user) => {
            return { userId: user._id, username: user.username, email: user.email };
          });
          res.status(200).send(filteredUsersData);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
      });
  }

  static getUserById(req, res) {
    if (req.userId !== req.params.userId) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const usersDb = new Database('Users');
    usersDb
      .findOne({ _id: getObjectId(req.params.userId) }, {})
      .then((user) => {
        if (user) {
          const userData = { userId: user._id, username: user.username, email: user.email, balance: user.balance };
          res.status(200).send(userData);
        } else {
          res.status(400).send({ err: 'User ' + req.params.userId + ' does not exist' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
      });
  }

  static createUser(req, res) {
    /** @type { User } */
    const userData = req.body;
    const missingFields = validateUserData(userData);
    if (missingFields.length > 0) {
      res.status(400).send({ err: 'The following fields are missing: ' + missingFields.join(', ') });
      return;
    }

    const hash = bcrypt.hashSync(userData.password, 10);
    const userToInsert = {
      username: userData.username,
      email: userData.email,
      password: hash,
      balance: 0.0,
    };

    const usersDb = new Database('Users');
    usersDb
      .insertOne(userToInsert)
      .then((result) => {
        const status = { inserted: result.acknowledged, userId: result.insertedId };
        res.status(201).send(status);
      })
      .catch((err) => {
        res.status(400).send({ err: 'This user already exists' });
      });
  }

  static deleteUser(req, res) {
    if (req.userId !== req.params.userId) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const usersDb = new Database('Users');
    usersDb
      .deleteOne({ _id: getObjectId(req.params.userId) })
      .then((result) => {
        if (result.acknowledged) {
          res.send({ msg: 'User deleted successfully, we hope to see you back again soon' });
        } else {
          throw 'Unexpected error, please try again';
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
      });
  }

  static updateUser(req, res) {
    if (req.userId !== req.params.userId) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const { password, username } = req.body;
    const newUserInfo = {};

    if (password) {
      const hash = bcrypt.hashSync(password, 10);
      newUserInfo.password = hash;
    } else if (username) {
      newUserInfo.username = username;
    }

    const usersDb = new Database('Users');
    usersDb
      .updateOne({ _id: getObjectId(req.params.userId) }, { $set: newUserInfo })
      .then((result) => {
        const updatedField = password ? 'password' : 'username';
        if (result.acknowledged) {
          res.send({ msg: 'User ' + updatedField + ' updated successfully' });
        } else {
          throw 'Unexpected error, please try again';
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }
}

module.exports = UsersController;
