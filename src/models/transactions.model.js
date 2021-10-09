const Database = require('./database.model');
const transactionsDB = new Database('Transactions');

class TransactionsModel {}

module.exports = TransactionsModel;
