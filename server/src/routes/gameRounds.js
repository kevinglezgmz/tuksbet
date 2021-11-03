const router = require('express').Router();
const GameRoundsController = require('../controllers/gameRounds.controller.js');

router.get('/', GameRoundsController.getAllGameRounds);
router.get('/:gameRoundId', GameRoundsController.getGameRoundById);
router.post('/', GameRoundsController.createGameRound);
router.patch('/:gameRoundId', GameRoundsController.updateGameRound);
router.delete('/:gameRoundId', GameRoundsController.deleteGameRound);

module.exports = router;

// GET ALL GAME ROUNDS
/**
 * @swagger
 * /api/gamerounds/:
 *  get:
 *    tags:
 *      - Game Rounds
 *    summary: GET request for all the game rounds
 *    description: Makes a server request to get all the game rounds that exist.
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the game rounds.
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a868562c959c04a3cd1
 *              gameId:
 *                type: int
 *                example: 32
 *              result:
 *                type: string
 *                example: abc
 *              roundDate:
 *                type: date
 *                example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *              acceptingBets:
 *                type: boolean
 *                example: true
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: No game rounds found!
 *      401:
 *        description: Unauthorized
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Not authorized
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error ocurred, please try again
 */

// GET GAME ROUND BY ID
/**
 * @swagger
 * /api/gamerounds/{gameRoundId}:
 *  get:
 *    tags:
 *      - Game Rounds
 *    summary: GET request for a specific game round
 *    description: Makes a server request for a specific game round using it's ID.
 *    parameters:
 *      - in: path
 *        name: gameRoundId
 *        example: 123
 *        description: The game round's identifier
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the game round.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            gameId:
 *              type: int
 *              example: 32
 *            result:
 *              type: string
 *              example: abc
 *            roundDate:
 *               type: date
 *               example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *            acceptingBets:
 *              type: boolean
 *              example: true
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Game round with id 616b9a868562c959c04a3cd1 does not exist
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// POST A NEW GAME ROUND
/**
 * @swagger
 * /api/gamerounds/:
 *  post:
 *    tags:
 *      - Game Rounds
 *    summary: POST request for a new Game Round
 *    description: Makes a server request to post a new game round.
 *    parameters:
 *      - in: body
 *        name: gameRound
 *        description: The game round to be posted
 *        schema:
 *          type: object
 *          required:
 *            - gameId
 *            - result
 *            - roundDate
 *            - acceptingBets
 *          properties:
 *            gameId:
 *              type: int
 *              example: 32
 *            result:
 *              type: string
 *              example: abc
 *            roundDate:
 *               type: date
 *               example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *            acceptingBets:
 *              type: boolean
 *              example: true
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the game round
 *        schema:
 *          type: object
 *          properties:
 *            status:
 *              type: string
 *              example: Game round added
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not post the game round
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

// PATCH A GAME ROUND
/**
 * @swagger
 * /api/gamerounds/{gameRoundId}:
 *  patch:
 *    tags:
 *      - Game Rounds
 *    summary: PATCH request for a game round
 *    description: Makes a server request to register changes of a game round.
 *    parameters:
 *      - in: path
 *        name: gameRoundId
 *        example: 123
 *        description: The game round's identifier
 *      - in: body
 *        name: gameRound
 *        description: The game round to be posted
 *        schema:
 *          type: object
 *          required:
 *            - gameId
 *          properties:
 *            gameId:
 *              type: int
 *              example: 32
 *            result:
 *              type: string
 *              example: abc
 *            roundDate:
 *               type: date
 *               example: Wed Jan 27 2021 10:15:53 GMT+1000 (AEST)
 *            acceptingBets:
 *              type: boolean
 *              example: true
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the game round
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Game round updated
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not update the game round
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

// DELETE GAME ROUND
/**
 * @swagger
 * /api/gamerounds/{gameRoundId}:
 *  delete:
 *    tags:
 *      - Game Rounds
 *    summary: DELETE request for a specific game round
 *    description: Makes a server request to delete a specific game round using it's ID.
 *    parameters:
 *      - in: path
 *        name: gameRoundId
 *        example: 123
 *        description: The game round's identifier
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the gameRound deletion.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Game round deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified game round
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */
