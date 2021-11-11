const { Socket } = require('socket.io');

/** Events */
const chatEvents = require('./chat.events');

/**
 * @param { Socket } clientSocket
 */
const mainEventHandler = (clientSocket) => {
  chatEvents(clientSocket);
};

module.exports = mainEventHandler;
