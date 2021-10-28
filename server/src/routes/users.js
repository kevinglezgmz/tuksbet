const router = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const multer = require('multer');

router.get('/', usersController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', multer().none(), usersController.createUser);
router.patch('/:userId', multer().none(), usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

module.exports = router;
