const router = require('express').Router();
const ChatsController = require('../controllers/chats.controller.js');

router.get('/:chatRoomId', ChatsController.getAllChatMessages);
router.post('/:chatRoomId', ChatsController.createNewChatMessage);

module.exports = router;

// GET ALL CHAT MESSAGES BY CHAT ID
/**
 * @swagger
 * /api/chats/{chatRoomId}:
 *  get:
 *    tags:
 *      - Chats
 *    summary: GET request for all the messages of a specific chat
 *    description: Makes a server request to get all the messages of a chat.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *    responses:
 *      200:
 *        description: Success response. Retrieves the messages of the chat
 *        schema:
 *          type: object
 *          properties:
 *            _id:
 *              type: string
 *              example: 616b9a868562c959c04a3cd1
 *            messages:
 *              type: array
 *              items:
 *                type: object
 *                properties:
 *                  _id:
 *                    type: string
 *                    example: 616b9a868562c959c04a3cd1
 *                  userId:
 *                    type: string
 *                    example: 616b9a358864b959c04a3cd1
 *                  chatRoomId:
 *                    type: string
 *                    example: 616b9a868562c959c04x3123
 *                  message:
 *                    type: string
 *                    example: Hello!
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not get the chat messages
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

// POST A MESSAGE BY CHAT ID
/**
 * @swagger
 * /api/chats/{chatRoomId}:
 *  post:
 *    tags:
 *      - Chats
 *    summary: POST request to add a new message in a specific chat
 *    description: Makes a server request to post a new message to a chat.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *      - in: body
 *        name: message
 *        description: The message to be posted in the chat
 *        type: object
 *        required:
 *             - userId
 *             - chatRoomId
 *             - message
 *        properties:
 *          userId:
 *            type: string
 *            example: 616b9a358864b959c04a3cd1
 *          chatRoomId:
 *             type: string
 *             example: 616b9a868562c959c04x3123
 *          message:
 *            type: string
 *            example: Hello!
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the message
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Message added
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not post the message
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

// PATCH A CHAT
/**
 * @swagger
 * /api/chats/{chatRoomId}:
 *  patch:
 *    tags:
 *      - Chats
 *    summary: PATCH request to update a specific chat
 *    description: Makes a server request to update the data of a chat.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *      - in: body
 *        name: chat
 *        description: The chat data to be updated
 *        type: object
 *        required:
 *             - chatRoomName
 *        properties:
 *          chatRoomName:
 *            type: string
 *            example: Roulette 2.0
 *    responses:
 *      201:
 *        description: Success response. Retrieves status of the chat room
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Chat room updated
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not update the chat room
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

// DELETE A CHAT
/**
 * @swagger
 * /api/chats/{chatRoomId}:
 *  delete:
 *    tags:
 *      - Chats
 *    summary: DELETE request for a specific chat
 *    description: Makes a server request to delete a specific chat using it's ID.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the chat
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Chat deleted
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not delete the chat room
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