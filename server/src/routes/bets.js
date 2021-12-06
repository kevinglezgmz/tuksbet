const router = require('express').Router();
const BetsController = require('../controllers/bets.controller.js');
const authentication = require('../middlewares/authentication');

router.get('/', BetsController.getAllBets);
router.get('/:betId', BetsController.getBetById);
router.post('/', authentication, BetsController.createBet);
router.patch('/:betId', BetsController.updateBet);
router.patch('/', BetsController.updateAllBetsInGameRound);
router.delete('/:betId', BetsController.deleteBet);

module.exports = router;

// GET ALL BETS
/**
 * @swagger
 * /api/bets/:
 *  get:
 *    tags:
 *      - Bets
 *    summary: GET request for all the bets
 *    description: Makes a server request to get all the bets that have been made.
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the bets.
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a868562c959c04a3cd1
 *              gameName:
 *                type: string
 *                example: exampleGame
 *              username:
 *                type: string
 *                example: exampleUser
 *              userId:
 *                type: string
 *                example: 616b9a868562c959c04a3er2
 *              gameRoundId:
 *                type: string
 *                example: 616b9a868562c959c04a6548
 *              betDate:
 *                type: date
 *                example: 2021-11-07T19:28:03.824Z
 *              betAmount:
 *                type: float
 *                example: 0.56
 *              betPayout:
 *                type: float
 *                example: -0.56
 *              betStake:
 *                type: string
 *                example: "roulette"
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: No bets have been made yet!
 *      401:
 *        description: Unauthorized
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

// GET BET BY ID
/**
 * @swagger
 * /api/bets/{betId}:
 *  get:
 *    tags:
 *      - Bets
 *    summary: GET request for a specific bet
 *    parameters:
 *      - in: path
 *        name: betId
 *        example: 616b9a868562c959c04a3cd1
 *        description: The bet's identifier
 *    description: Makes a server request for a specific bet using it's ID.
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the bet.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            userId:
 *              type: string
 *              example: 616b9a868562c959c04a4562
 *            gameRoundId:
 *              type: string
 *              example: 616b9a868562c959c04a454j
 *            betDate:
 *              type: date
 *              example: 2021-11-07T19:28:03.824Z
 *            betAmount:
 *              type: float
 *              example: 0.56
 *            betPayout:
 *              type: float
 *              example: -0.56
 *            betStake:
 *              type: string
 *              example: "red_10"
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bet with Id 616b9a868562c959c04a3cd1 does not exist
 *      401:
 *        description: Unauthorized
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

// POST A NEW BET
/**
 * @swagger
 * /api/bets/:
 *  post:
 *    tags:
 *      - Bets
 *    summary: POST request for a new bet
 *    description: Makes a server request to post a new bet.
 *    parameters:
 *       - in: header
 *         name: Authorization
 *         description: The bearer's token
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTdlZmMxMDFkYzRjMGIwMDVhODMxZDAiLCJ1c2VybmFtZSI6InVzdWFyaW9OdWV2byIsImVtYWlsIjoibmV3TWFpbEBtYWlsLmNvbSIsImlhdCI6MTYzNTcyMDIzM30.sJbwN2PrHKaRRY2_eJNfu0ccjJy1Uw2G-tSfmuNsraM
 *       - in: body
 *         name: bet
 *         description: The data to create the bet
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - gameRoundId
 *           properties:
 *             userId:
 *               type: string
 *               example: 616b9a868562c959c04a3cd1
 *             gameRoundId:
 *               type: string
 *               example: 616b9a868562c95984sdei01
 *             betAmount:
 *               type: float
 *               example: 0.56
 *             betStake:
 *               type: string
 *               example: "roulette"
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the bet
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Bet placed successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Not enough balance to make the bet
 *      401:
 *        description: Unauthorized
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

// PATCH BET
/**
 * @swagger
 * /api/bets/{betId}:
 *  patch:
 *    tags:
 *      - Bets
 *    summary: PATCH request for a bet
 *    description: Makes a server request to register changes of a bet
 *    parameters:
 *       - in: path
 *         name: betId
 *         example: 617c32b2ee63d136fa191527
 *         description: The bet's identifier
 *       - in: body
 *         name: bet
 *         description: The bet to be updated
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - gameRoundId
 *           properties:
 *             userId:
 *               type: string
 *               example: 616b9a868562c959c04a3cd1
 *             gameRoundId:
 *               type: string
 *               example: 616b9a868562c95984sdei01
 *             betAmount:
 *               type: float
 *               example: 0.56
 *             betStake:
 *               type: string
 *               example: "roulette"
 *             betPayout:
 *               type: float
 *               example: 0.56
 *             betDate:
 *               type: date
 *               example: 2021-11-07T19:28:03.824Z
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the bet
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Successfully modified the bet data
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not update the bet
 *      401:
 *        description: Unauthorized
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

// DELETE BET
/**
 * @swagger
 * /api/bets/{betId}:
 *  delete:
 *    tags:
 *      - Bets
 *    summary: DELETE request for a specific bet
 *    description: Makes a server request for a specific bet using it's ID.
 *    parameters:
 *      - in: path
 *        name: betId
 *        example: 617c32b2ee63d136fa191527
 *        description: The bet's identifier
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the bet deletion
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Bet deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified bet
 *      401:
 *        description: Unauthorized
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
