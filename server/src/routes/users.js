const router = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const multer = require('multer');
const authentication = require('../middlewares/authentication');

router.get('/', usersController.getAllUsers);
router.get('/:userId', authentication, usersController.getUserById);
router.post('/', multer().none(), usersController.createUser);
router.patch('/:userId', authentication, multer().none(), usersController.updateUser);
router.delete('/:userId', authentication, usersController.deleteUser);

module.exports = router;
