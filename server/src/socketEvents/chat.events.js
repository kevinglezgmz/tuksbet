const { Socket } = require('socket.io');

/** @type { Socket } */
let io;

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function initChatEventsSocket(ioSocket) {
  io = ioSocket;
  io.on('connection', chatEvents);
}

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function chatEvents(clientSocket) {
  clientSocket.on('new-message', (newMessage) => {
    clientSocket.to(newMessage.chatRoomId).emit('new-message', newMessage);
  });

  clientSocket.on('deleted-message', (deletedMessage) => {
    console.log(deletedMessage);
    clientSocket.to(deletedMessage.chatRoomId).emit('deleted-message', deletedMessage);
  });

  clientSocket.on('join-room', (room) => {
    clientSocket.join(room);
  });

  clientSocket.on('leave-room', (room) => {
    clientSocket.leave(room);
  });
}

module.exports = initChatEventsSocket;
