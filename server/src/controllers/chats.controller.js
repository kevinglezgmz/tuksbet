const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').ChatHistory } ChatHistory
 */

function validateMessageData(messageData) {
  const createMessageData = ['userId', 'chatRoomId', 'message'];
  return createMessageData.filter((field) => !messageData[field]);
}

class ChatsController {
  static getAllChatMessages(req, res) {
    const chatsDb = new Database('ChatHistory');
    chatsDb
      .find({ chatRoomId: getObjectId(req.params.chatRoomId) }, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'There are no messages in this chatroom yet' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static createNewChatMessage(req, res) {
    const { userId, message } = req.body;
    const messageData = {
      userId,
      message,
      chatRoomId: req.params.chatRoomId,
    };

    const missingFields = validateMessageData(messageData);

    if (missingFields.length > 0) {
      res.status(400).send({ err: 'The following fields are missing: ' + missingFields.join(', ') });
      return;
    }

    const messagesDb = new Database('ChatHistory');
    messagesDb
      .insertOne(messageData)
      .then((result) => {
        if (result) {
          res.status(201).send({ status: result });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static updateChatMessage(req, res) {
    const { message, messageId } = req.body;
    const messagesDb = new Database('ChatHistory');
    messagesDb
      .updateOne({ _id: getObjectId(messageId) }, { $set: { message } })
      .then((result) => {
        res.status(201).send({ msg: 'Successfully modified the message data' });
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteChatMessage(req, res) {
    const { messageId } = req.body.messageId;
    const messagesDb = new Database('ChatHistory');
    messagesDb
      .deleteOne({ _id: getObjectId(messageId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Message deleted successfully' });
        } else {
          res.status(400).send({ err: 'Could not find the specified message' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }
}

module.exports = ChatsController;
