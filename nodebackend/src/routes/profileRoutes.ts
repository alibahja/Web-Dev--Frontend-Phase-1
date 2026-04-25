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

/**
 * @swagger
 * /profile/profile:
 *   get:
 *     summary: Get user profile with reading stats
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 profile:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     initials:
 *                       type: string
 *                     joined:
 *                       type: string
 *                     booksRead:
 *                       type: integer
 *                     rank:
 *                       type: string
 *                     profile_picture:
 *                       type: string
 *                     stats:
 *                       type: object
 *                       properties:
 *                         monthly:
 *                           type: integer
 *                         pagesYear:
 *                           type: string
 *                         favGenre:
 *                           type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/profile', getProfile);

/**
 * @swagger
 * /profile/borrowed:
 *   get:
 *     summary: Get user's borrowed books
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of borrowed books
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/borrowed', getBorrowedBooks);

/**
 * @swagger
 * /profile/borrow:
 *   post:
 *     summary: Borrow a book
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *               daysToBorrow:
 *                 type: integer
 *                 default: 14
 *     responses:
 *       200:
 *         description: Book borrowed successfully
 *       400:
 *         description: No copies available or already borrowed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post('/borrow', borrowBook);

/**
 * @swagger
 * /profile/return:
 *   post:
 *     summary: Return a borrowed book
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *             properties:
 *               bookId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Borrowed book not found
 *       500:
 *         description: Server error
 */
router.post('/return', returnBook);

/**
 * @swagger
 * /profile/books/{status}:
 *   get:
 *     summary: Get books by status (reading, wishlist, favorite, completed, purchased)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *           enum: [reading, wishlist, favorite, completed, purchased]
 *     responses:
 *       200:
 *         description: List of books with specified status
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/books/:status', getBooksByStatus);

/**
 * @swagger
 * /profile/collection:
 *   post:
 *     summary: Add a book to a collection (reading, wishlist, favorite, purchased)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - status
 *             properties:
 *               bookId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [reading, wishlist, favorite, purchased]
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               purchaseDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Book added to collection successfully
 *       400:
 *         description: Book already in this collection
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.post('/collection', addToCollection);

/**
 * @swagger
 * /profile/collection:
 *   delete:
 *     summary: Remove a book from a collection
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - status
 *             properties:
 *               bookId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [reading, wishlist, favorite]
 *     responses:
 *       200:
 *         description: Book removed from collection successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found in this collection
 *       500:
 *         description: Server error
 */
router.delete('/collection', removeFromCollection);

/**
 * @swagger
 * /profile/rating:
 *   post:
 *     summary: Rate a book
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bookId
 *               - rating
 *             properties:
 *               bookId:
 *                 type: integer
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Rating updated successfully
 *       400:
 *         description: Rating must be between 1 and 5
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found or not completed
 *       500:
 *         description: Server error
 */
router.post('/rating', updateRating);

/**
 * @swagger
 * /profile/book/{bookId}/status:
 *   get:
 *     summary: Get a book's status for the current user
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book status retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 isBorrowed:
 *                   type: boolean
 *                 isCompleted:
 *                   type: boolean
 *                 isReading:
 *                   type: boolean
 *                 isWishlist:
 *                   type: boolean
 *                 isFavorite:
 *                   type: boolean
 *                 isPurchased:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/book/:bookId/status', getBookStatus);

/**
 * @swagger
 * /profile/games/completed:
 *   get:
 *     summary: Get user's completed games
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed games
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/games/completed', getCompletedGames);

/**
 * @swagger
 * /profile/games/current:
 *   get:
 *     summary: Get user's current enrolled games (joined but not completed)
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of current games with progress
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/games/current', getCurrentGames);

export default router;
