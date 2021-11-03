const Database = require('../models/database.model.js');
const { getObjectId } = require('../utils.js');

/**
 * @typedef { import('./dataTypes').ChatRoom } ChatRoom
 */

class ChatRoomsController {
  static getAllChatRooms(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    chatRoomsDb
      .find({}, {})
      .toArray()
      .then((results) => {
        if (results.length === 0) {
          res.status(400).send({ msg: 'The are no chatrooms in the database yet' });
        } else {
          res.status(200).send(results);
        }
      })
      .catch((err) => {
        res.status(500).send({ msg: 'Unexpected error ocurred, please try again' });
      });
  }

  static createNewChatRoom(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    const { chatRoomName } = req.body;
    if (!chatRoomName) {
      res.status(400).send({ msg: 'Please set the name of the chat room' });
      return;
    }

    chatRoomsDb
      .insertOne({ chatRoomName })
      .then((status) => {
        if (status.acknowledged) {
          res.status(201).send({ msg: chatRoomName + ' chat room created successfully' });
        } else {
          res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
        }
      })
      .catch((err) => {
        res.status(400).send({ err: 'This chat room already exists!' });
      });
  }

  static updateChatRoom(req, res) {
    const { chatRoomName } = req.body;
    const chatRoomsDb = new Database('ChatRooms');
    chatRoomsDb
      .updateOne({ _id: getObjectId(req.params.chatRoomId) }, { $set: { chatRoomName } })
      .then((result) => {
        if (result.acknowledged && result.modifiedCount === 1) {
          res.status(200).send({ msg: 'Successfully changed the chat room name' });
        } else {
          res.status(400).send({ msg: 'Could not find the specified chat room' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }

  static deleteChatRoom(req, res) {
    const chatRoomsDb = new Database('ChatRooms');
    chatRoomsDb
      .deleteOne({ _id: getObjectId(req.params.chatRoomId) })
      .then((result) => {
        if (result.deletedCount > 0) {
          res.send({ msg: 'Chat room deleted successfully' });
        } else {
          res.status(400).send({ err: 'Could not find the specified chat room' });
        }
      })
      .catch((err) => {
        res.status(500).send({ err: 'Unexpected error ocurred, please try again' });
      });
  }
}

module.exports = ChatRoomsController;
