import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all games
export const getAllGames = async (req: Request, res: Response): Promise<void> => {
    try {
        const [games]: any = await pool.query(
            'SELECT id, title, description, difficulty, duration, image_url, members_count FROM games ORDER BY id'
        );
        
        res.json({
            success: true,
            games: games.map((game: any) => ({
                id: game.id,
                title: game.title,
                description: game.description,
                image: game.image_url || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159',
                difficulty: game.difficulty,
                duration: game.duration,
                members: game.members_count
            }))
        });
    } catch (error) {
        console.error('Get all games error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get single game details with steps
export const getGameDetails = async (req: AuthRequest, res: Response): Promise<void> => {
      try {
        const { id } = req.params;
        const userId = req.user?.userId;
        
        
        console.log('=== getGameDetails Debug ===');
        console.log('Game ID:', id);
        console.log('User ID from token:', userId);
        console.log('Full req.user:', req.user);
        
        // Get game info
        const [games]: any = await pool.query(
            'SELECT * FROM games WHERE id = ?',
            [id]
        );
        
        if (games.length === 0) {
            res.status(404).json({ success: false, message: 'Game not found' });
            return;
        }
        
        const game = games[0];
        let hasJoined = false;
        
        if (userId) {
            const [joined]: any = await pool.query(
                'SELECT id FROM user_game_progress WHERE user_id = ? AND game_id = ?',
                [userId, id]
            );
            hasJoined = joined.length > 0;
            console.log('Query result for user_game_progress:', joined);
            console.log('Has joined:', hasJoined);
        } else {
            console.log('No userId available, cannot check join status');
        }
        let isCompleted = false;
if (userId) {
    const [completed]: any = await pool.query(
        'SELECT id FROM user_game_progress WHERE user_id = ? AND game_id = ? AND completed_at IS NOT NULL',
        [userId, id]
    );
    isCompleted = completed.length > 0;
}
        
        // Get steps with their books
        const [steps]: any = await pool.query(
            `SELECT gs.id, gs.level, gs.title, gs.step_order,
                    COALESCE(
                        JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', b.id,
                                'title', b.title,
                                'author', b.author,
                                'coverUrl', b.cover_url,
                                'description', b.description
                            )
                        ), '[]'
                    ) as books
             FROM game_steps gs
             LEFT JOIN step_books sb ON gs.id = sb.step_id
             LEFT JOIN books b ON sb.book_id = b.id
             WHERE gs.game_id = ?
             GROUP BY gs.id
             ORDER BY gs.step_order`,
            [id]
        );
        
        // Parse the JSON array properly
        const formattedSteps = steps.map((step: any) => ({
            id: step.id,
            level: step.level,
            title: step.title,
            books: step.books === '[]' || !step.books ? [] : 
                   (Array.isArray(step.books) ? step.books : JSON.parse(step.books))
        }));
        
        res.json({
            success: true,
            game: {
                id: game.id,
                title: game.title,
                description: game.description,
                members: game.members_count,
                difficulty: game.difficulty,
                duration: game.duration,
                image: game.image_url,
                topics: formattedSteps.map((s: any) => s.title),
                steps: formattedSteps,
                joined: hasJoined,  // This will be true if user has joined
                completed:isCompleted
            }
        });
    } catch (error) {
        console.error('Get game details error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Join a game
export const joinGame = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId } = req.body;
        
        // Check if already joined
        const [existing]: any = await pool.query(
            'SELECT id FROM user_game_progress WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Already joined this game' });
            return;
        }
        
        // Get first step of the game
        const [firstStep]: any = await pool.query(
            'SELECT id FROM game_steps WHERE game_id = ? ORDER BY step_order LIMIT 1',
            [gameId]
        );
        
        const currentStepId = firstStep.length > 0 ? firstStep[0].id : null;
        
        // Join game
        await pool.query(
            'INSERT INTO user_game_progress (user_id, game_id, current_step_id) VALUES (?, ?, ?)',
            [userId, gameId, currentStepId]
        );
        
        // Increment members count
        await pool.query(
            'UPDATE games SET members_count = members_count + 1 WHERE id = ?',
            [gameId]
        );
        
        res.json({
            success: true,
            message: 'Successfully joined the game'
        });
    } catch (error) {
        console.error('Join game error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Leave a game
export const leaveGame = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId } = req.body;
        
        // Delete progress
        await pool.query(
            'DELETE FROM user_game_progress WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        
        // Delete completed steps
        await pool.query(
            'DELETE FROM user_completed_steps WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        
        // Decrement members count
        await pool.query(
            'UPDATE games SET members_count = members_count - 1 WHERE id = ?',
            [gameId]
        );
        
        res.json({
            success: true,
            message: 'Successfully left the game'
        });
    } catch (error) {
        console.error('Leave game error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get user's progress for a specific game
export const getUserGameProgress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId } = req.params;
        
        // Get game progress
        const [progress]: any = await pool.query(
            `SELECT ugp.current_step_id, ugp.joined_at, ugp.completed_at,
                    COUNT(ucs.id) as completed_steps,
                    (SELECT COUNT(*) FROM game_steps WHERE game_id = ?) as total_steps
             FROM user_game_progress ugp
             LEFT JOIN user_completed_steps ucs ON ugp.user_id = ucs.user_id AND ugp.game_id = ucs.game_id
             WHERE ugp.user_id = ? AND ugp.game_id = ?
             GROUP BY ugp.id`,
            [gameId, userId, gameId]
        );
        
        if (progress.length === 0) {
            res.json({
                success: true,
                hasJoined: false,
                progress: null
            });
            return;
        }
        
        const data = progress[0];
        const completedSteps = data.completed_steps || 0;
        const totalSteps = data.total_steps || 1;
        
        // Get completed step IDs
        const [completedStepIds]: any = await pool.query(
            'SELECT step_id FROM user_completed_steps WHERE user_id = ? AND game_id = ?',
            [userId, gameId]
        );
        
        res.json({
            success: true,
            hasJoined: true,
            progress: {
                currentStepId: data.current_step_id,
                joinedAt: data.joined_at,
                completedAt: data.completed_at,
                completedSteps: completedSteps,
                totalSteps: totalSteps,
                percentage: Math.round((completedSteps / totalSteps) * 100),
                completedStepIds: completedStepIds.map((s: any) => s.step_id)
            }
        });
    } catch (error) {
        console.error('Get user progress error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Complete a step
export const completeStep = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId, stepId } = req.body;
        
        // Check if step belongs to game
        const [stepCheck]: any = await pool.query(
            'SELECT id FROM game_steps WHERE id = ? AND game_id = ?',
            [stepId, gameId]
        );
        
        if (stepCheck.length === 0) {
            res.status(404).json({ success: false, message: 'Step not found' });
            return;
        }
        
        // Check if already completed
        const [existing]: any = await pool.query(
            'SELECT id FROM user_completed_steps WHERE user_id = ? AND game_id = ? AND step_id = ?',
            [userId, gameId, stepId]
        );
        
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Step already completed' });
            return;
        }
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Mark step as completed
            await connection.query(
                'INSERT INTO user_completed_steps (user_id, game_id, step_id) VALUES (?, ?, ?)',
                [userId, gameId, stepId]
            );
            
            // Get the books in this step
            const [stepBooks]: any = await connection.query(
                'SELECT book_id FROM step_books WHERE step_id = ?',
                [stepId]
            );
            
            // For each book, mark as completed in user_books and update stats
            for (const sb of stepBooks) {
                const [existingBook]: any = await connection.query(
                    'SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = "completed"',
                    [userId, sb.book_id]
                );
                
                if (existingBook.length === 0) {
                    await connection.query(
                        'INSERT INTO user_books (user_id, book_id, status, return_date) VALUES (?, ?, "completed", NOW())',
                        [userId, sb.book_id]
                    );
                    
                    // Get book pages and genre
                    const [bookInfo]: any = await connection.query(
                        'SELECT pages, genre FROM books WHERE id = ?',
                        [sb.book_id]
                    );
                    const pages = bookInfo[0]?.pages || 0;
                    const genre = bookInfo[0]?.genre;
                    
                    // Update reading stats
                    const [currentStats]: any = await connection.query(
                        'SELECT * FROM reading_stats WHERE user_id = ?',
                        [userId]
                    );
                    
                    if (currentStats.length > 0) {
                        await connection.query(
                            `UPDATE reading_stats 
                             SET books_read_total = books_read_total + 1,
                                 pages_read_total = pages_read_total + ?,
                                 monthly_books_read = monthly_books_read + 1,
                                 favorite_genre = CASE 
                                     WHEN ? IS NOT NULL AND ? = favorite_genre THEN favorite_genre
                                     ELSE (
                                         SELECT genre FROM (
                                             SELECT genre, COUNT(*) as count 
                                             FROM user_books ub
                                             JOIN books b ON ub.book_id = b.id
                                             WHERE ub.user_id = ? AND ub.status = 'completed'
                                             GROUP BY genre
                                             ORDER BY count DESC 
                                             LIMIT 1
                                         ) as fav
                                     )
                                 END
                             WHERE user_id = ?`,
                            [pages, genre, genre, userId, userId]
                        );
                    } else {
                        await connection.query(
                            'INSERT INTO reading_stats (user_id, books_read_total, pages_read_total, monthly_books_read, favorite_genre) VALUES (?, 1, ?, 1, ?)',
                            [userId, pages, genre]
                        );
                    }
                }
            }
            
            // Get next step
            const [currentStep]: any = await connection.query(
                'SELECT step_order FROM game_steps WHERE id = ?',
                [stepId]
            );
            
            const [nextStep]: any = await connection.query(
                'SELECT id FROM game_steps WHERE game_id = ? AND step_order > ? ORDER BY step_order LIMIT 1',
                [gameId, currentStep[0].step_order]
            );
            
            const nextStepId = nextStep.length > 0 ? nextStep[0].id : null;
            
            // Check if all steps are completed
            const [completedCount]: any = await connection.query(
                'SELECT COUNT(*) as count FROM user_completed_steps WHERE user_id = ? AND game_id = ?',
                [userId, gameId]
            );
            
            const [totalSteps]: any = await connection.query(
                'SELECT COUNT(*) as count FROM game_steps WHERE game_id = ?',
                [gameId]
            );
            
            const isComplete = completedCount[0].count === totalSteps[0].count;
            
            // Update progress
            await connection.query(
                'UPDATE user_game_progress SET current_step_id = ?, completed_at = ? WHERE user_id = ? AND game_id = ?',
                [nextStepId, isComplete ? new Date() : null, userId, gameId]
            );
            
            await connection.commit();
            connection.release();
            
            res.json({
                success: true,
                message: 'Step completed successfully',
                nextStepId,
                isComplete
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Complete step error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Uncomplete a step (for testing/flexibility)
export const uncompleteStep = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { gameId, stepId } = req.body;
        
        await pool.query(
            'DELETE FROM user_completed_steps WHERE user_id = ? AND game_id = ? AND step_id = ?',
            [userId, gameId, stepId]
        );
        
        res.json({
            success: true,
            message: 'Step uncompleted successfully'
        });
    } catch (error) {
        console.error('Uncomplete step error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};