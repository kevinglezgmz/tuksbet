const { getObjectId } = require('../utils');
const Database = require('../models/database.model.js');
const AWS = require('aws-sdk');
const { AWSError } = require('aws-sdk');
const { createHmac } = require('crypto');
const axios = require('axios').default;
const { AxiosResponse } = require('axios');
const jwt = require('jsonwebtoken');
const { UUID } = require('bson');
const cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: 'us-east-1' });

const secretHash = process.env.AWS_COGNITO_SECRET_HASH;
const clientId = process.env.AWS_COGNITO_CLIENT_ID;
const redirectURL = process.env.AWS_COGNITO_SUCCESS_LOGIN_REDIRECT_URI;
const cognitoRedirectUri = process.env.AWS_COGNITO_REDIRECT_URI;

/**
 * @typedef { import('./dataTypes').User } User
 */

function validateUserData(userData) {
  const createUserFields = ['username', 'email', 'password'];
  return createUserFields.filter((field) => !userData[field]);
}

class CognitoController {
  static async verifyEmailAddressCognito(req, res) {
    const usersDb = new Database('Users');
    const user = await usersDb.findOne({ email: req.body.email }, {});
    if (!user) {
      res.status(400).send({ err: 'This user does not exist.' });
      return;
    }
    const hash = createHmac('SHA256', secretHash)
      .update(user.AWSUsername + clientId)
      .digest('base64');
    /** @type { AWS.CognitoIdentityServiceProvider.ConfirmSignUpRequest } */
    const params = {
      ClientId: clientId,
      ConfirmationCode: req.body.confirmationCode,
      Username: user.AWSUsername,
      SecretHash: hash,
    };

    try {
      const response = await cognitoClient.confirmSignUp(params).promise();
      await usersDb.updateOne({ email: req.body.email }, { $set: { needsConfirmation: false } });
      res.send({ msg: 'Confirmed successfuly' });
    } catch (error) {
      res.status(400).send({ err: error });
    }
  }

  static async changePasswordCognito(req, res) {
    /** @type { AWS.CognitoIdentityServiceProvider.ChangePasswordRequest } */
    const params = {
      AccessToken: req.authHeaderToken,
      PreviousPassword: req.body.oldPassword,
      ProposedPassword: req.body.newPassword,
    };

    try {
      const response = await cognitoClient.changePassword(params).promise();
      res.send({ msg: 'Password changed' });
    } catch (error) {
      res.status(400).send({ err: error });
    }
  }

  static async createUserCognito(req, res) {
    /** @type { User } */
    const userData = req.body;
    const missingFields = validateUserData(userData);
    if (missingFields.length > 0) {
      res.status(400).send({ err: 'The following fields are missing: ' + missingFields.join(', ') });
      return;
    }

    const usersDb = new Database('Users');
    const user = await usersDb.findOne({ email: req.body.email.toLowerCase() });
    if (user != null && user.AWSUsername && user.needsConfirmation === false) {
      res.status(400).send({ err: 'This email is already registered. Try to login with your account.' });
      return;
    }

    if (user != null && user.AWSUsername && user.needsConfirmation === true) {
      UsersController.resendConfirmationCodeCognito(req, res);
      return;
    }

    const AWSUsername = new UUID().toString();
    // If user registered through social first, add the AWS Username
    if (user != null && !user.AWSUsername) {
      try {
        await usersDb.updateOne({ email: user.email }, { $set: { AWSUsername: AWSUsername, needsConfirmation: true } });
      } catch (err) {}
    }

    const hash = createHmac('SHA256', secretHash)
      .update(AWSUsername + clientId)
      .digest('base64');

    const userToInsert = {
      /** @type { string }*/
      username: userData.username,
      AWSUsername: AWSUsername,
      email: userData.email.toLowerCase(),
      roles: 'User',
      secretHash: hash,
      balance: 5000.0,
      needsConfirmation: true,
    };

    if (!user) {
      try {
        const userInsertResult = await usersDb.insertOne(userToInsert);
        userToInsert._id = userInsertResult.insertedId;
      } catch (error) {
        res.status(500).send('Unexpected error ocurred. Try again.');
      }
    } else {
      userToInsert._id = user._id;
    }

    /** @type { AWS.CognitoIdentityServiceProvider.SignUpRequest } */
    const cognitoSignUpParams = {
      ClientId: clientId,
      Password: userData.password,
      Username: AWSUsername,
      SecretHash: hash,
      UserAttributes: [{ Name: 'email', Value: userData.email }],
    };
    try {
      var response = await cognitoClient.signUp(cognitoSignUpParams).promise();
    } catch (/** @type { AWSError }*/ error) {
      if (error.code === 'UsernameExistsException') {
        res.send({ err: 'This username already exists.' });
      } else {
        res.send({ err: error });
      }
      return;
    }

    res.send({ needsConfirmation: !response.UserConfirmed, userId: userToInsert._id });
  }

