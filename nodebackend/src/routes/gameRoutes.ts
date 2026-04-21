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

// Public routes (no auth needed)
router.get('/', getAllGames);

// Protected routes (auth required)
router.get('/:id', authenticateToken, getGameDetails);  // ← ADD authenticateToken here
router.post('/join', authenticateToken, joinGame);
router.post('/leave', authenticateToken, leaveGame);
router.get('/progress/:gameId', authenticateToken, getUserGameProgress);
router.post('/complete-step', authenticateToken, completeStep);
router.post('/uncomplete-step', authenticateToken, uncompleteStep);

export default router;