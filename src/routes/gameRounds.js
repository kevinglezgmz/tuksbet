const router = require('express').Router();
const GameRoundsController = require('../controllers/gameRounds.controller.js');

router.get('/', GameRoundsController.getAllGameRounds);
router.get('/:gameRoundId', GameRoundsController.getGameRoundById);
router.post('/', GameRoundsController.createGameRound);
router.patch('/:gameRoundId', GameRoundsController.updateGameRound);

module.exports = router;
