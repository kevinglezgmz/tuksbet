const router = require('express').Router();
const BetsController = require('../controllers/bets.controller.js');

router.get('/', BetsController.getAllBets);
router.get('/:betId', BetsController.getBetById);
router.post('/', BetsController.createBet);

module.exports = router;
