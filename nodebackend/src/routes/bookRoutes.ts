import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    getAllBooks,
    searchBooks,
    advancedSearch,
    getBookDetails,
    getBooksByCollection,
    getBooksByGenre,
    getRandomBook,
    getGenres,
    getPublicStats
} from '../controllers/bookController';

const router = express.Router();

// Public routes (no authentication required)
router.get('/', getAllBooks);
router.get('/search', searchBooks);
router.get('/advanced-search', advancedSearch);
router.get('/random', getRandomBook);
router.get('/genres', getGenres);
router.get('/collection/:collection', getBooksByCollection);
router.get('/genre/:genre', getBooksByGenre);
router.get('/:id', getBookDetails);
router.get('/stats/public', getPublicStats);

export default router;