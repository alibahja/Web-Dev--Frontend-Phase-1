import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    sendContactMessage,
    sendPublicMessage,
    sendTestEmail
} from '../controllers/emailController';

const router = express.Router();

// Public route (no authentication needed)
router.post('/contact', sendPublicMessage);

// Protected routes (require login)
router.use(authenticateToken);
router.post('/message', sendContactMessage);
router.post('/test', sendTestEmail);

export default router;