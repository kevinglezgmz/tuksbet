const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('GameRounds route works');
});
router.get('/:gameRoundId', (req, res) => {
  res.send('GameRound: ' + req.params.gameRoundId + ' route works');
});
router.post('/', (req, res) => {});
router.post('/:gameRoundId', (req, res) => {});

module.exports = router;
