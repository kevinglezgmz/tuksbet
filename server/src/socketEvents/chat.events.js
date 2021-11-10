const { Socket } = require('socket.io');

/**
 * @param { Socket } clientSocket
 */
const chatEvents = (clientSocket) => {
  clientSocket.on('new-message', (newMessage) => {
    console.log(newMessage);
  });

  clientSocket.on('join-room', (room) => {
    console.log(room);
    console.log(clientSocket.rooms);
  });
};

module.exports = chatEvents;
