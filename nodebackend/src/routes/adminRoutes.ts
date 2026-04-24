import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { requireAdmin } from '../middlewares/adminMiddleware';
import {
    getDashboardStats,
    getAllBooksAdmin,
    addBook,
    updateBook,
    deleteBook,
    getAllUsers,
    deleteUser,
    updateUserRole,
    getMostBorrowedBook,
    getMostPopularGenre,
    getAllComments,
    deleteCommentAdmin,
    getAllCommunitiesAdmin,
    deleteCommunityAdmin,
    getAllGamesAdmin,
    createGame,
    updateGame,
    deleteGame,
    addStepBook,
    addGameStep
} from '../controllers/adminController';

const router = express.Router();

// All admin routes require authentication AND admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// Book Management
router.get('/books', getAllBooksAdmin);
router.post('/books', addBook);
router.put('/books/:id', updateBook);
router.delete('/books/:id', deleteBook);

// User Management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/role', updateUserRole);

// Analytics
router.get('/analytics/most-borrowed', getMostBorrowedBook);
router.get('/analytics/popular-genre', getMostPopularGenre);

// Comment Management
router.get('/comments', getAllComments);
router.delete('/comments/:id', deleteCommentAdmin);

// Community Management
router.get('/communities', getAllCommunitiesAdmin);
router.delete('/communities/:id', deleteCommunityAdmin);

// Game Management
router.get('/games', getAllGamesAdmin);
router.post('/games', createGame);
router.put('/games/:id', updateGame);
router.delete('/games/:id', deleteGame);
router.post('/game-steps', addGameStep);
router.post('/step-books', addStepBook);
export default router;