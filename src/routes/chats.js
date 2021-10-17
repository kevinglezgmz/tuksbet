const router = require('express').Router();
const ChatsController = require('../controllers/chats.controller.js');

router.get('/:chatRoomId', ChatsController.getAllChatMessages);
router.post('/:chatRoomId', ChatsController.createNewChatMessage);

module.exports = router;
