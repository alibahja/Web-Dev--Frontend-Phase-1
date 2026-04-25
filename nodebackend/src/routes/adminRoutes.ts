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

/**
 * @swagger
 * /admin/stats:
 *   get:
 *     summary: Get dashboard statistics
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     borrowedBooks:
 *                       type: integer
 *                     overdue:
 *                       type: integer
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/stats', getDashboardStats);

/**
 * @swagger
 * /admin/books:
 *   get:
 *     summary: Get all books (admin view)
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all books
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/books', getAllBooksAdmin);

/**
 * @swagger
 * /admin/books:
 *   post:
 *     summary: Add a new book
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - author
 *               - total_copies
 *               - price
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               isbn:
 *                 type: string
 *               genre:
 *                 type: string
 *               description:
 *                 type: string
 *               cover_url:
 *                 type: string
 *               total_copies:
 *                 type: integer
 *               price:
 *                 type: number
 *               year:
 *                 type: integer
 *               publisher:
 *                 type: string
 *               pages:
 *                 type: integer
 *               language:
 *                 type: string
 *               place_of_publish:
 *                 type: string
 *               tags:
 *                 type: string
 *     responses:
 *       200:
 *         description: Book added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/books', addBook);

/**
 * @swagger
 * /admin/books/{id}:
 *   put:
 *     summary: Update a book
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Book updated successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put('/books/:id', updateBook);

/**
 * @swagger
 * /admin/books/{id}:
 *   delete:
 *     summary: Delete a book
 *     tags: [Admin - Books]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/books/:id', deleteBook);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       400:
 *         description: Cannot delete your own account
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   put:
 *     summary: Update user role
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [student, librarian, admin]
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       404:
 *         description: User not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put('/users/:id/role', updateUserRole);

/**
 * @swagger
 * /admin/analytics/most-borrowed:
 *   get:
 *     summary: Get most borrowed book
 *     tags: [Admin - Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most borrowed book retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/analytics/most-borrowed', getMostBorrowedBook);

/**
 * @swagger
 * /admin/analytics/popular-genre:
 *   get:
 *     summary: Get most popular genre
 *     tags: [Admin - Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Most popular genre retrieved
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/analytics/popular-genre', getMostPopularGenre);

/**
 * @swagger
 * /admin/comments:
 *   get:
 *     summary: Get all comments
 *     tags: [Admin - Comments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all comments
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/comments', getAllComments);

/**
 * @swagger
 * /admin/comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Admin - Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/comments/:id', deleteCommentAdmin);

/**
 * @swagger
 * /admin/communities:
 *   get:
 *     summary: Get all communities
 *     tags: [Admin - Communities]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all communities
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/communities', getAllCommunitiesAdmin);

/**
 * @swagger
 * /admin/communities/{id}:
 *   delete:
 *     summary: Delete a community
 *     tags: [Admin - Communities]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Community deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/communities/:id', deleteCommunityAdmin);

/**
 * @swagger
 * /admin/games:
 *   get:
 *     summary: Get all games (admin view)
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all games
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.get('/games', getAllGamesAdmin);

/**
 * @swagger
 * /admin/games:
 *   post:
 *     summary: Create a new game
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - difficulty
 *               - duration
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *                 enum: [Beginner, Intermediate, Advanced]
 *               duration:
 *                 type: string
 *               image_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Game created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/games', createGame);

/**
 * @swagger
 * /admin/games/{id}:
 *   put:
 *     summary: Update a game
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Game updated successfully
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.put('/games/:id', updateGame);

/**
 * @swagger
 * /admin/games/{id}:
 *   delete:
 *     summary: Delete a game
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Game deleted successfully
 *       404:
 *         description: Game not found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.delete('/games/:id', deleteGame);

/**
 * @swagger
 * /admin/game-steps:
 *   post:
 *     summary: Add a step to a game
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameId
 *               - level
 *               - title
 *               - step_order
 *             properties:
 *               gameId:
 *                 type: integer
 *               level:
 *                 type: string
 *               title:
 *                 type: string
 *               step_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Step added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/game-steps', addGameStep);

/**
 * @swagger
 * /admin/step-books:
 *   post:
 *     summary: Add a book to a step
 *     tags: [Admin - Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - stepId
 *               - bookId
 *               - book_order
 *             properties:
 *               stepId:
 *                 type: integer
 *               bookId:
 *                 type: integer
 *               book_order:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Book added to step successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */
router.post('/step-books', addStepBook);

export default router;