  static async resendConfirmationCodeCognito(req, res) {
    const usersDb = new Database('Users');
    const user = await usersDb.findOne({ email: req.body.email.toLowerCase() });
    if (!user || !user.AWSUsername) {
      res.status(400).send({ err: 'Could not send confirmation email. User does not exist.' });
    }
    const hash = createHmac('SHA256', secretHash)
      .update(user.AWSUsername + clientId)
      .digest('base64');
    try {
      await cognitoClient
        .resendConfirmationCode({ ClientId: clientId, Username: user.AWSUsername, SecretHash: hash })
        .promise();
      res.send({ msg: 'Resent confirmation' });
    } catch (error) {
      res.status(400).send({ msg: 'Could not resend confirmation' });
    }
    return;
  }

  static async loginUserCognito(req, res) {
    const usersDb = new Database('Users');
    const user = await usersDb.findOne({ email: req.body.email }, {});
    if (!user || !user.email) {
      res.status(400).send({ err: 'This user does not exist.' });
      return;
    }

    const hash = createHmac('SHA256', secretHash)
      .update(user.AWSUsername + clientId)
      .digest('base64');

    /** @type { AWS.CognitoIdentityServiceProvider.InitiateAuthRequest } */
    const params = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId,
      AuthParameters: {
        USERNAME: user.AWSUsername,
        PASSWORD: req.body.password,
        SECRET_HASH: hash,
      },
    };

