const router = require('express').Router();
const usersController = require('../controllers/users.controller.js');
const multer = require('multer');
const authentication = require('../middlewares/authentication');

router.get('/', usersController.getAllUsers);
router.get('/:userId', authentication, usersController.getUserById);
router.post('/', multer().none(), usersController.createUser);
router.patch('/:userId', authentication, multer().none(), usersController.updateUser);
router.delete('/:userId', authentication, usersController.deleteUser);

module.exports = router;


// GET ALL USERS
/**
 * @swagger
 * /api/users/:
 *  get:
 *    tags:
 *      - Users
 *    summary: GET request for all the users
 *    description: Make a server request to get all the users that have been registered.
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the users.
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a868562c959c04a3cd1
 *              username:
 *                type: string
 *                example: exampleUser123
 *              email:
 *                type: string
 *                example: "example@example.com"
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: No users found!
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

// GET USER BY ID
/**
 * @swagger
 * /api/users/{userId}:
 *  get:
 *    tags:
 *      - Users
 *    summary: GET request for one user
 *    description: Make a server request to get one of the users who has been registered.
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: The id of the user required
 *        example: 617c32b2ee63d136fa191527
 *    responses:
 *      200:
 *        description: Success response. Retrieves all the data of the user.
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            username:
 *              type: string
 *              example: exampleUser123
 *            email:
 *              type: string
 *              example: "example@example.com"
 *            balance:
 *              type: float 
 *              example: 12.34
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: User 616b9a868562c959c04a3cd1 does not exist
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

// POST NEW USER
/**
 * @swagger
 * /api/users/:
 *  post:
 *    tags:
 *      - Users
 *    summary: POST request for one user
 *    description: Makes a server request to register a new user
 *    parameters:
 *       - in: body
 *         name: user
 *         description: The user to be registered
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - email
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               example: exampleUser2
 *             email:
 *               type: string
 *               example: "example2@example.com"
 *             password:
 *               type: string
 *               example: examplePasswordEncrypted123
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the registration.
 *        schema:
 *          type: object
 *          properties:
 *            inserted:
 *              type: boolean
 *              example: true
 *            userId:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: "The following fields are missing: username, email"
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

// PATCH USER
/**
 * @swagger
 * /api/users/{userId}:
 *  patch:
 *    tags:
 *      - Users
 *    summary: PATCH request for one user
 *    description: Makes a server request to register a new user
 *    parameters:
 *       - in: path
 *         name: userId
 *         description: The id of the user to be updated
 *         example: 617c32b2ee63d136fa191527
 *       - in: body
 *         name: user
 *         description: The user to be registered
 *         schema:
 *           type: object
 *           required:
 *             - username
 *             - password
 *           properties:
 *             username:
 *               type: string
 *               example: exampleUser2
 *             password:
 *               type: string
 *               example: examplePasswordEncrypted123
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the registration.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: User username updated successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
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
 *              example: Unexpected error ocurred, please try again
 */

// DELETE USER
/**
 * @swagger
 * /api/users/{userId}:
 *  delete:
 *    tags:
 *      - Users
 *    summary: DELETE request for one user
 *    description: Makes a server request to delete a user
 *    parameters:
 *      - in: path
 *        name: userId
 *        description: The id of the user required
 *        example: 617c3cd231a62043533f4952
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the deletion.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: User deleted successfully, we hope to see you back again soon
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