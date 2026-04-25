import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    getAllGames,
    getGameDetails,
    joinGame,
    leaveGame,
    getUserGameProgress,
    completeStep,
    uncompleteStep
} from '../controllers/gameController';

const router = express.Router();

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
router.get('/', getAllGames);

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
router.get('/:id', authenticateToken, getGameDetails);

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
router.post('/join', authenticateToken, joinGame);

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
router.post('/leave', authenticateToken, leaveGame);

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
router.get('/progress/:gameId', authenticateToken, getUserGameProgress);

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
router.post('/complete-step', authenticateToken, completeStep);

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
router.post('/uncomplete-step', authenticateToken, uncompleteStep);

export default router;
