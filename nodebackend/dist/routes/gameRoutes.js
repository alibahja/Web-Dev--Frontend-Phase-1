"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const gameController_1 = require("../controllers/gameController");
const router = express_1.default.Router();
/**
 * @swagger
 * /games:
 *   get:
 *     summary: Get all games/roadmaps
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: List of all games
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 games:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       image:
 *                         type: string
 *                       difficulty:
 *                         type: string
 *                       duration:
 *                         type: string
 *                       members:
 *                         type: integer
 *       500:
 *         description: Server error
 */
router.get('/', gameController_1.getAllGames);
/**
 * @swagger
 * /games/{id}:
 *   get:
 *     summary: Get game details with steps and user progress
 *     tags: [Games]
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
 *         description: Game details retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 game:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     description:
 *                       type: string
 *                     members:
 *                       type: integer
 *                     difficulty:
 *                       type: string
 *                     duration:
 *                       type: string
 *                     image:
 *                       type: string
 *                     topics:
 *                       type: array
 *                     steps:
 *                       type: array
 *                     joined:
 *                       type: boolean
 *                     completed:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Game not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware_1.authenticateToken, gameController_1.getGameDetails);
/**
 * @swagger
 * /games/join:
 *   post:
 *     summary: Join a game/roadmap
 *     tags: [Games]
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
 *             properties:
 *               gameId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully joined the game
 *       400:
 *         description: Already joined this game
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/join', authMiddleware_1.authenticateToken, gameController_1.joinGame);
/**
 * @swagger
 * /games/leave:
 *   post:
 *     summary: Leave a game/roadmap
 *     tags: [Games]
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
 *             properties:
 *               gameId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Successfully left the game
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/leave', authMiddleware_1.authenticateToken, gameController_1.leaveGame);
/**
 * @swagger
 * /games/progress/{gameId}:
 *   get:
 *     summary: Get user's progress for a specific game
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: User progress retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 hasJoined:
 *                   type: boolean
 *                 progress:
 *                   type: object
 *                   properties:
 *                     currentStepId:
 *                       type: integer
 *                     joinedAt:
 *                       type: string
 *                     completedAt:
 *                       type: string
 *                     completedSteps:
 *                       type: integer
 *                     totalSteps:
 *                       type: integer
 *                     percentage:
 *                       type: integer
 *                     completedStepIds:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/progress/:gameId', authMiddleware_1.authenticateToken, gameController_1.getUserGameProgress);
/**
 * @swagger
 * /games/complete-step:
 *   post:
 *     summary: Mark a step as completed in a game
 *     tags: [Games]
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
 *               - stepId
 *             properties:
 *               gameId:
 *                 type: integer
 *               stepId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Step completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 nextStepId:
 *                   type: integer
 *                 isComplete:
 *                   type: boolean
 *       400:
 *         description: Step already completed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Step not found
 *       500:
 *         description: Server error
 */
router.post('/complete-step', authMiddleware_1.authenticateToken, gameController_1.completeStep);
/**
 * @swagger
 * /games/uncomplete-step:
 *   post:
 *     summary: Mark a step as incomplete (for testing)
 *     tags: [Games]
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
 *               - stepId
 *             properties:
 *               gameId:
 *                 type: integer
 *               stepId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Step uncompleted successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/uncomplete-step', authMiddleware_1.authenticateToken, gameController_1.uncompleteStep);
exports.default = router;
