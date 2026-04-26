"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const emailController_1 = require("../controllers/emailController");
const router = express_1.default.Router();
/**
 * @swagger
 * /email/contact:
 *   post:
 *     summary: Send a contact message (public - no login required)
 *     tags: [Email]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - message
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               message:
 *                 type: string
 *                 example: I have a question about borrowing books.
 *               subject:
 *                 type: string
 *                 example: Book Borrowing Question
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields or invalid email
 *       500:
 *         description: Server error
 */
router.post('/contact', emailController_1.sendPublicMessage);
// Protected routes (require login)
router.use(authMiddleware_1.authenticateToken);
/**
 * @swagger
 * /email/message:
 *   post:
 *     summary: Send a contact message (authenticated user)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *               subject:
 *                 type: string
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Message cannot be empty
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/message', emailController_1.sendContactMessage);
/**
 * @swagger
 * /email/test:
 *   post:
 *     summary: Send a test email (admin only)
 *     tags: [Email]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test email sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/test', emailController_1.sendTestEmail);
exports.default = router;
