const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');
const axios = require('axios').default;

const userPoolId = 'us-east-1_xeZccijHX';
const AWSRegion = 'us-east-1';
const WellKnownJWKSURL = `https://cognito-idp.${AWSRegion}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;

const pems = {};

async function injectToken(req, res, next) {
  /** Extract token from headers */
  const authHeader = req.get('Authorization');
  const userId = req.get('UserId');
  if (!authHeader || !authHeader.startsWith('Bearer ') || !userId) {
    res.status(401).send({ err: 'Not authorized' });
    return;
  }
  const authHeaderToken = authHeader.split(' ')[1] || undefined;
  req.authHeaderToken = authHeaderToken;
  req.userId = userId;
  next();
}

function validateToken(req, res, next) {
  const token = req.authHeaderToken;
  /** JWT Token validation */
  const decodedJWT = jwt.decode(token, { complete: true });
  if (decodedJWT === null) {
    res.status(401).send({ err: 'Not authorized' });
    return;
  }
  req.decodedJWT = decodedJWT;
  next();
}

async function verifyTokenSignatures(req, res, next) {
  if (Object.keys(pems).length === 0) {
    Object.assign(pems, await getPems());
  }

  const decodedJWT = req.decodedJWT;
  const token = req.authHeaderToken;

  /** Extract pem using kid hint */
  const kid = decodedJWT.header.kid;
  const pem = pems[kid];
  if (!pem) {
    res.status(401).send({ err: 'Not authorized' });
    return;
  }

  /** Verify the token using the extracted pem */
  try {
    var tokenData = jwt.verify(token, pem);
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).send({ err: 'This token has expired' });
    } else {
      res.status(401).send({ err: 'Invalid token signature claims' });
    }
    return;
  }

  req.tokenData = tokenData;
  next();
}

function validateAccessToken(req, res, next) {
  const tokenData = req.tokenData;
  if (tokenData.token_use !== 'access') {
    res.status(401).send({ err: 'This is not an access token' });
    return;
  }
  next();
}

async function getPems() {
  try {
    var JWKSResponse = await axios.get(WellKnownJWKSURL);
  } catch (error) {
    console.log(error);
    console.log('Error! Unable to download JWKs');
  }
  const pems = {};
  const { keys } = JWKSResponse.data;
  for (let i = 0; i < keys.length; i++) {
    const key_id = keys[i].kid;
    const modulus = keys[i].n;
    const exponent = keys[i].e;
    const key_type = keys[i].kty;
    const jwk = { kty: key_type, n: modulus, e: exponent };
    const pem = jwkToPem(jwk);
    pems[key_id] = pem;
  }
  return pems;
}

module.exports = {
  cognitoAccessTokenAuth: [injectToken, validateToken, verifyTokenSignatures, validateAccessToken],
  cognitoRefreshTokenValidate: [injectToken],
};
