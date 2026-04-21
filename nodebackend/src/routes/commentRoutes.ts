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

// Public routes (view comments)
router.get('/book/:bookId', getBookComments);
router.get('/community/:communityId', getCommunityComments);

// Protected routes
router.use(authenticateToken);
router.post('/book/:bookId', addBookComment);
router.post('/community/:communityId', addCommunityComment);
router.post('/reply/:commentId', addReply);
router.delete('/:commentId', deleteComment);

export default router;