    try {
      var tokens = await cognitoClient.initiateAuth(params).promise();
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        res.status(400).send({ err: error.message });
      } else {
        res.status(400).send({ err: error.message });
        // res.status(400).send({ err: 'Unexpected error, please try again' });
      }
      return;
    }

    const loginResponse = {
      token: tokens.AuthenticationResult.AccessToken,
      refreshToken: tokens.AuthenticationResult.RefreshToken,
      expiresIn: tokens.AuthenticationResult.ExpiresIn * 1000,
      issuedAt: Date.now(),
      userId: user._id,
      username: user.username,
      roles: user.roles,
    };
    res.send(loginResponse);
  }

  static async logoutUserCognito(req, res) {
    /** @type { AWS.CognitoIdentityServiceProvider.RevokeTokenRequest } */
    const params = {
      ClientId: clientId,
      Token: req.authHeaderToken,
      ClientSecret: secretHash,
    };

    try {
      const response = await cognitoClient.revokeToken(params).promise();
      res.send({ msg: 'Succesfully signed out' });
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        res.status(400).send({ err: error.message });
      } else {
        res.status(400).send({ err: error.message });
      }
      return;
    }
  }

  static async refreshAccessTokenCognito(req, res) {
    let user = null;
    if (req.body.provider) {
      const userIdentities = new Database('UserIdentities');
      user = await userIdentities
        .findAggregate([
          {
            $match: { userId: getObjectId(req.body.userId) },
          },
          {
            $lookup: {
              from: 'Users',
              localField: 'userId',
              foreignField: '_id',
              as: 'fromUsers',
            },
          },
          {
            $replaceRoot: { newRoot: { $mergeObjects: [{ $arrayElemAt: ['$fromUsers', 0] }, '$$ROOT'] } },
          },
          {
            $match: { provider: req.body.provider },
          },
          {
            $project: {
              _id: 1,
              username: 1,
              userId: 1,
              email: 1,
              identity: 1,
              provider: 1,
              AWSUsername: 1,
            },
          },
        ])
        .next();
    } else {
      const usersDb = new Database('Users');
      user = await usersDb.findOne({ _id: getObjectId(req.body.userId) });
    }

    if (!user) {
      res.status(400).send({ err: 'This user does not exist.' });
      return;
    }

    const hash = createHmac('SHA256', secretHash)
      .update(user.AWSUsername + clientId)
      .digest('base64');

    /** @type { AWS.CognitoIdentityServiceProvider.InitiateAuthRequest } */
    const params = {
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      ClientId: clientId,
      AuthParameters: {
        REFRESH_TOKEN: req.authHeaderToken,
        SECRET_HASH: hash,
      },
    };

    try {
      var tokens = await cognitoClient.initiateAuth(params).promise();
    } catch (error) {
      if (error.code === 'NotAuthorizedException') {
        res.status(400).send({ err: error.message });
      } else {
        res.status(400).send({ err: 'Unexpected error, please try again' });
      }
      return;
    }

    const loginResponse = {
      token: tokens.AuthenticationResult.AccessToken,
      expiresIn: tokens.AuthenticationResult.ExpiresIn * 1000,
      issuedAt: Date.now(),
      userId: user._id,
      username: user.username,
      roles: user.roles,
    };
    res.send(loginResponse);
  }

  static async loginCodeGrantCognito(req, res) {
    const authCode = req.query.code;
    const tokenParams = new URLSearchParams();
    tokenParams.append('grant_type', 'authorization_code');
    tokenParams.append('code', authCode);
    tokenParams.append('client_id', clientId);
    tokenParams.append('redirect_uri', cognitoRedirectUri);
    let buff = Buffer.from(clientId + ':' + secretHash);
    let base64data = buff.toString('base64');
    try {
      /** @type { AxiosResponse<{ access_token: string; refresh_token: string; id_token: string; expires_in: number }, any> } */
      const response = await axios.post('https://tuksbet.auth.us-east-1.amazoncognito.com/oauth2/token', tokenParams, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: 'Basic ' + base64data,
        },
      });
      var responseData = response.data;
    } catch (error) {
      res.send(error.response.data);
      return;
    }

    const decodedIdToken = jwt.decode(responseData.id_token);
    const usersDb = new Database('Users');

    let user = await usersDb.findOne({ email: decodedIdToken.email });
    if (!user) {
      try {
        var insertedUser = await registerUserFromSocial(decodedIdToken);
        user = { _id: insertedUser.insertedId, roles: "User", username: decodedIdToken.name };
      } catch (error) {
        res.send(error);
        return;
      }
    }

    const identitites = decodedIdToken.identities;
    const provider = identitites[0].providerName.toLowerCase();
    const userIdentitiesDb = new Database('UserIdentities');
    let userIdentity = await userIdentitiesDb.findOne({
      userId: getObjectId(user._id),
      provider: provider,
    });
    if (!userIdentity) {
      try {
        await registerUserIdentity(user, identitites[0]);
      } catch (error) {
        res.send(error);
        return;
      }
    }

    const URLParams = new URLSearchParams();
    URLParams.append('token', responseData.access_token);
    URLParams.append('refreshToken', responseData.refresh_token);
    URLParams.append('expiresIn', responseData.expires_in * 1000);
    URLParams.append('issuedAt', Date.now());
    URLParams.append('userId', user._id);
    URLParams.append('username', user.username);
    URLParams.append('roles', user.roles);
    URLParams.append('provider', provider);
    res.redirect(redirectURL + '?' + URLParams.toString());
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

function registerUserIdentity(user, identity) {
  const AWSUsername = identity.providerName.toLowerCase() + '_' + identity.userId;
  const userIdentitiesDb = new Database('UserIdentities');
  const identityToInsert = {
    userId: user._id,
    identity: identity,
    provider: identity.providerName.toLowerCase(),
    AWSUsername: AWSUsername,
  };
  return userIdentitiesDb.insertOne(identityToInsert);
}

module.exports = CognitoController;
