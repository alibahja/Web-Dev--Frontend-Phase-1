import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    getProfile,
    getBorrowedBooks,
    borrowBook,
    returnBook,
    getBooksByStatus,
    addToCollection,
    updateRating,
    getBookStatus,
    removeFromCollection,
    getCurrentGames,
    getCompletedGames
} from '../controllers/profileController';

const router = express.Router();

// All profile routes require authentication
router.use(authenticateToken);

// Profile
router.get('/profile', getProfile);

// Borrowed books
router.get('/borrowed', getBorrowedBooks);
router.post('/borrow', borrowBook);
router.post('/return', returnBook);

// Collections by status
router.get('/books/:status', getBooksByStatus);
router.post('/collection', addToCollection);

// Ratings
router.post('/rating', updateRating);

// Add these routes
router.delete('/collection', removeFromCollection);
router.get('/book/:bookId/status', getBookStatus);

// Get and retrieve finsihed and current games
router.get('/games/completed', getCompletedGames);
router.get('/games/current', getCurrentGames);

export default router;