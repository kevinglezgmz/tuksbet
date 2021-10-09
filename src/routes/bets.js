const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Bets route works');
});
router.get('/:betId', (req, res) => {
  res.send('Bets with id: ' + req.params.betId + ' route works');
});
router.post('/', (req, res) => {});
router.post('/:id', (req, res) => {});

module.exports = router;
