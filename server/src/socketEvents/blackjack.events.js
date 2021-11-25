const {
    Socket
} = require('socket.io');
const axios = require('axios').default;

/** @type { Socket } */
let io;
/** @type { string } */
let blackjackId;

/**
 * @param { Socket } ioSocket
 * @param { Socket } clientSocket
 */

const clientRooms = {};

const CARDTYPES = {
    CLUBS: "clubs",
    DIAMONDS: "diamonds",
    HEARTS: "hearts",
    SPADES: "spades"
}

const CARDNUMBERS = {
    TWO: "2",
    THREE: "3",
    FOUR: "4",
    FIVE: "5",
    SIX: "6",
    SEVEN: "7",
    EIGHT: "8",
    NINE: "9",
    TEN: "10",
    JACK: "jack",
    QUEEN: "queen",
    KING: "king",
    ACE: "ace"
}

function initBlackjackEventsSocket(ioSocket, blackjackGameId) {
    io = ioSocket;
    blackjackId = blackjackGameId
    io.on('connection', blackjackEvents);
}

function blackjackEvents(clientSocket) {
    clientSocket.on('check-if-game', (userId) => leftBlackjack(userId, clientSocket));
    clientSocket.on('init-blackjack-gameround', (userId) => initBlackjackGameRound(userId, clientSocket));
    clientSocket.on('start-blackjack-game', (gameIds) => blackjackStartGame(gameIds, clientSocket));

    clientSocket.on('hit-blackjack', (userId) => blackjackHit(userId, clientSocket));
    clientSocket.on('stand-blackjack', (userId) => blackjackStand(userId, clientSocket));
    clientSocket.on('double-blackjack', (userId) => blackjackDouble(userId, clientSocket));

    clientSocket.on('close-blackjack-gameroud', (gameData) => blackjackCloseGameround(gameData, clientSocket));
}

function leftBlackjack(userId, clientSocket){
    if(clientRooms[userId]){
        clientSocket.emit('init-blackjack', clientRooms[userId]);
    }
}

function initBlackjackGameRound(userId, clientSocket){
    axios
    .post(process.env.SERVER_URL + 'api/gameRounds', { gameId: blackjackId })
    .then((response) => {
        const gameRoundId = response.data.insertedId;
        clientSocket.emit('place-blackjack-bet', gameRoundId);
    });
}

function blackjackStartGame(gameIds, clientSocket) {
    const game = initBlackjackVariables();
    
    const dealedCards = dealCards(game.player, game.dealer, game.gameDeck);
    game.player = dealedCards.player;
    game.dealer = dealedCards.dealer;
    game.betId = gameIds.betId;
    game.gameRoundId = gameIds.gameRoundId;

    clientRooms[gameIds.userId] = game;
    clientSocket.emit('blackjack-game-started', game);
}

function blackjackHit(userId, clientSocket) {
    if(userId === undefined){
        return;
    }
    let currGame = clientRooms[userId];

    let card = getRandomCard(currGame.gameDeck);
    card.value = getCardValue(card.num, currGame.player.score);

    currGame.player.cards.push(card);
    updateScoreValue(card.value, currGame.player);

    if(currGame.player.score >= 21) {
        getWinner(currGame);
    }
    clientSocket.emit('return-hit-blackjack', currGame);
}

function blackjackStand(userId, clientSocket) {
    let currGame = clientRooms[userId];
    currGame.dealer.score += currGame.dealer.hiddenScore;

    updateDealerCards(currGame);

    while(currGame.dealer.score < 17){
        let card = getRandomCard(currGame.gameDeck);
        card.value = getCardValue(card.num, currGame.dealer.score);
        currGame.dealer.cards.push(card);
        updateScoreValue(card.value, currGame.dealer);
    }

    getWinner(currGame);
    clientSocket.emit('return-stand-blackjack', currGame);
    delete clientRooms[currGame.userId];
}

