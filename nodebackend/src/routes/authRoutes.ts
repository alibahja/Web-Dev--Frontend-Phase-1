import express from 'express';
import { register, login, getCurrentUser, deleteAccount } from '../controllers/authController';
import { authenticateToken } from '../middlewares/authMiddleware';
import { upload } from '../middlewares/uploadMiddleware';
import { updateProfilePicture, getUserProfile } from '../controllers/authController';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getCurrentUser);
router.delete('/account',authenticateToken, deleteAccount);
router.get('/me', authenticateToken, getUserProfile);
router.post('/profile-picture', authenticateToken, upload.single('profilePicture'), updateProfilePicture);
export default router;