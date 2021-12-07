const { getObjectId } = require('../utils');
const Database = require('../models/database.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

/** Google authentication library */
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.google_client_id);

/** Facebook verifies tokens with their api */
const axios = require('axios').default;

class SessionsController {
  static loginUser(req, res) {
    if (!req.body.email && !req.body.password) {
      res.status(400).send({ msg: 'Missing email or password' });
      return;
    }

    const usersDb = new Database('Users');
    usersDb
      .findOne({ email: req.body.email.toLowerCase() })
      .then((user) => {
        return new Promise((success, reject) => {
          if (!user || !user.email || !bcrypt.compareSync(req.body.password, user.password)) {
            reject({ statusCode: 400, msg: 'Could not find an user with that email and password combination' });
          }
          success({ user });
        });
      })
      .then(({ user }) => {
        return new Promise((success, reject) => {
          createOrUpdateUserToken(user._id, user.username, user.email)
            .then((sessionStatusAndToken) => {
              success({ ...sessionStatusAndToken, user });
            })
            .catch(reject);
        });
      })
      .then(({ statusInsert, token, user }) => {
        res.status(200).send({ statusInsert, token, userId: user._id, username: user.username, roles: user.roles });
      })
      .catch(({ statusCode, msg }) => {
        res.status(statusCode).send({ err: msg });
      });
  }

  static async injectGoogleUser(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const authHeaderToken = authHeader.split(' ')[1] || undefined;
    const ticket = await client.verifyIdToken({
      idToken: authHeaderToken,
      audience: process.env.google_client_id,
    });

    if (!ticket || ticket.getPayload().aud !== process.env.google_client_id) {
      res.status(400), send({ msg: 'Invalid Google token' });
      return;
    }

    // Get all details from payload and update social user (profileData)
    const googleUserDetails = ticket.getPayload();
    Object.assign(googleUserDetails, req.body.socialUser);
    req.body.socialUser = googleUserDetails;
    next();
  }

  static async injectFacebookUser(req, res, next) {
    const authHeader = req.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).send({ err: 'Not authorized' });
      return;
    }

    const authHeaderToken = authHeader.split(' ')[1] || undefined;
    const facebookUri =
      'https://graph.facebook.com/debug_token?input_token=' +
      authHeaderToken +
      '&access_token=' +
      process.env.facebook_access_token;

    try {
      var { data } = await axios.get(facebookUri);
    } catch (err) {
      res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      return;
    }

    if (!data || !data.data || data.data.application !== 'Tuksbet') {
      res.status(400).send({ msg: 'Invalid Facebook token' });
      return;
    }

    next();
  }

  static async loginSocialUser(req, res) {
    const socialUserDetails = req.body.socialUser;
    const usersDb = new Database('Users');
    let user = await usersDb.findOne({ email: socialUserDetails.email.toLowerCase() }, {});
    if (!user) {
      // User is not registered, register the user and log it in
      const isUserInserted = await registerUserFromSocial(socialUserDetails);
      user = { _id: isUserInserted.insertedId, username: socialUserDetails.name };
      // Generate a new token for the user to authenticate with the server
      // const sessionStatusAndToken = await createOrUpdateUserToken(getObjectId(isUserInserted.insertedId));
      // res.send({
      //   ...sessionStatusAndToken,
      //   userId: isUserInserted.insertedId,
      //   username: socialUserDetails.name,
      //   roles: socialUserDetails.roles,
      // });
    }

    try {
      // Associate the user identity with the user's id
      const isIdentityInserted = await registerOrUpdateUserIdentity(socialUserDetails, user._id, req.body.provider);
      // Generate a new token, and log the user in
      const sessionStatusAndToken = await createOrUpdateUserToken(user._id, socialUserDetails.name, socialUserDetails.email);
      res.send({ ...sessionStatusAndToken, userId: user._id, username: user.username, roles: user.roles });
    } catch (err) {
      res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
    }
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
        res.status(500).send({ err: 'Unexpected error, please try again' + err });
      });
  }
}

function registerUserFromSocial(userAuthDetails) {
  const usersDb = new Database('Users');
  const userToInsert = {
    email: userAuthDetails.email,
    username: userAuthDetails.name,
    balance: 5000.0,
    roles: 'User',
  };
  return usersDb.insertOne(userToInsert);
}

function registerOrUpdateUserIdentity(profileData, userId, provider) {
  const userIdentitiesDb = new Database('UserIdentities');
  return userIdentitiesDb.insertOrUpdateOne(
    { userId: getObjectId(userId.toString()), provider: provider.toLowerCase() },
    { $set: { profileData, userId, provider: provider.toLowerCase() } },
    { upsert: true }
  );
}

function createOrUpdateUserToken(userId, username, email) {
  const token = jwt.sign({ userId: userId.toString(), username, email }, SECRET_JWT);
  const sessionsDb = new Database('Sessions');
  return new Promise((success, reject) => {
    sessionsDb
      .insertOrUpdateOne(
        { userId: getObjectId(userId.toString()) },
        {
          $set: {
            token,
            userId: userId,
            lastLogin: new Date(),
          },
        },
        { upsert: true }
      )
      .then((sessionStatus) => {
        if (sessionStatus.acknowledged) {
          success({ statusInsert: sessionStatus, token });
        } else {
          reject({ statusCode: 500, msg: 'Unexpected error ocurred, please try again' });
        }
      });
  });
}

module.exports = SessionsController;
