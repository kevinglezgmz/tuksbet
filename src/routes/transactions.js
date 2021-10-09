const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('Transactions route works');
});

router.get('/:transactionId', (req, res) => {
  res.send('Transaction: ' + req.params.transactionId + ' route works');
});

router.post('/', (req, res) => {});

router.post('/:transactionId', (req, res) => {});

module.exports = router;
