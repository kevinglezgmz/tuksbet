const router = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const multer = require('multer');

router.get('/', usersController.getAllUsers);
router.get('/:userId', usersController.getUserById);
router.post('/', multer().none(), usersController.createUser);
router.patch('/:userId', multer().none(), usersController.updateUser);
router.delete('/:userId', usersController.deleteUser);

module.exports = router;


// GET ALL USERS
/**
 * @swagger
 * /api/users/:
 *  get:
 *    tags:
 *      - Bets
 *    summary: GET request for all the users
 *    description: Make a server request to get all the users that have been registered.
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
 *                  betId:
 *                    type: int
 *                    example: 136
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
 *              example: No bets.
 *      401:
 *        description:
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
 *      500:
 *        description:
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Bad request
 */

// GET BET BY ID
/**
 * @swagger
 * /api/bets/:betId:
 *  get:
 *    tags:
 *      - Bets
 *    summary:
 *    parameters:
 *    description:
 *    responses:
 *      200:
 *        description:
 *        schema:
 *      400:
 *        description:
 *        schema:
 *      401:
 *        description:
 *        schema:
 *      500:
 *        description:
 *        schema:
 */

// POST A BET
/**
 * @swagger
 * /api/bets/:
 *  post:
 *    tags:
 *      - Bets
 *    summary:
 *    description:
 *    responses:
 *      200:
 *        description:
 *        schema:
 *      400:
 *        description:
 *        schema:
 *      401:
 *        description:
 *        schema:
 *      500:
 *        description:
 *        schema:
 */