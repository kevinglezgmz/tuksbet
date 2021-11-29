const { Socket } = require('socket.io');
const axios = require('axios').default;

/** Events */
const initChatEventsSocket = require('./chat.events');
const initRouletteEventsSocket = require('./roulette.events');
const initCrashEventsSocket = require('./crash.events');
const initBlackjackEventsSocket = require('./blackjack.events');

/** @type { number[] } */
let randomNumbersArray;
let currentIndex = 0;

const getNextRandomNumber = () => {
  const nextNumber = randomNumbersArray[currentIndex++];
  if (currentIndex >= randomNumbersArray.length - 5) {
    getRandomNumbers().then((numbersArray) => {
      randomNumbersArray = numbersArray;
      currentIndex = 0;
    });
  }
  return nextNumber;
};

/**
 * @param { Socket } ioSocket
 */
function setMainSocketInstance(ioSocket) {
  getRandomNumbers().then((numbersArray) => {
    randomNumbersArray = numbersArray;
    currentIndex = 0;
    axios
      .get(process.env.SERVER_URL + 'api/games')
      .then((response) => {
        /** @type { {_id: string; gameName: string}[] } Game[] */
        const games = response.data;
        initRouletteEventsSocket(ioSocket, games.find((game) => game.gameName === 'Roulette')._id, getNextRandomNumber);
        initCrashEventsSocket(ioSocket, games.find((game) => game.gameName === 'Crash')._id, getNextRandomNumber);
        initBlackjackEventsSocket(ioSocket, games.find((game) => game.gameName === 'Blackjack')._id, getNextRandomNumber);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  initChatEventsSocket(ioSocket);
}

function getRandomNumbers() {
  return new Promise((success, reject) => {
    if (process.env.enviroment === 'production') {
      axios
        .get('https://www.random.org/integers/?num=500&min=0&max=10000&col=1&base=10&format=plain&rnd=new', {
          headers: {
            'User-Agent': process.env.request_email || 'tuksbet@gmail.com',
          },
        })
        .then((res) => {
          success(res.data.split('\n').map((num) => parseInt(num)));
        })
        .catch((err) => {
          // Failsafe so we never stop getting random numbers
          success(Array.from({ length: 500 }, () => Math.floor(Math.random() * 10000)));
          // reject('Error while getting numbers from random.org');
        });
    } else {
      success(Array.from({ length: 500 }, () => Math.floor(Math.random() * 10000)));
    }
  });
}

module.exports = setMainSocketInstance;
