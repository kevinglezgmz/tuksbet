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
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
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
          res.status(201).send({ status: result });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static updateChat(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    chatRoomsDb
      .updateOne({ _id: ObjectID(req.params.chatRoomId) }, { $set: req.body })
      .then((result) => {
        res.status(201).send({ msg: 'Successfuly modified the chat room data' });
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteChat(req, res) {
    const chatsDb = new Database('ChatRooms');
    chatsDb
      .deleteOne({ _id: getObjectId(req.params.chatRoomId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Chat deleted successfuly' });
        } else {
          res.status(400).send({ err: 'Could not find the specified chat' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }
}

module.exports = ChatsController;
