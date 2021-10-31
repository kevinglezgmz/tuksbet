const router = require('express').Router();
const BetsController = require('../controllers/bets.controller.js');

router.get('/', BetsController.getAllBets);
router.get('/:betId', BetsController.getBetById);
router.post('/', BetsController.createBet);
router.patch('/:betId', BetsController.updateBet);
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
 *          type: object
 *          properties:
 *            data:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example: 616b9a868562c959c04a3cd1
 *                  userId:
 *                    type: int
 *                    example: 32
 *                  gameRoudId:
 *                    type: int
 *                    example: 13254
 *                  betDate:
 *                    type: date
 *                    example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *                  betAmount:
 *                    type: float
 *                    example: 0.56
 *                  betPayout:
 *                    type: float
 *                    example: -0.56
 *                  betStake:
 *                    type: string
 *                    example: "roulette"
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: No bets
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
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
 *        example: 123
 *        description: The identifier of the bet
 *    description: Makes a server request for a specific bet using it's ID.
 *    responses:
 *      200:
 *        description: Success response. Retrieves the data of the bet
 *        schema:
 *          type: object
 *          properties:
 *            data:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example: 616b9a868562c959c04a3cd1
 *                  userId:
 *                    type: int
 *                    example: 32
 *                  gameRoudId:
 *                    type: int
 *                    example: 13254
 *                  betDate:
 *                    type: date
 *                    example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *                  betAmount:
 *                    type: float
 *                    example: 0.56
 *                  betPayout:
 *                    type: float
 *                    example: -0.56
 *                  betStake:
 *                    type: string
 *                    example: "roulette"
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find bet
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
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
 *       - in: body
 *         name: bet
 *         description: The bet to be patched
 *         schema:
 *           type: object
 *           required:
 *             - userId
 *             - gameRoundId
 *           properties:
 *             userId:
 *               type: int
 *               example: 32
 *             gameRoudId:
 *               type: int
 *               example: 13254
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
 *              example: Bet added
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not post the bet
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
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
 *         description: The identifier of the bet
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
 *               type: int
 *               example: 32
 *             gameRoudId:
 *               type: int
 *               example: 13254
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
 *              example: Bet updated
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
 *              example: Bad request
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
 *    description: Makes a server request for a specific bet suing it's ID.
 *    parameters:
 *      - in: path
 *        name: betId
 *        example: 617c32b2ee63d136fa191527
 *        description: The identifier of the bet
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the bet deletion
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Bet deleted
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not delete the bet
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */