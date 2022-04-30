const indexRouter = require('express').Router();

const betRoutes = require('./bets');
const chatRoutes = require('./chats');
const chatRoomRoutes = require('./chatRooms');
const gameRoundRoutes = require('./gameRounds');
const transactionRoutes = require('./transactions');
const userIdentityRoutes = require('./userIdentities');
const userRoutes = require('./users');
const sessionRoutes = require('./sessions');
const gamesRoutes = require('./games');
const criptoRoutes = require('./cripto');
const chatbotRoutes = require('./chatbot');

indexRouter.use('/bets', betRoutes);
indexRouter.use('/chatrooms', chatRoutes);
indexRouter.use('/chatrooms', chatRoomRoutes);
indexRouter.use('/gamerounds', gameRoundRoutes);
indexRouter.use('/transactions', transactionRoutes);
indexRouter.use('/identities', userIdentityRoutes);
indexRouter.use('/users', userRoutes);
indexRouter.use('/sessions', sessionRoutes);
indexRouter.use('/games', gamesRoutes);
indexRouter.use('/cripto', criptoRoutes);
indexRouter.use('/chatbot', chatbotRoutes);

module.exports = indexRouter;
