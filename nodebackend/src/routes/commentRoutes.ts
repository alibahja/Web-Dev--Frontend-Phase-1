import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    getBookComments,
    getCommunityComments,
    addBookComment,
    addCommunityComment,
    addReply,
    deleteComment
} from '../controllers/commentController';

const router = express.Router();

/**
 * @swagger
 * /comments/book/{bookId}:
 *   get:
 *     summary: Get all comments for a specific book
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments with replies
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       author:
 *                         type: string
 *                       text:
 *                         type: string
 *                       replies:
 *                         type: array
 *       500:
 *         description: Server error
 */
router.get('/book/:bookId', getBookComments);

/**
 * @swagger
 * /comments/community/{communityId}:
 *   get:
 *     summary: Get all comments for a specific community
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of comments with replies
 *       500:
 *         description: Server error
 */
router.get('/community/:communityId', getCommunityComments);

// Protected routes (require authentication)
router.use(authenticateToken);

/**
 * @swagger
 * /comments/book/{bookId}:
 *   post:
 *     summary: Add a comment to a book
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Comment cannot be empty
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/book/:bookId', addBookComment);

/**
 * @swagger
 * /comments/community/{communityId}:
 *   post:
 *     summary: Add a comment to a community (must be a member)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: communityId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 *       400:
 *         description: Comment cannot be empty
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Must be a member to comment
 *       500:
 *         description: Server error
 */
router.post('/community/:communityId', addCommunityComment);

/**
 * @swagger
 * /comments/reply/{commentId}:
 *   post:
 *     summary: Add a reply to a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reply added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reply:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     author:
 *                       type: string
 *                     text:
 *                       type: string
 *       400:
 *         description: Reply cannot be empty
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Parent comment not found
 *       500:
 *         description: Server error
 */
router.post('/reply/:commentId', addReply);

/**
 * @swagger
 * /comments/{commentId}:
 *   delete:
 *     summary: Delete a comment (author or admin only)
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Unauthorized to delete this comment
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Server error
 */
router.delete('/:commentId', deleteComment);

export default router;
