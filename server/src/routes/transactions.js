const router = require('express').Router();
const TransactionsController = require('../controllers/transactions.controller.js');

router.get('/', TransactionsController.getAllTransactions);
router.get('/:transactionId', TransactionsController.getTransactionById);
router.post('/', TransactionsController.createTransaction);
router.patch('/:transactionId', TransactionsController.updateTransaction);

module.exports = router;
