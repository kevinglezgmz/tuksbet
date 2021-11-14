const { Socket } = require('socket.io');

/** Events */
const initChatEventsSocket = require('./chat.events');
const initRouletteEventsSocket = require('./roulette.events');

/**
 * @param { Socket } ioSocket
 */
function setMainSocketInstance(ioSocket) {
  initChatEventsSocket(ioSocket);
  initRouletteEventsSocket(ioSocket);
}

module.exports = setMainSocketInstance;
