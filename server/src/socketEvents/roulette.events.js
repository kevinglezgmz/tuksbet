const { Socket } = require('socket.io');
const axios = require('axios').default;

/** @type { Socket } */
let io;

const rouletteCurrentStatus = {
  lastRoll: undefined,
  rollArray: [],
  nextRollIdx: 0,
  roundDelay: 15000, // 15 seconds between rounds
  currentTimer: 15000,
  rollAnimationDuration: 7600,
  isRolling: false,
};

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function initRouletteEventsSocket(ioSocket) {
  io = ioSocket;
  startRouletteServer();
  io.on('connection', rouletteEvents);
}

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function rouletteEvents(clientSocket) {
  clientSocket.on('join-roulette-game', () => {
    clientSocket.emit('roulette-game-status', {
      currentTimer: rouletteCurrentStatus.currentTimer / 1000,
      isRolling: rouletteCurrentStatus.isRolling,
      lastRoll: rouletteCurrentStatus.lastRoll,
    });
  });
}

function startClientTimer(timerSeconds) {
  io.emit('roulette-game-timer', timerSeconds);
}

function spinWheel(rollResult) {
  io.emit('roulette-game-roll', rollResult);
}

function startRouletteServer() {
  waitForRoundToStart(startRound);
  setInterval(() => {
    waitForRoundToStart(startRound);
  }, rouletteCurrentStatus.roundDelay + rouletteCurrentStatus.rollAnimationDuration + 300);
}

function waitForRoundToStart(cbStartRound) {
  startClientTimer(rouletteCurrentStatus.roundDelay / 1000);
  // Have a countdown on the server so we can update newly joined clients
  const waitingRollInterval = setInterval(() => {
    rouletteCurrentStatus.currentTimer -= 205;
    if (rouletteCurrentStatus.currentTimer <= 0) {
      rouletteCurrentStatus.currentTimer = 0;
      clearInterval(waitingRollInterval);
    }
  }, 200);

  if (rouletteCurrentStatus.nextRollIdx >= rouletteCurrentStatus.rollArray.length - 1) {
    axios
      .get('https://www.random.org/integers/?num=200&min=0&max=14&col=1&base=10&format=plain&rnd=new', {
        headers: {
          'User-Agent': process.env.request_email | 'tuksbet@gmail.com',
        },
      })
      .then((res) => {
        rouletteCurrentStatus.rollArray = res.data.split('\n').map((num) => parseInt(num));
        rouletteCurrentStatus.nextRollIdx = 0;
      });
  }

  setTimeout(() => {
    clearInterval(waitingRollInterval);
    cbStartRound(rouletteCurrentStatus.rollArray[rouletteCurrentStatus.nextRollIdx++]);
  }, rouletteCurrentStatus.roundDelay + 100);
}

function startRound(rollResult) {
  spinWheel(rollResult);
  rouletteCurrentStatus.lastRoll = rollResult;
  rouletteCurrentStatus.isRolling = true;
  setTimeout(() => {
    rouletteCurrentStatus.currentTimer = rouletteCurrentStatus.roundDelay;
    rouletteCurrentStatus.isRolling = false;
  }, rouletteCurrentStatus.rollAnimationDuration);
}

module.exports = initRouletteEventsSocket;