function blackjackDouble(userId, clientSocket){
    let currGame = clientRooms[userId];
    currGame.isDouble = true;
    blackjackHit(userId, clientSocket);
    blackjackStand(userId, clientSocket);
}

function blackjackCloseGameround(gameData, clientSocket){
    let currGame = clientRooms[gameData.userId];
    closeGameround(gameData.gameroundId, currGame, clientSocket);
    delete clientRooms[gameData.userId];
}

function closeGameround(gameroundId, currGame, clientSocket){
    axios
        .patch(process.env.SERVER_URL + 'api/gamerounds/' + gameroundId, {
            acceptingBets: false,
            result: 'blackjack-' + currGame.dealer.score
        })
        .then((res) => {
            clientSocket.emit('blackjack-gameround-closed', currGame);
        })
        .catch(({response}) => {
            console.log(response.data);
        });
}

function initBlackjackVariables() {
    let game = {
        gameDeck: shuffleDeck(initDeck()),
        gameStarted: true,
        userPlaying: true,
        winner: '',
        dealer: {
            score: 0,
            hiddenScore: 0,
            cards: []
        },
        player: {
            score: 0,
            cards: []
        }
    };
    return game;
}

function initDeck() {
    gameDeck = [];
    const types = Object.assign({}, Object.values(CARDTYPES));
    const nums = Object.assign({}, Object.values(CARDNUMBERS));

    for (let type in types) {
        for (let num in nums) {
            gameDeck.push(createCard(nums[num], types[type]));
        }
    }
    return gameDeck;
}

function shuffleDeck(gameDeck) {
    for (let i = gameDeck.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * i);
        let temp = gameDeck[i];
        gameDeck[i] = gameDeck[randomIndex];
        gameDeck[randomIndex] = temp;
    }
    return gameDeck;
}

function getCardValue(num, currScore) {
    if (num === CARDNUMBERS.JACK || num === CARDNUMBERS.QUEEN || num === CARDNUMBERS.KING) {
        return 10;
    } else if (num === CARDNUMBERS.ACE) {
        return currScore <= 10 ? 11 : 1;
    }
    return parseInt(num);
}

function createCard(num, type) {
    let card = {
        num,
        type
    }

    return card;
}

function getRandomCard(gameDeck) {
    let randomCardIndex = Math.floor(Math.random() * (52)); // THIS WILL CHANGE FOR A FUNCTION THAT RETURNS RANDOM NUMBERS
    let card = gameDeck[randomCardIndex];
    return card;
}

function dealCards(player, dealer, gameDeck) {
    for (let i = 0; i < 4; i++) {
        let card = getRandomCard(gameDeck);
        let currPlayer = i % 2 === 0 ? player : dealer;
        card.value = getCardValue(card.num, currPlayer.score);
        if (i > 2) {
            currPlayer.cards.push(createCard('back', 'back'));
            currPlayer.hiddenCard = card;
            currPlayer.hiddenScore = card.value;
        } else {
            currPlayer.cards.push(card);
            updateScoreValue(card.value, currPlayer);
        }
    }
    let result = {
        player,
        dealer
    }
    return result;
}

function updateScoreValue(value, player) {
    player.score += value;
}

function getWinner(game) {
    game.winner = 'Winner: '
    if (game.player.score <= 21 && ((game.dealer.score < game.player.score) || (game.dealer.score > 21))) {
        game.winner += 'YOU';
    } else if (game.dealer.score <= 21 && ((game.player.score < game.dealer.score) || (game.player.score > 21))) {
        game.winner += 'DEALER';
    } else if (game.dealer.score === game.player.score) {
        game.winner += 'TIE';
    }
    game.gameStarted = false;
}

function updateDealerCards(game) {
    game.dealer.cards.pop();
    game.dealer.cards.push(game.dealer.hiddenCard);
}

module.exports = initBlackjackEventsSocket;