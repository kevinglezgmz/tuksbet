const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').ChatHistory } ChatHistory
 */

function validateMessageData(messageData) {
  const createMessageData = ['userId', 'message'];
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
      userId: getObjectId(userId),
      message,
      chatRoomId: getObjectId(req.params.chatRoomId),
    };

    console.log(messageData.chatRoomId);
    console.log(req.params);

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
    const { message } = req.body;
    const messagesDb = new Database('ChatHistory');
    messagesDb
      .updateOne(
        { _id: getObjectId(req.params.chatMessageId), chatRoomId: getObjectId(req.params.chatRoomId) },
        { $set: { message } }
      )
      .then((result) => {
        if (result.acknowledged && result.modifiedCount === 1) {
          res.status(200).send({ msg: 'Successfully modified the message data' });
        } else {
          res.status(400).send({ msg: 'Could not find the specified message' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteChatMessage(req, res) {
    const messagesDb = new Database('ChatHistory');
    messagesDb
      .deleteOne({ _id: getObjectId(req.params.chatMessageId), chatRoomId: getObjectId(req.params.chatRoomId) })
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
