const router = require('express').Router();
const ChatRoomsController = require('../controllers/chatRooms.controller.js');

router.get('/', ChatRoomsController.getAllChatRooms);
router.post('/', ChatRoomsController.createNewChatRoom);
router.patch('/:chatRoomId', ChatRoomsController.updateChatRoom);
router.delete('/:chatRoomId', ChatRoomsController.deleteChatRoom);

module.exports = router;

// GET ALL CHAT ROOMS
/**
 * @swagger
 * /api/chatrooms:
 *  get:
 *    tags:
 *      - ChatRooms
 *    summary: GET request for all the chat rooms available
 *    description: Makes a server request to get all the chat rooms.
 *    responses:
 *      200:
 *        description: Success response. Retrieves the chat rooms in the database
 *        schema:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              _id:
 *                type: string
 *                example: 616b9a1232c959c04a3fc4
 *              chatRoomName:
 *                type: string
 *                example: Roulette
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: The are no chatrooms in the database yet
 *      500:
 *        description: Internal error
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Unexpected error, please try again
 */

// CREATE A NEW CHAT ROOM
/**
 * @swagger
 * /api/chatrooms:
 *  post:
 *    tags:
 *      - ChatRooms
 *    summary: POST request to create a new chat room
 *    description: Makes a server request to create a new chat room in the database.
 *    parameters:
 *      - in: body
 *        name: roomName
 *        description: The name of the chat room to be created
 *        type: object
 *        required:
 *             - roomName
 *        properties:
 *          chatRoomName:
 *            type: string
 *            example: Crash
 *    responses:
 *      201:
 *        description: Success response. Chat room created successfully.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Crash chat room created successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: This chat room already exists!
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

// UPDATE A CHATROOM NAME
/**
 * @swagger
 * /api/chatrooms/{chatRoomId}:
 *  patch:
 *    tags:
 *      - ChatRooms
 *    summary: PATCH request to update a chat room name
 *    description: Makes a server request to update the name of a chat room.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room
 *        example: 126b9a231562c922c04a1df9
 *      - in: body
 *        name: roomName
 *        description: The new name of the specified chat room
 *        type: object
 *        required:
 *             - roomName
 *        properties:
 *          chatRoomName:
 *            type: string
 *            example: Crash
 *    responses:
 *      200:
 *        description: Success response. Chat room name updated successfully
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Successfully changed the chat room name
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified chat room
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
 * /api/chatrooms/{chatRoomId}:
 *  delete:
 *    tags:
 *      - ChatRooms
 *    summary: DELETE request for a specific chat room
 *    description: Makes a server request to delete a specific chat room using it's ID.
 *    parameters:
 *      - in: path
 *        name: chatRoomId
 *        description: The identifier of the chat room to be deleted
 *        example: 616b9a868562c959c04a3cd1
 *    responses:
 *      200:
 *        description: Success response. Chat room deleted successfully.
 *        schema:
 *          type: object
 *          properties:
 *            msg:
 *              type: string
 *              example: Chat room deleted successfully
 *      400:
 *        description: Bad request
 *        schema:
 *          type: object
 *          properties:
 *            err:
 *              type: string
 *              example: Could not find the specified chat room
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
