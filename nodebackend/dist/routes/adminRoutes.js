"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const adminController_1 = require("../controllers/adminController");
const router = express_1.default.Router();
// All admin routes require authentication AND admin role
router.use(authMiddleware_1.authenticateToken);
router.use(adminMiddleware_1.requireAdmin);
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
router.get('/stats', adminController_1.getDashboardStats);
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
router.get('/books', adminController_1.getAllBooksAdmin);
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
router.post('/books', adminController_1.addBook);
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
router.put('/books/:id', adminController_1.updateBook);
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
router.delete('/books/:id', adminController_1.deleteBook);
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
router.get('/users', adminController_1.getAllUsers);
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
router.delete('/users/:id', adminController_1.deleteUser);
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
router.put('/users/:id/role', adminController_1.updateUserRole);
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
router.get('/analytics/most-borrowed', adminController_1.getMostBorrowedBook);
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
router.get('/analytics/popular-genre', adminController_1.getMostPopularGenre);
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
router.get('/comments', adminController_1.getAllComments);
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
router.delete('/comments/:id', adminController_1.deleteCommentAdmin);
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
router.get('/communities', adminController_1.getAllCommunitiesAdmin);
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
router.delete('/communities/:id', adminController_1.deleteCommunityAdmin);
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
router.get('/games', adminController_1.getAllGamesAdmin);
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
router.post('/games', adminController_1.createGame);
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
router.put('/games/:id', adminController_1.updateGame);
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
router.delete('/games/:id', adminController_1.deleteGame);
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
router.post('/game-steps', adminController_1.addGameStep);
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
router.post('/step-books', adminController_1.addStepBook);
exports.default = router;
