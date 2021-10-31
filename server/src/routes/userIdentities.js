const router = require('express').Router();

router.get('/', (req, res) => {
  res.send('User identities route works');
});
router.get('/:identityId', (req, res) => {
  res.send('Identity with id: ' + req.params.identityId + ' route works');
});
router.post('/', (req, res) => {});
router.post('/:identityId', (req, res) => {});

module.exports = router;


// GET ALL IDENTITIES
/**
 * @swagger
 * /api/userIdentities/:
 *  get:
 *    tags:
 *      - UserIdentities
 *    summary: GET request
 *    description: Make a server request to get
 *    responses:
 *      200:
 *        description: Success response. 
 *        schema:
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: 
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

// GET IDENTITY BY ID
/**
 * @swagger
 * /api/userIdentities/{identityId}:
 *  get:
 *    tags:
 *      - UserIdentities
 *    summary: GET request for one user
 *    description: Make a server request to get one
 *    parameters:
 *      - in: path
 *        name: identityId
 *        description: The id of the identity required
 *        example: 
 *    responses:
 *      200:
 *        description: Success response. 
 *        schema:
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: 
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

// POST NEW IDENTITY
/**
 * @swagger
 * /api/users/:
 *  post:
 *    tags:
 *      - UserIdentities
 *    summary: POST request
 *    description: Makes a server request
 *    responses:
 *      201:
 *        description: Success response.
 *        schema:
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
