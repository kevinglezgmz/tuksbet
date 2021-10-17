const { ObjectID } = require('bson');
const Database = require('../models/database.model.js');

/**
 * @typedef { import('./dataTypes').ChatHistory } ChatHistory
 */

class ChatsController {
  static getAllChatMessages(req, res) {
    const chatsDb = new Database('ChatHistory');
    chatsDb
      .find({ chatRoomId: ObjectID(req.params.chatRoomId) }, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'There are no messages in this chatroom yet' });
        } else {
          res.status(200).send({ data: results });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }

  static createNewChatMessage(req, res) {
    const chatsDb = new Database('ChatHistory');
    const chatMsgData = req.body;
    chatMsgData.chatRoomId = ObjectID(req.params.chatRoomId);
    chatsDb
      .insertOne(chatMsgData)
      .then((result) => {
        if (result) {
          res.status(200).send({ status: result });
        }
      })
      .catch((err) => {
        res.status(500).send({ err });
      });
  }
}

module.exports = ChatsController;
