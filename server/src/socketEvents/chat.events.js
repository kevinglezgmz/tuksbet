const { Socket } = require('socket.io');

/**
 * @param { Socket } clientSocket
 */
const chatEvents = (clientSocket) => {
  clientSocket.on('new-message', (newMessage) => {
    clientSocket.to(newMessage.chatRoomId).emit('new-message', newMessage);
  });

  clientSocket.on('join-room', (room) => {
    clientSocket.join(room);
  });

  clientSocket.on('leave-room', (room) => {
    clientSocket.leave(room);
  });
};

module.exports = chatEvents;
