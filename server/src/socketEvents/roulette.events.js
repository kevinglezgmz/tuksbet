const { Socket } = require('socket.io');
const axios = require('axios').default;

/** @type { Socket } */
let io;
/** @type { string } */
let rouletteId;

const rouletteCurrentStatus = {
  lastRoll: undefined,
  rollArray: [],
  nextRollIdx: 0,
  roundDelay: 15000, // 15 seconds between rounds
  currentTimer: 15000,
  rollAnimationDuration: 7600,
  isRolling: false,
  currentGameRoundId: undefined,
};

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function initRouletteEventsSocket(ioSocket, rouletteGameId) {
  io = ioSocket;
  rouletteId = rouletteGameId;
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
      currentGameRoundId: rouletteCurrentStatus.currentGameRoundId,
    });
  });

  clientSocket.on('new-roulette-red-bet', (bet) => clientSocket.broadcast.emit('new-roulette-red-bet', bet));
  clientSocket.on('new-roulette-green-bet', (bet) => clientSocket.broadcast.emit('new-roulette-green-bet', bet));
  clientSocket.on('new-roulette-black-bet', (bet) => clientSocket.broadcast.emit('new-roulette-black-bet', bet));
}

function startClientRound(currentGameRoundId) {
  io.emit('roulette-game-round-start', {
    timerCountown: rouletteCurrentStatus.roundDelay / 1000,
    currentGameRoundId,
  });
}

function spinWheel(rollResult) {
  io.emit('roulette-game-roll', rollResult);
}

function startRouletteServer() {
  if (process.env.enviroment === 'production') {
    waitForRoundToStart(startRoundProduction);
    setInterval(() => {
      waitForRoundToStart(startRoundProduction);
    }, rouletteCurrentStatus.roundDelay + rouletteCurrentStatus.rollAnimationDuration + 1500);
  } else {
    // Nothing will be saved to the database
    setInterval(() => {
      waitForRoundToStartDevelopment(spinWheelForUsersAndResetCurrentStatus);
    }, rouletteCurrentStatus.roundDelay + rouletteCurrentStatus.rollAnimationDuration + 1500);
  }
}

function waitForRoundToStart(cbStartRoundForClients) {
  // Before doing anything we need to create a new game round in the database
  axios
    .post(process.env.SERVER_URL + 'api/gameRounds', { gameId: rouletteId })
    .then((response) => {
      rouletteCurrentStatus.currentGameRoundId = response.data.insertedId;
      startClientRound(response.data.insertedId);
      const waitingRollInterval = startInternalCountdown();
      checkAndUpdateResultsArray();
      setTimeout(() => {
        clearInterval(waitingRollInterval);
        nextRandomResultIndex = rouletteCurrentStatus.nextRollIdx++;
        cbStartRoundForClients(rouletteCurrentStatus.rollArray[nextRandomResultIndex]);
      }, rouletteCurrentStatus.roundDelay + 100);
    })
    .catch(({ response }) => {
      console.log('Error creating a new game round for roulette', response.data);
    });
}

function waitForRoundToStartDevelopment(cbStartRoundForClientsDevelopment) {
  rouletteCurrentStatus.currentGameRoundId = 'DEV';
  startClientRound('DEV');
  const waitingRollInterval = startInternalCountdown();
  checkAndUpdateResultsArray();
  setTimeout(() => {
    clearInterval(waitingRollInterval);
    nextRandomResultIndex = rouletteCurrentStatus.nextRollIdx++;
    cbStartRoundForClientsDevelopment(rouletteCurrentStatus.rollArray[nextRandomResultIndex]);
  }, rouletteCurrentStatus.roundDelay + 100);
}

function startRoundProduction(rollResult) {
  // Build result string
  const resultArr = ['roulette'];
  if (rollResult === 0) {
    resultArr.push('green');
  } else if (rollResult <= 7) {
    resultArr.push('red');
  } else {
    resultArr.push('black');
  }
  resultArr.push(rollResult.toString());
  const result = resultArr.join('-');
  // Before sending the result to the clients we need to update the game round to not accept any more bets and store the result of the round
  axios
    .patch(process.env.SERVER_URL + 'api/gameRounds/' + rouletteCurrentStatus.currentGameRoundId, {
      acceptingBets: false,
      result,
    })
    .then((response) => {
      // After updating the game round, we can tell the users about the result and update their balances

      spinWheelForUsersAndResetCurrentStatus(rollResult, updateUserBalances);
    })
    .catch(({ response }) => {
      console.log(response.data);
    });
}

function checkAndUpdateResultsArray() {
  if (rouletteCurrentStatus.nextRollIdx >= rouletteCurrentStatus.rollArray.length - 1) {
    if (process.env.enviroment === 'production') {
      axios
        .get('https://www.random.org/integers/?num=200&min=0&max=14&col=1&base=10&format=plain&rnd=new', {
          headers: {
            'User-Agent': process.env.request_email || 'tuksbet@gmail.com',
          },
        })
        .then((res) => {
          rouletteCurrentStatus.rollArray = res.data.split('\n').map((num) => parseInt(num));
        });
    } else {
      rouletteCurrentStatus.rollArray = Array.from({ length: 100 }, () => Math.floor(Math.random() * 14.9999));
    }
    rouletteCurrentStatus.nextRollIdx = 0;
  }
}

function startInternalCountdown() {
  // Have a countdown on the server so we can update newly joined clients
  const waitingRollInterval = setInterval(() => {
    rouletteCurrentStatus.currentTimer -= 205;
    if (rouletteCurrentStatus.currentTimer <= 0) {
      rouletteCurrentStatus.currentTimer = 0;
      clearInterval(waitingRollInterval);
    }
  }, 200);
  return waitingRollInterval;
}

function spinWheelForUsersAndResetCurrentStatus(rollResult, cbUpdateUserBalances) {
  spinWheel(rollResult);
  if (process.env.enviroment === 'production') {
    cbUpdateUserBalances();
  }
  rouletteCurrentStatus.lastRoll = rollResult;
  rouletteCurrentStatus.isRolling = true;
  setTimeout(() => {
    rouletteCurrentStatus.currentTimer = rouletteCurrentStatus.roundDelay;
    rouletteCurrentStatus.isRolling = false;
  }, rouletteCurrentStatus.rollAnimationDuration);
}

function updateUserBalances() {
  axios
    .patch(process.env.SERVER_URL + 'api/bets/', { gameRoundId: rouletteCurrentStatus.currentGameRoundId })
    .then((response) => {})
    .catch(({ response }) => {
      if (response.data.err !== 'No bets were made in this game round') {
        console.log(response.data);
      }
    });
}

module.exports = initRouletteEventsSocket;
