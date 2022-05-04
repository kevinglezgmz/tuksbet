const router = require('express').Router();
const ChatbotController = require('../controllers/chatbot.controller.js');

router.post('/', ChatbotController.postMessage);

module.exports = router;
