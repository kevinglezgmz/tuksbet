const router = require('express').Router();
const GamesController = require('../controllers/games.controller.js');

router.get('/', GamesController.getAllGames);
router.post('/', GamesController.createNewGame);
router.patch('/:gameId', GamesController.updateGame);
router.delete('/:gameId', GamesController.deleteGame);

module.exports = router;

// GET ALL GAMES
/**
 * @swagger
 * /api/games:
 *  get:
 *    tags:
 *      - Games
 *    summary: GET request for all the games available
 *    description: Makes a server request to get all the games.
 *    responses:
 *      200:
 *        description: Success response. Retrieves the games in the database
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a1232c959c04a3fc4
 *              gameName:
 *                type: string
 *                example: Roulette
 *              gameImage:
 *                type: string
 *                example: https://exampleLink/example.png
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: The are no games in the database yet
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// CREATE A NEW GAME
/**
 * @swagger
 * /api/games:
 *  post:
 *    tags:
 *      - Games
 *    summary: POST request to create a new game
 *    description: Makes a server request to create a new game in the database.
 *    parameters:
 *      - in: body
 *        name: gameName
 *        description: The name of the game to be created
 *        schema:
 *          type: object
 *          required:
 *            - gameName
 *          properties:
 *            gameName:
 *              type: string
 *              example: Crash
 *            gameImage:
 *                type: string
 *                example: https://exampleLink/example.png
 *    responses:
 *      201:
 *        description: Success response. Game created successfully.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Game created successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: This game already exists!
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

// UPDATE A GAME
/**
 * @swagger
 * /api/games/{gameId}:
 *  patch:
 *    tags:
 *      - Games
 *    summary: PATCH request to update a game name
 *    description: Makes a server request to update the name of a game.
 *    parameters:
 *      - in: path
 *        name: gameId
 *        description: The identifier of the game
 *        example: 126b9a231562c922c04a1df9
 *      - in: body
 *        name: gameName
 *        description: The new name of the specified game
 *        schema:
 *          type: object
 *          required:
 *            - gameName
 *          properties:
 *            gameName:
 *              type: string
 *              example: NewAwesomeGame
 *            gameImage:
 *                type: string
 *                example: https://exampleLink/example.png
 *    responses:
 *      200:
 *        description: Success response. Game name updated successfully
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Successfully changed the game name
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified game
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

// DELETE A GAME
/**
 * @swagger
 * /api/games/{gameId}:
 *  delete:
 *    tags:
 *      - Games
 *    summary: DELETE request for a specific game
 *    description: Makes a server request to delete a specific game using it's ID.
 *    parameters:
 *      - in: path
 *        name: gameId
 *        description: The identifier of the game to be deleted
 *        example: 616b9a868562c959c04a3cd1
 *    responses:
 *      200:
 *        description: Success response. Game deleted successfully.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Game deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified game
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
