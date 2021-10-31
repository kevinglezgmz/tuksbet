const router = require('express').Router();
const sessionsController = require('../controllers/sessions.controller');

const authentication = require('../middlewares/authentication');

router.post('/login', sessionsController.loginUser);
router.get('/logout', authentication, sessionsController.logoutUser);

module.exports = router;
