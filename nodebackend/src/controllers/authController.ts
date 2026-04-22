import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import pool from '../config/database';
import { generateToken } from '../config/jwt';
import { AuthRequest } from '../middlewares/authMiddleware';

export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { full_name, email, password, role = 'student' } = req.body;

        // Validation
        if (!full_name || !email || !password) {
            res.status(400).json({ 
                success: false, 
                message: 'Please provide all required fields' 
            });
            return;
        }

        if (password.length < 6) {
            res.status(400).json({ 
                success: false, 
                message: 'Password must be at least 6 characters' 
            });
            return;
        }

        // Check if user exists
        const [existingUsers]: any = await pool.query(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUsers.length > 0) {
            res.status(400).json({ 
                success: false, 
                message: 'User already exists with this email' 
            });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user
        const [result]: any = await pool.query(
            'INSERT INTO users (full_name, email, password, role) VALUES (?, ?, ?, ?)',
            [full_name, email, hashedPassword, role]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: result.insertId,
                full_name,
                email,
                role
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            res.status(400).json({ 
                success: false, 
                message: 'Please provide email and password' 
            });
            return;
        }

        // Get user
        const [users]: any = await pool.query(
            'SELECT id, full_name, email, password, role FROM users WHERE email = ?',
            [email]
        );

        if (users.length === 0) {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
            return;
        }

        const user = users[0];

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid email or password' 
            });
            return;
        }

        // Generate token
        const token = generateToken(user.id, user.email, user.role);

        res.json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const [users]: any = await pool.query(
            'SELECT id, full_name, email, role, created_at FROM users WHERE id = ?',
            [req.user?.userId]
        );

        if (users.length === 0) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
            return;
        }

        res.json({
            success: true,
            user: users[0]
        });
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
        });
    }
};
// Delete user account (soft delete or permanent)
export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Delete user's comments
            await connection.query('DELETE FROM comments WHERE user_id = ?', [userId]);
            
            // Delete user's community memberships
            await connection.query('DELETE FROM community_members WHERE user_id = ?', [userId]);
            
            // Delete user's communities (transfer ownership or delete)
            await connection.query(
                'UPDATE communities SET admin_id = 1 WHERE admin_id = ?', 
                [userId]
            );
            
            // Delete user's game progress
            await connection.query('DELETE FROM user_game_progress WHERE user_id = ?', [userId]);
            await connection.query('DELETE FROM user_completed_steps WHERE user_id = ?', [userId]);
            
            // Delete user's book records
            await connection.query('DELETE FROM user_books WHERE user_id = ?', [userId]);
            
            // Delete reading stats
            await connection.query('DELETE FROM reading_stats WHERE user_id = ?', [userId]);
            
            // Finally delete the user
            const [result]: any = await connection.query(
                'DELETE FROM users WHERE id = ?',
                [userId]
            );
            
            if (result.affectedRows === 0) {
                await connection.rollback();
                connection.release();
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            
            await connection.commit();
            connection.release();
            
            res.json({
                success: true,
                message: 'Account deleted successfully'
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Delete account error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Update profile picture
export const updateProfilePicture = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        
        if (!req.file) {
            res.status(400).json({ success: false, message: 'No file uploaded' });
            return;
        }
        
        const profilePictureUrl = `/uploads/profiles/${req.file.filename}`;
        
        await pool.query(
            'UPDATE users SET profile_picture = ? WHERE id = ?',
            [profilePictureUrl, userId]
        );
        
        res.json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePicture: profilePictureUrl
        });
    } catch (error) {
        console.error('Update profile picture error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get user profile with picture
export const getUserProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        
        const [users]: any = await pool.query(
            'SELECT id, full_name, email, role, profile_picture, created_at FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        
        const user = users[0];
        
        res.json({
            success: true,
            user: {
                id: user.id,
                full_name: user.full_name,
                email: user.email,
                role: user.role,
                profile_picture: user.profile_picture,
                created_at: user.created_at
            }
        });
    } catch (error) {
        console.error('Get user profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};