import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all communities
export const getAllCommunities = async (req: Request, res: Response): Promise<void> => {
    try {
        const [communities]: any = await pool.query(
            `SELECT c.*, u.full_name as admin_name,
                    (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
             FROM communities c
             JOIN users u ON c.admin_id = u.id
             ORDER BY c.created_at DESC`
        );
        
        res.json({
            success: true,
            communities: communities.map((c: any) => ({
                id: c.id,
                name: c.name,
                description: c.description,
                category: c.category,
                admin: c.admin_name,
                memberCount:c.member_count,
                members: c.member_count
            }))
        });
    } catch (error) {
        console.error('Get all communities error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get single community details
export const getCommunityDetails = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.userId;
        
        const [communities]: any = await pool.query(
            `SELECT c.*, u.full_name as admin_name,
                    (SELECT COUNT(*) FROM community_members WHERE community_id = c.id) as member_count
             FROM communities c
             JOIN users u ON c.admin_id = u.id
             WHERE c.id = ?`,
            [id]
        );
        
        if (communities.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        
        const community = communities[0];
        
        // Get all members
        const [members]: any = await pool.query(
            `SELECT u.id, u.full_name
             FROM community_members cm
             JOIN users u ON cm.user_id = u.id
             WHERE cm.community_id = ?
             ORDER BY cm.joined_at`,
            [id]
        );
        
        // Check if current user is a member
        const [isMember]: any = await pool.query(
            'SELECT id FROM community_members WHERE community_id = ? AND user_id = ?',
            [id, userId]
        );
        
        res.json({
            success: true,
            community: {
                id: community.id,
                name: community.name,
                description: community.description,
                category: community.category,
                admin: community.admin_name,
                adminId: community.admin_id,
                members: members.map((m: any) => ({
                    id: m.id,
                    name: m.full_name
                })),
                memberCount: community.member_count,
                isMember: isMember.length > 0,
                isAdmin: community.admin_id === userId
            }
        });
    } catch (error) {
        console.error('Get community details error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Create a community
export const createCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { name, description, category } = req.body;
        
        // Check if name exists
        const [existing]: any = await pool.query(
            'SELECT id FROM communities WHERE name = ?',
            [name]
        );
        
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Community name already exists' });
            return;
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Create community
            const [result]: any = await connection.query(
                'INSERT INTO communities (name, description, category, admin_id) VALUES (?, ?, ?, ?)',
                [name, description, category, userId]
            );
            
            const communityId = result.insertId;
            
            // Add creator as member
            await connection.query(
                'INSERT INTO community_members (community_id, user_id) VALUES (?, ?)',
                [communityId, userId]
            );
            
            await connection.commit();
            connection.release();
            
            res.json({
                success: true,
                message: 'Community created successfully',
                communityId
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Create community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Join a community
export const joinCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.body;
        
        // Check if already a member
        const [existing]: any = await pool.query(
            'SELECT id FROM community_members WHERE community_id = ? AND user_id = ?',
            [communityId, userId]
        );
        
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Already a member' });
            return;
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Add member
            await connection.query(
                'INSERT INTO community_members (community_id, user_id) VALUES (?, ?)',
                [communityId, userId]
            );
            
            // Update members count
            await connection.query(
                'UPDATE communities SET members_count = members_count + 1 WHERE id = ?',
                [communityId]
            );
            
            await connection.commit();
            connection.release();
            
            res.json({ success: true, message: 'Joined community successfully' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Join community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Leave a community
export const leaveCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.body;
        
        // Check if user is admin
        const [community]: any = await pool.query(
            'SELECT admin_id FROM communities WHERE id = ?',
            [communityId]
        );
        
        if (community.length === 0) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        
        if (community[0].admin_id === userId) {
            res.status(400).json({ success: false, message: 'Admin cannot leave the community' });
            return;
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Remove member
            await connection.query(
                'DELETE FROM community_members WHERE community_id = ? AND user_id = ?',
                [communityId, userId]
            );
            
            // Update members count
            await connection.query(
                'UPDATE communities SET members_count = members_count - 1 WHERE id = ?',
                [communityId]
            );
            
            await connection.commit();
            connection.release();
            
            res.json({ success: true, message: 'Left community successfully' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Leave community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove member (admin only)
export const removeMember = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { communityId, memberId } = req.body;
        
        // Check if user is admin
        const [community]: any = await pool.query(
            'SELECT admin_id FROM communities WHERE id = ?',
            [communityId]
        );
        
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
        
        await pool.query(
            'DELETE FROM community_members WHERE community_id = ? AND user_id = ?',
            [communityId, memberId]
        );
        
        await pool.query(
            'UPDATE communities SET members_count = members_count - 1 WHERE id = ?',
            [communityId]
        );
        
        res.json({ success: true, message: 'Member removed successfully' });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Delete a community (admin only)
export const deleteCommunity = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { id } = req.params;
        
        // Check if community exists and get admin info
        const [communities]: any = await pool.query(
            'SELECT admin_id FROM communities WHERE id = ?',
            [id]
        );
        
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
        
        const connection = await pool.getConnection();
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
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Delete community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};