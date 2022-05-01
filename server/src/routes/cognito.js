const router = require('express').Router();
const CognitoController = require('../controllers/cognito.controller.js');
const { cognitoAccessTokenAuth, cognitoRefreshTokenValidate } = require('../middlewares/cognitoAuthentication');

router.post('/signup', CognitoController.createUserCognito);
router.post('/verify', CognitoController.verifyEmailAddressCognito);
router.post('/verify/resend', CognitoController.resendConfirmationCodeCognito);
router.post('/login', CognitoController.loginUserCognito);
router.post('/login/token/refresh', cognitoRefreshTokenValidate, CognitoController.refreshAccessTokenCognito);
router.post('/password/change', cognitoAccessTokenAuth, CognitoController.changePasswordCognito);
router.get('/login/token', CognitoController.loginCodeGrantCognito);
router.get('/logout/token', cognitoRefreshTokenValidate, CognitoController.logoutUserCognito);

module.exports = router;
