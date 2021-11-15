const { Socket } = require('socket.io');
const axios = require('axios').default;

/** Events */
const initChatEventsSocket = require('./chat.events');
const initRouletteEventsSocket = require('./roulette.events');

/**
 * @param { Socket } ioSocket
 */
function setMainSocketInstance(ioSocket) {
  axios
    .get(process.env.SERVER_URL + 'api/games')
    .then((response) => {
      /** @type { {_id: string; gameName: string}[] } Game[] */
      const games = response.data;
      initRouletteEventsSocket(ioSocket, games.find((game) => game.gameName === 'Roulette')._id);
    })
    .catch((err) => {
      console.log(err);
    });
  initChatEventsSocket(ioSocket);
}

module.exports = setMainSocketInstance;
