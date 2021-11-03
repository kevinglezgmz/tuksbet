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
    const messageData = req.body;
    messageData['chatRoomId'] = req.params.chatRoomId;

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
    const messageData = req.body;
    const messagesDb = new Database('ChatHistory');
    messagesDb
      .updateOne({ _id: getObjectId(messageData.messageId) }, { $set: messageData })
      .then((result) => {
        res.status(201).send({ msg: 'Successfuly modified the message data' });
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteChatMessage(req, res) {
    const chatsDb = new Database('ChatHistory');
    chatsDb
      .deleteOne({ _id: getObjectId(req.body.chatRoomId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Message deleted successfuly' });
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
