const { Socket } = require('socket.io');
const axios = require('axios').default;

/** @type { Socket } */
let io;
/** @type { string } */
let crashId;
/** @type { function } */
let nextRandomNumber;

const crashCurrentStatus = {
  roundDelay: 15000, // 15 seconds between rounds
  nextGameRoundStartAt: undefined,
  crashState: 'WATING',
  currentGameRoundId: undefined,
  gameEndsAt: undefined,
};

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 * @param { function } getNextRandomNumber
 */
function initCrashEventsSocket(ioSocket, crashGameId, getNextRandomNumber) {
  io = ioSocket;
  crashId = crashGameId;
  nextRandomNumber = getNextRandomNumber;
  startCrashRound();
  io.on('connection', crashEvents);
}

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */
function crashEvents(clientSocket) {
  clientSocket.on('join-crash-game', () => {
    switch (crashCurrentStatus.crashState) {
      case 'WAITING':
        crashWaitingStatusUpdate();
        break;
      case 'RUNNING':
        crashRunningStatusUpdate();
        break;
      case 'CRASHED':
        crashCrashedStatusUpdate();
        break;
    }
  });

  clientSocket.on('new-crash-bet', (bet) => clientSocket.broadcast.emit('new-crash-bet', bet));
}

function crashWaitingStatusUpdate() {
  io.emit('crash-game-round-waiting-status', {
    nextGameRoundStartAt: crashCurrentStatus.nextGameRoundStartAt,
    currentGameRoundId: crashCurrentStatus.currentGameRoundId,
  });
}

function crashRunningStatusUpdate() {
  io.emit('crash-game-round-running-status', {
    nextGameRoundStartAt: crashCurrentStatus.nextGameRoundStartAt,
    currentGameRoundId: crashCurrentStatus.currentGameRoundId,
    serverCurrentTime: Date.now(),
  });
}

function crashCrashedStatusUpdate() {
  io.emit('crash-game-round-crashed-status', {
    realCrashedAt: crashCurrentStatus.gameEndsAt,
    currentGameRoundId: crashCurrentStatus.currentGameRoundId,
  });
}

function startCrashRound() {
  crashCurrentStatus.crashState = 'WAITING';
  crashCurrentStatus.nextGameRoundStartAt = Date.now() + crashCurrentStatus.roundDelay;

  if (process.env.ENVIROMENT === 'production') {
    axios
      .post(process.env.SERVER_URL + 'api/gameRounds', { gameId: crashId })
      .then((response) => {
        crashCurrentStatus.currentGameRoundId = response.data.insertedId;
        crashWaitingStatusUpdate();
      })
      .catch((err) => {
        console.log('CRASH', err);
      });
  } else {
    crashCurrentStatus.currentGameRoundId = 'DEV';
  }

  // Resultado de la ronda
  crashCurrentStatus.gameEndsAt =
    crashCurrentStatus.nextGameRoundStartAt + crashCurrentStatus.roundDelay + ((nextRandomNumber() % 10) + 1) * 1000;

  // Generar ID de ronda
  if (process.env.ENVIROMENT === 'dev') {
    crashWaitingStatusUpdate();
  }
  setTimeout(() => {
    crashCurrentStatus.crashState = 'RUNNING';
    crashRunningStatusUpdate();
    if (process.env.ENVIROMENT === 'production') {
      axios
        .patch(process.env.SERVER_URL + 'api/gameRounds/' + crashCurrentStatus.currentGameRoundId, {
          acceptingBets: false,
        })
        .then((response) => {})
        .catch(({ response }) => {
          console.log(response.data);
        });
    }
    setTimeout(() => {
      crashCurrentStatus.crashState = 'CRASHED';
      const roundDurationsSeconds = (crashCurrentStatus.gameEndsAt - crashCurrentStatus.nextGameRoundStartAt) / 1000;
      const crashedAtMultiplier = getCurrentMultiplier(roundDurationsSeconds).toFixed(2);

      // Before sending the result to the clients we need to update the game round to not accept any more bets and store the result of the round
      if (process.env.ENVIROMENT === 'production') {
        axios
          .patch(process.env.SERVER_URL + 'api/gameRounds/' + crashCurrentStatus.currentGameRoundId, {
            acceptingBets: false,
            result: 'crash-' + crashedAtMultiplier + 'x',
          })
          .then((response) => {
            // After updating the game round, we can tell the users about the result and update their balances
            updateUserBalances();
            crashCrashedStatusUpdate();
          })
          .catch(({ response }) => {
            console.log(response.data);
          });
      } else {
        crashCrashedStatusUpdate();
      }
    }, crashCurrentStatus.gameEndsAt - crashCurrentStatus.nextGameRoundStartAt);
  }, crashCurrentStatus.roundDelay);

  setTimeout(startCrashRound, crashCurrentStatus.gameEndsAt - Date.now() + 2000);
}

function getCurrentMultiplier(secondsSinceStart) {
  const speedFactor = secondsSinceStart;
  return Math.E ** (speedFactor / 18);
}

function updateUserBalances() {
  axios
    .patch(process.env.SERVER_URL + 'api/bets/', { gameRoundId: crashCurrentStatus.currentGameRoundId })
    .then((response) => {
      io.emit('update-balance');
    })
    .catch(({ response }) => {
      if (response.data.err !== 'No bets were made in this game round') {
        console.log(response.data);
      }
    });
}

module.exports = initCrashEventsSocket;
