"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const communityController_1 = require("../controllers/communityController");
const router = express_1.default.Router();
/**
 * @swagger
 * /communities:
 *   get:
 *     summary: Get all communities
 *     tags: [Communities]
 *     responses:
 *       200:
 *         description: List of all communities
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 communities:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       description:
 *                         type: string
 *                       category:
 *                         type: string
 *                       admin:
 *                         type: string
 *                       memberCount:
 *                         type: integer
 *       500:
 *         description: Server error
 */
router.get('/', communityController_1.getAllCommunities);
/**
 * @swagger
 * /communities/{id}:
 *   get:
 *     summary: Get community details by ID
 *     tags: [Communities]
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
 *         description: Community details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 community:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     category:
 *                       type: string
 *                     admin:
 *                       type: string
 *                     adminId:
 *                       type: integer
 *                     members:
 *                       type: array
 *                     memberCount:
 *                       type: integer
 *                     isMember:
 *                       type: boolean
 *                     isAdmin:
 *                       type: boolean
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Community not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authMiddleware_1.authenticateToken, communityController_1.getCommunityDetails);
// Protected routes (require authentication)
router.use(authMiddleware_1.authenticateToken);
/**
 * @swagger
 * /communities:
 *   post:
 *     summary: Create a new community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *     responses:
 *       200:
 *         description: Community created successfully
 *       400:
 *         description: Community name already exists
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', communityController_1.createCommunity);
/**
 * @swagger
 * /communities/join:
 *   post:
 *     summary: Join a community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - communityId
 *             properties:
 *               communityId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Joined community successfully
 *       400:
 *         description: Already a member
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/join', communityController_1.joinCommunity);
/**
 * @swagger
 * /communities/leave:
 *   post:
 *     summary: Leave a community
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - communityId
 *             properties:
 *               communityId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Left community successfully
 *       400:
 *         description: Admin cannot leave the community
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Community not found
 *       500:
 *         description: Server error
 */
router.post('/leave', communityController_1.leaveCommunity);
/**
 * @swagger
 * /communities/member:
 *   delete:
 *     summary: Remove a member from community (admin only)
 *     tags: [Communities]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - communityId
 *               - memberId
 *             properties:
 *               communityId:
 *                 type: integer
 *               memberId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: Admin cannot remove themselves
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Only admin can remove members
 *       404:
 *         description: Community not found
 *       500:
 *         description: Server error
 */
router.delete('/member', communityController_1.removeMember);
/**
 * @swagger
 * /communities/{id}:
 *   delete:
 *     summary: Delete a community (founder only)
 *     tags: [Communities]
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
 *         description: Only the community founder can delete this community
 *       404:
 *         description: Community not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authMiddleware_1.authenticateToken, communityController_1.deleteCommunity);
exports.default = router;
