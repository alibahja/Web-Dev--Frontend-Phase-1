import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import {
    getAllCommunities,
    getCommunityDetails,
    createCommunity,
    joinCommunity,
    leaveCommunity,
    removeMember,
    deleteCommunity
} from '../controllers/communityController';

const router = express.Router();

// Public routes
router.get('/', getAllCommunities);
router.get('/:id', authenticateToken, getCommunityDetails);

// Protected routes
router.use(authenticateToken);
router.post('/', createCommunity);
router.post('/join', joinCommunity);
router.post('/leave', leaveCommunity);
router.delete('/member', removeMember);
// allow founder to delete the community 
router.delete('/:id', authenticateToken, deleteCommunity);
export default router;