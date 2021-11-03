const router = require('express').Router();
const sessionsController = require('../controllers/sessions.controller');

const authentication = require('../middlewares/authentication');

router.post('/login', sessionsController.loginUser);
router.get('/logout', authentication, sessionsController.logoutUser);

module.exports = router;

// POST LOGIN
/**
 * @swagger
 * /api/sessions/login/:
 *  post:
 *    tags:
 *      - Sessions
 *    summary: POST request for one session
 *    description: Makes a server request to login a user
 *    parameters:
 *       - in: body
 *         name: User
 *         description: The user to be logged in
 *         schema:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               example: "example@example.com"
 *             password:
 *               type: string
 *               example: examplePasswordEncrypted123
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the user.
 *        schema:
 *          type: object
 *          properties:
 *            statusInsert:
 *              type: boolean
 *              example: true
 *            token:
 *              type: string
 *              example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTdlZmMxMDFkYzRjMGIwMDVhODMxZDAiLCJ1c2VybmFtZSI6InVzdWFyaW9OdWV2byIsImVtYWlsIjoibmV3TWFpbEBtYWlsLmNvbSIsImlhdCI6MTYzNTcyMDIzM30.sJbwN2PrHKaRRY2_eJNfu0ccjJy1Uw2G-tSfmuNsraM
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Missing email or password.
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error ocurred, please try again
 */

// GET LOGOUT
/**
 * @swagger
 * /api/sessions/logout/:
 *  get:
 *    tags:
 *      - Sessions
 *    summary: GET request for one user
 *    description: Make a server request to logout a user.
 *    parameters:
 *      - in: header
 *        name: Authorization
 *        schema:
 *          type: string
 *        description: The bearer's token
 *        example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTdlZmMxMDFkYzRjMGIwMDVhODMxZDAiLCJ1c2VybmFtZSI6InVzdWFyaW9OdWV2byIsImVtYWlsIjoibmV3TWFpbEBtYWlsLmNvbSIsImlhdCI6MTYzNTcyMDIzM30.sJbwN2PrHKaRRY2_eJNfu0ccjJy1Uw2G-tSfmuNsraM
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the user.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Successfully logged out
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: No user.
 *      401:
 *        description: Not authorized
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: You can not logout if you are not logged in
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */
