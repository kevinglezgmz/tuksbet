const jwt = require('jsonwebtoken');
const Database = require('../models/database.model');
const { getObjectId } = require('../utils');
const SECRET_JWT = process.env.SECRET_JWT || 'h@la123Cr@yola';

function authentication(req, res, next) {
  /** Extract token from headers */
  const authHeader = req.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).send({ err: 'Not authorized' });
    return;
  }
  const authHeaderToken = authHeader.split(' ')[1] || undefined;

  /** JWT Token validation */
  let token = undefined;
  try {
    token = jwt.verify(authHeaderToken, SECRET_JWT);
  } catch (err) {
    res.status(403).send({ err: 'Invalid token' });
    return;
  }

  /** Token verification in DB */
  const sessionsDb = new Database('Sessions');
  sessionsDb
    .findOne({ userId: getObjectId(token.userId) }, {})
    .then((sessionRecord) => {
      if (!sessionRecord || sessionRecord.token !== authHeaderToken) {
        res.status(401).send({ err: 'Not authorized' });
        return;
      }
      /** Inject userId into the request */
      req.userId = token.userId;
      next();
    })
    .catch((err) => {
      res.status(statusCode).send({ err: 'Unexpected error, please try again' });
    });
}

module.exports = authentication;
