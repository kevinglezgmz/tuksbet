const { getObjectId } = require('../utils');
const Database = require('../models/database.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

class SessionsController {
  static loginUser(req, res) {
    if (!req.body.email && !req.body.password) {
      res.status(400).send({ msg: 'Missing email or password' });
      return;
    }

    const usersDb = new Database('Users');
    const sessionsDb = new Database('Sessions');

    usersDb
      .findOne({ email: req.body.email })
      .then((user) => {
        return new Promise((success, reject) => {
          if (!user || !user.email || !bcrypt.compareSync(req.body.password, user.password)) {
            reject({ statusCode: 400, msg: 'Could not find an user with that email and password combination' });
          }
          const token = jwt.sign({ userId: user._id, username: user.username, email: user.email }, SECRET_JWT);
          success({ user, token });
        });
      })
      .then(({ user, token }) => {
        return new Promise((success, reject) => {
          sessionsDb
            .insertOrUpdateOne(
              { userId: user._id },
              {
                $set: {
                  token,
                  userId: user._id,
                  lastLogin: new Date(),
                },
              },
              { upsert: true }
            )
            .then((status) => {
              if (status.acknowledged) {
                success({ statusInsert: status, token });
              } else {
                reject({ statusCode: 500, msg: 'Unexpected error ocurred, please try again' });
              }
            });
        });
      })
      .then(({ statusInsert, token }) => {
        res.status(200).send({ statusInsert, token });
      })
      .catch(({ statusCode, msg }) => {
        res.status(statusCode).send({ err: msg });
      });
  }

  static logoutUser(req, res) {
    const sessionsDb = new Database('Sessions');
    sessionsDb
      .deleteOne({ userId: getObjectId(req.userId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Successfully logged out' });
        } else {
          res.status(400).send({ err: 'You can not logout if you are not logged in' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error, please try again' });
      });
  }
}

module.exports = SessionsController;
