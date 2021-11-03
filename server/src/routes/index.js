const indexRouter = require('express').Router();

const betRoutes = require('./bets');
const chatRoutes = require('./chats');
const chatRoomRoutes = require('./chatRooms');
const gameRoundRoutes = require('./gameRounds');
const transactionRoutes = require('./transactions');
const userIdentityRoutes = require('./userIdentities');
const userRoutes = require('./users');
const sessionRoutes = require('./sessions');

indexRouter.use('/bets', betRoutes);
indexRouter.use('/chatrooms', chatRoutes);
indexRouter.use('/chatrooms', chatRoomRoutes);
indexRouter.use('/gamerounds', gameRoundRoutes);
indexRouter.use('/transactions', transactionRoutes);
indexRouter.use('/identities', userIdentityRoutes);
indexRouter.use('/users', userRoutes);
indexRouter.use('/sessions', sessionRoutes);

module.exports = indexRouter;
