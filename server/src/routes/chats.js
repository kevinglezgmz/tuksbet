const router = require('express').Router();
const ChatsController = require('../controllers/chats.controller.js');
const { cognitoAccessTokenAuth } = require('../middlewares/cognitoAuthentication');

router.get('/:chatRoomId/messages/', ChatsController.getAllChatMessages);
router.post('/:chatRoomId/messages/', cognitoAccessTokenAuth, ChatsController.createNewChatMessage);
router.patch('/:chatRoomId/messages/:chatMessageId', ChatsController.updateChatMessage);
router.delete('/:chatRoomId/messages/:chatMessageId', ChatsController.deleteChatMessage);

module.exports = router;

// GET ALL CHAT MESSAGES BY CHATROOM ID
/**
 * @swagger
 * /api/chatrooms/{chatRoomId}/messages:
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
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a868562c959c04a3cd1
 *              chatRoomName:
 *                type: string
 *                example: exampleGame
 *              username:
 *                type: string
 *                example: exampleUser
 *              userId:
 *                type: string
 *                example: 616b9a358864b959c04a3cd1
 *              message:
 *                type: string
 *                example: Hello!
 *              chatRoomId:
 *                type: string
 *                example: 616b9a868562c959c04x3123
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: There are no messages in this chatroom yet
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

// POST A MESSAGE BY CHATROOM ID
/**
 * @swagger
 * /api/chatrooms/{chatRoomId}/messages:
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
 *      - in: header
 *        name: Authorization
 *        description: The bearer's token
 *        example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MTdlZmMxMDFkYzRjMGIwMDVhODMxZDAiLCJ1c2VybmFtZSI6InVzdWFyaW9OdWV2byIsImVtYWlsIjoibmV3TWFpbEBtYWlsLmNvbSIsImlhdCI6MTYzNTcyMDIzM30.sJbwN2PrHKaRRY2_eJNfu0ccjJy1Uw2G-tSfmuNsraM
 *      - in: body
 *        name: message
 *        description: The message to be posted in the chat
 *        schema:
 *          type: object
 *          required:
 *            - userId
 *            - message
 *          properties:
 *            userId:
 *              type: string
 *              example: 616b9a358864b959c04a3cd1
 *          message:
 *              type: string
 *              example: Hello!
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

// PATCH A MESSAGE BY MESSAGEID
/**
 * @swagger
 * /api/chatrooms/{chatRoomId}/messages/{chatMessageId}:
 *  patch:
 *    tags:
 *      - Chats
 *    summary: PATCH request to update a message
 *    description: Makes a server request to update the data of a message.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *      - in: path
 *        name: chatMessageId
 *        description: The identifier of the chat message
 *        example: 616b9a868562c459c32a3dc4
 *      - in: body
 *        name: chat
 *        description: The message data to be updated
 *        schema:
 *          type: object
 *          required:
 *            - message
 *          properties:
 *            message:
 *              type: string
 *              example: Oh no!
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the message
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Successfully modified the message data
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified message
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

// DELETE A CHATMESSAGE
/**
 * @swagger
 * /api/chatrooms/{chatRoomId}/messages/{chatMessageId}:
 *  delete:
 *    tags:
 *      - Chats
 *    summary: DELETE request for a specific message
 *    description: Makes a server request to delete a specific message using it's ID.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 616b9a868562c959c04a3cd1
 *      - in: path
 *        name: chatMessageId
 *        description: The identifier of the chat message
 *        example: 616b9a868562c459c32a3dc4
 *    responses:
 *      200:
 *        description: Success response. Retrieves status of the message
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Message deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified message
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
