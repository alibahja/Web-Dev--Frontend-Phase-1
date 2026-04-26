"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCommunity = exports.removeMember = exports.leaveCommunity = exports.joinCommunity = exports.createCommunity = exports.getCommunityDetails = exports.getAllCommunities = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get all communities
const getAllCommunities = async (req, res) => {
    try {
        const [communities] = await database_1.default.query(`SELECT c.*, u.full_name as admin_name,
                    (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
             FROM communities c
             JOIN users u ON c.admin_id = u.id
             ORDER BY c.created_at DESC`);
        res.json({
            success: true,
            communities: communities.map((c) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                category: c.category,
                admin: c.admin_name,
                memberCount: c.member_count,
                members: c.member_count
            }))
        });
    }
    catch (error) {
        console.error('Get all communities error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllCommunities = getAllCommunities;
// Get single community details
const getCommunityDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        const [communities] = await database_1.default.query(`SELECT c.*, u.full_name as admin_name,
                    (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
             FROM communities c
             JOIN users u ON c.admin_id = u.id
             WHERE c.id = ?`, [id]);
        if (communities.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        const community = communities[0];
        // Get all members
        const [members] = await database_1.default.query(`SELECT u.id, u.full_name
             FROM community_members cm
             JOIN users u ON cm.user_id = u.id
             WHERE cm.community_id = ?
             ORDER BY cm.joined_at`, [id]);
        // Check if current user is a member
        const [isMember] = await database_1.default.query('SELECT id FROM community_members WHERE community_id = ? AND user_id = ?', [id, userId]);
        res.json({
            success: true,
            community: {
                id: community.id,
                name: community.name,
                description: community.description,
                category: community.category,
                admin: community.admin_name,
                adminId: community.admin_id,
                members: members.map((m) => ({
                    id: m.id,
                    name: m.full_name
                })),
                memberCount: community.member_count,
                isMember: isMember.length > 0,
                isAdmin: community.admin_id === userId
            }
        });
    }
    catch (error) {
        console.error('Get community details error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCommunityDetails = getCommunityDetails;
// Create a community
const createCommunity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { name, description, category } = req.body;
        // Check if name exists
        const [existing] = await database_1.default.query('SELECT id FROM communities WHERE name = ?', [name]);
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Community name already exists' });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Create community
            const [result] = await connection.query('INSERT INTO communities (name, description, category, admin_id) VALUES (?, ?, ?, ?)', [name, description, category, userId]);
            const communityId = result.insertId;
            // Add creator as member
            await connection.query('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)', [communityId, userId]);
            await connection.commit();
            connection.release();
            res.json({
                success: true,
                message: 'Community created successfully',
                communityId
            });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.createCommunity = createCommunity;
// Join a community
const joinCommunity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.body;
        // Check if already a member
        const [existing] = await database_1.default.query('SELECT id FROM community_members WHERE community_id = ? AND user_id = ?', [communityId, userId]);
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Already a member' });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Add member
            await connection.query('INSERT INTO community_members (community_id, user_id) VALUES (?, ?)', [communityId, userId]);
            // Update members count
            await connection.query('UPDATE communities SET members_count = members_count + 1 WHERE id = ?', [communityId]);
            await connection.commit();
            connection.release();
            res.json({ success: true, message: 'Joined community successfully' });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Join community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.joinCommunity = joinCommunity;
// Leave a community
const leaveCommunity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.body;
        // Check if user is admin
        const [community] = await database_1.default.query('SELECT admin_id FROM communities WHERE id = ?', [communityId]);
        if (community.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        if (community[0].admin_id === userId) {
            res.status(400).json({ success: false, message: 'Admin cannot leave the community' });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Remove member
            await connection.query('DELETE FROM community_members WHERE community_id = ? AND user_id = ?', [communityId, userId]);
            // Update members count
            await connection.query('UPDATE communities SET members_count = members_count - 1 WHERE id = ?', [communityId]);
            await connection.commit();
            connection.release();
            res.json({ success: true, message: 'Left community successfully' });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Leave community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.leaveCommunity = leaveCommunity;
// Remove member (admin only)
const removeMember = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId, memberId } = req.body;
        // Check if user is admin
        const [community] = await database_1.default.query('SELECT admin_id FROM communities WHERE id = ?', [communityId]);
        if (community.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        if (community[0].admin_id !== userId) {
            res.status(403).json({ success: false, message: 'Only admin can remove members' });
            return;
        }
        if (memberId === userId) {
            res.status(400).json({ success: false, message: 'Admin cannot remove themselves' });
            return;
        }
        await database_1.default.query('DELETE FROM community_members WHERE community_id = ? AND user_id = ?', [communityId, memberId]);
        await database_1.default.query('UPDATE communities SET members_count = members_count - 1 WHERE id = ?', [communityId]);
        res.json({ success: true, message: 'Member removed successfully' });
    }
    catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.removeMember = removeMember;
// Delete a community (admin only)
const deleteCommunity = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        // Check if community exists and get admin info
        const [communities] = await database_1.default.query('SELECT admin_id FROM communities WHERE id = ?', [id]);
        if (communities.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        const community = communities[0];
        // Check if user is the admin/founder
        if (community.admin_id !== userId) {
            res.status(403).json({ success: false, message: 'Only the community founder can delete this community' });
            return;
        }
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Delete all comments in this community first (due to foreign key constraints)
            await connection.query('DELETE FROM comments WHERE community_id = ?', [id]);
            // Delete all community members
            await connection.query('DELETE FROM community_members WHERE community_id = ?', [id]);
            // Finally delete the community
            await connection.query('DELETE FROM communities WHERE id = ?', [id]);
            await connection.commit();
            connection.release();
            res.json({
                success: true,
                message: 'Community deleted successfully'
            });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Delete community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteCommunity = deleteCommunity;
