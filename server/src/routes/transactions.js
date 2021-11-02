const router = require('express').Router();
const TransactionsController = require('../controllers/transactions.controller.js');
const authentication = require('../middlewares/authentication.js');

router.get('/', TransactionsController.getAllTransactions);
router.get('/:transactionId', authentication, TransactionsController.getTransactionById);
router.post('/', authentication, TransactionsController.createTransaction);
router.patch('/:transactionId', TransactionsController.updateTransaction);
router.delete('/:transactionId', TransactionsController.deleteTransaction);

module.exports = router;

// GET ALL TRANSACTIONS
/**
 * @swagger
 * /api/transactions/:
 *  get:
 *    tags:
 *      - Transactions
 *    summary: GET request for all the transactions
 *    description: Make a server request to get the data of all registered transactions
 *    responses:
 *      200:
 *        description: Success response. Retrieves the data of all transactions
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616ba72320787390d5f74fce
 *              userId:
 *                type: string
 *                example: 616b9a868562c959c04a3cd1
 *              transactionDate:
 *                type: string
 *                example: "Sun Oct 31 2021 15:10:01 GMT-0600 (hora estándar central)"
 *              amount:
 *                type: float
 *                example: 123.23
 *              isDeposit:
 *                type: boolean
 *                example: true
 *              status:
 *                type: string
 *                example: completed
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: No transactions found!
 *      401:
 *        description: Not authorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Not authorized
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// GET TRANSACTION BY ID
/**
 * @swagger
 * /api/transactions/{transactionId}:
 *  get:
 *    tags:
 *      - Transactions
 *    summary: GET request for one transaction
 *    description: Make a server request to get one of a transaction that has been registered.
 *    parameters:
 *      - in: path
 *        name: transactionId
 *        description: The id of the transaction required
 *        example: 616ba72320787390d5f74fce
 *    responses:
 *      200:
 *        description: Success response. Retrieves the data of the transaction.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: 616ba72320787390d5f74fce
 *            userId:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            transactionDate:
 *              type: string
 *              example: Sun Oct 31 2021 15:10:01 GMT-0600 (hora estándar central)
 *            amount:
 *              type: float
 *              example: 321
 *            isDeposit:
 *              type: boolean
 *              example: false
 *            status:
 *              type: string
 *              example: completed
 *      401:
 *        description: Not authorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Not authorized
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// POST NEW TRANSACTION
/**
 * @swagger
 * /api/transactions/:
 *  post:
 *    tags:
 *      - Transactions
 *    summary: POST request for one transactipn
 *    description: Makes a server request to register a new transaction.
 *    parameters:
 *       - in: body
 *         name: transaction
 *         description: The transaction to be registered.
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - amount
 *             - isDeposit
 *           properties:
 *             userId:
 *               type: string
 *               example: 617c32b2ee63d136fa191527
 *             amount:
 *               type: float
 *               example: 123.32
 *             isDeposit:
 *               type: boolean
 *               example: true
 *    responses:
 *      201:
 *        description: Created. Returns the transaction data.
 *        schema:
 *          type: object
 *          properties:
 *            userId:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            transactionDate:
 *              type: string
 *              example: Sun Oct 31 2021 15:10:01 GMT-0600 (hora estándar central)
 *            amount:
 *              type: float
 *              example: 321
 *            isDeposit:
 *              type: boolean
 *              example: false
 *            status:
 *              type: string
 *              example: completed
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: The following fields are missing: userId.
 *      401:
 *        description: Not authorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Not authorized
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// PATCH TRANSACTION
/**
 * @swagger
 * /api/transactions/{transactionId}:
 *  patch:
 *    tags:
 *      - Transactions
 *    summary: PATCH request for one transaction
 *    description: Makes a server request to update a transaction's status
 *    parameters:
 *       - in: path
 *         name: transactionId
 *         description: The id of the transaction to be updated
 *         example: 617f104e1209eb2115030d5d
 *       - in: body
 *         name: status
 *         description: The status to be set
 *         schema:
 *           type: object
 *           required:
 *             - status
 *           properties:
 *             status:
 *               type: string
 *               example: completed
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the transaction.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Transaction updated successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: You can only update the status of a transaction
 *      403:
 *        description: Forbidden
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: You can not update a transaction that has already been completed
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// DELETE TRANSACTION
/**
 * @swagger
 * /api/transactions/{transactionId}:
 *  delete:
 *    tags:
 *      - Transactions
 *    summary: DELETE request for one transaction
 *    description: Makes a server request to delete a transaction.
 *    parameters:
 *      - in: path
 *        name: transactionId
 *        description: The id of the transaction required
 *        example: 617f104e1209eb2115030d5d
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the transaction.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Transaction deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified transaction
 */
