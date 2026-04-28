import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get user profile with stats
export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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

        // Get total books read (from completed status)
        const [booksReadResult]: any = await pool.query(
            "SELECT COUNT(*) as count FROM user_books WHERE user_id = ? AND status = 'completed'",
            [userId]
        );
        const booksRead = booksReadResult[0].count;

        // Get total pages read from completed books
        const [pagesResult]: any = await pool.query(
            `SELECT COALESCE(SUM(b.pages), 0) as total_pages 
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = 'completed'`,
            [userId]
        );
        const pagesRead = pagesResult[0].total_pages;

        // Get most common genre from completed books
        const [genreResult]: any = await pool.query(
            `SELECT b.genre, COUNT(*) as genre_count
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = 'completed' AND b.genre IS NOT NULL
             GROUP BY b.genre
             ORDER BY genre_count DESC
             LIMIT 1`,
            [userId]
        );
        const favoriteGenre = genreResult[0]?.genre || 'Not set';

        // Get books read this month
        const [monthlyResult]: any = await pool.query(
            `SELECT COUNT(*) as count FROM user_books 
             WHERE user_id = ? AND status = 'completed' 
             AND MONTH(return_date) = MONTH(CURDATE()) 
             AND YEAR(return_date) = YEAR(CURDATE())`,
            [userId]
        );
        const monthlyRead = monthlyResult[0].count;

        // Update or create reading_stats
        await pool.query(
            `INSERT INTO reading_stats (user_id, books_read_total, pages_read_total, favorite_genre, monthly_books_read)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             books_read_total = VALUES(books_read_total),
             pages_read_total = VALUES(pages_read_total),
             favorite_genre = VALUES(favorite_genre),
             monthly_books_read = VALUES(monthly_books_read)`,
            [userId, booksRead, pagesRead, favoriteGenre, monthlyRead]
        );

        res.json({
            success: true,
            profile: {
                name: user.full_name,
                initials: user.full_name.split(' ').map((n: string) => n[0]).join(''),
                joined: new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                booksRead: booksRead,
                rank: getRank(booksRead),
                profile_picture: user.profile_picture,
                stats: {
                    monthly: monthlyRead,
                    pagesYear: pagesRead.toLocaleString(),
                    favGenre: favoriteGenre
                }
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get borrowed books
export const getBorrowedBooks = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [books]: any = await pool.query(
            `SELECT b.id, b.title, b.author, b.cover_url, b.price,
                    ub.borrow_date, ub.due_date, ub.return_date, ub.rating
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = 'borrowed' AND ub.return_date IS NULL
             ORDER BY ub.due_date ASC`,
            [userId]
        );

        res.json({
            success: true,
            borrowedBooks: books.map((book: any) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                borrowDate: book.borrow_date?.toISOString().split('T')[0],
                dueDate: book.due_date?.toISOString().split('T')[0],
                rating: book.rating || 0,
                price: book.price
            }))
        });
    } catch (error) {
        console.error('Get borrowed books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Borrow a book
export const borrowBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId, daysToBorrow = 14 } = req.body;

        const [books]: any = await pool.query(
            'SELECT id, title, available_copies FROM books WHERE id = ?',
            [bookId]
        );

        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }

        const book = books[0];
        if (book.available_copies < 1) {
            res.status(400).json({ success: false, message: 'No copies available' });
            return;
        }

        // Check if user already borrowed this book
        const [existing]: any = await pool.query(
            "SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = 'borrowed' AND return_date IS NULL",
            [userId, bookId]
        );

        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'You already borrowed this book' });
            return;
        }

        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToBorrow);

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                `INSERT INTO user_books (user_id, book_id, status, borrow_date, due_date)
                 VALUES (?, ?, 'borrowed', ?, ?)`,
                [userId, bookId, borrowDate, dueDate]
            );

            await connection.query(
                'UPDATE books SET available_copies = available_copies - 1 WHERE id = ?',
                [bookId]
            );

            await connection.commit();
            connection.release();

            res.json({
                success: true,
                message: 'Book borrowed successfully',
                borrowDate: borrowDate.toISOString().split('T')[0],
                dueDate: dueDate.toISOString().split('T')[0]
            });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Borrow book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Return a book
export const returnBook = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId } = req.body;

        const [records]: any = await pool.query(
            `SELECT id FROM user_books 
             WHERE user_id = ? AND book_id = ? AND status = 'borrowed' AND return_date IS NULL`,
            [userId, bookId]
        );

        if (records.length === 0) {
            res.status(404).json({ success: false, message: 'Borrowed book not found' });
            return;
        }

        const [bookInfo]: any = await pool.query(
            'SELECT pages, genre FROM books WHERE id = ?',
            [bookId]
        );

        const connection = await pool.getConnection();
        await connection.beginTransaction();

        try {
            await connection.query(
                'DELETE FROM user_books WHERE id = ?',
                [records[0].id]
            );

            const [existingCompleted]: any = await connection.query(
                "SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = 'completed'",
                [userId, bookId]
            );

            if (existingCompleted.length === 0) {
                await connection.query(
                    `INSERT INTO user_books (user_id, book_id, status, return_date)
                     VALUES (?, ?, 'completed', NOW())`,
                    [userId, bookId]
                );

                const pages = bookInfo[0]?.pages || 0;
                const genre = bookInfo[0]?.genre;

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
                        `INSERT INTO reading_stats (user_id, books_read_total, pages_read_total, monthly_books_read, favorite_genre)
                         VALUES (?, 1, ?, 1, ?)`,
                        [userId, pages, genre]
                    );
                }
            }

            await connection.query(
                'UPDATE books SET available_copies = available_copies + 1 WHERE id = ?',
                [bookId]
            );

            await connection.commit();
            connection.release();

            res.json({ success: true, message: 'Book returned successfully' });
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    } catch (error) {
        console.error('Return book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get books by status (reading, wishlist, favorite, completed, purchased)
export const getBooksByStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { status } = req.params;

        const [books]: any = await pool.query(
            `SELECT b.id, b.title, b.author, b.cover_url, b.price, b.rating as book_rating,
                    ub.status, ub.rating as user_rating, ub.purchase_date, ub.created_at
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = ?
             ORDER BY ub.created_at DESC`,
            [userId, status]
        );

        const formattedBooks = books.map((book: any) => {
            const baseBook: any = {
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.user_rating || book.book_rating || 0
            };

            if (status === 'purchased') {
                baseBook.purchaseDate = book.purchase_date?.toISOString().split('T')[0];
            } else if (status === 'completed') {
                baseBook.completedDate = book.created_at?.toISOString().split('T')[0];
            }

            return baseBook;
        });

        res.json({ success: true, books: formattedBooks });
    } catch (error) {
        console.error('Get books by status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Add book to collection
export const addToCollection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId, status, rating, purchaseDate } = req.body;

        const [books]: any = await pool.query('SELECT id FROM books WHERE id = ?', [bookId]);

        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }

        const [existing]: any = await pool.query(
            'SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = ?',
            [userId, bookId, status]
        );

        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Book already in this collection' });
            return;
        }

        const insertData: any = {
            user_id: userId,
            book_id: bookId,
            status: status
        };

        if (status === 'purchased' && purchaseDate) {
            insertData.purchase_date = purchaseDate;
        }

        if (rating) {
            insertData.rating = rating;
        }

        await pool.query('INSERT INTO user_books SET ?', [insertData]);

        res.json({ success: true, message: `Book added to ${status} successfully` });
    } catch (error) {
        console.error('Add to collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Update book rating
export const updateRating = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId, rating } = req.body;

        if (rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
            return;
        }

        const [result]: any = await pool.query(
            `UPDATE user_books 
             SET rating = ? 
             WHERE user_id = ? AND book_id = ? AND status IN ('completed', 'borrowed')`,
            [rating, userId, bookId]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found or not completed' });
            return;
        }

        await pool.query(
            `UPDATE books b 
             SET rating = (
                 SELECT AVG(rating) FROM user_books 
                 WHERE book_id = ? AND rating IS NOT NULL
             )
             WHERE b.id = ?`,
            [bookId, bookId]
        );

        res.json({ success: true, message: 'Rating updated successfully' });
    } catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Remove book from collection
export const removeFromCollection = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId, status } = req.body;

        const [result]: any = await pool.query(
            'DELETE FROM user_books WHERE user_id = ? AND book_id = ? AND status = ?',
            [userId, bookId, status]
        );

        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found in this collection' });
            return;
        }

        res.json({ success: true, message: `Book removed from ${status} successfully` });
    } catch (error) {
        console.error('Remove from collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Check if book is in user's collections
export const getBookStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;
        const { bookId } = req.params;

        const [statuses]: any = await pool.query(
            'SELECT status FROM user_books WHERE user_id = ? AND book_id = ?',
            [userId, bookId]
        );

        const userStatuses = statuses.map((s: any) => s.status);

        res.json({
            success: true,
            isBorrowed: userStatuses.includes('borrowed'),
            isCompleted: userStatuses.includes('completed'),
            isReading: userStatuses.includes('reading'),
            isWishlist: userStatuses.includes('wishlist'),
            isFavorite: userStatuses.includes('favorite'),
            isPurchased: userStatuses.includes('purchased')
        });
    } catch (error) {
        console.error('Get book status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Helper function
function getRank(booksRead: number): string {
    if (booksRead >= 50) return 'Scholar';
    if (booksRead >= 25) return 'Book Master';
    if (booksRead >= 10) return 'Book Lover';
    if (booksRead >= 5) return 'Avid Reader';
    return 'New Reader';
}

// Get user's completed games
export const getCompletedGames = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [games]: any = await pool.query(
            `SELECT g.id, g.title, g.description, g.image_url, g.difficulty, g.duration,
                    ugp.completed_at
             FROM user_game_progress ugp
             JOIN games g ON ugp.game_id = g.id
             WHERE ugp.user_id = ? AND ugp.completed_at IS NOT NULL
             ORDER BY ugp.completed_at DESC`,
            [userId]
        );

        res.json({
            success: true,
            games: games.map((game: any) => ({
                id: game.id,
                title: game.title,
                description: game.description,
                image: game.image_url,
                difficulty: game.difficulty,
                duration: game.duration,
                completedAt: game.completed_at
            }))
        });
    } catch (error) {
        console.error('Get completed games error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get user's current enrolled games (joined but not completed)
export const getCurrentGames = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.user?.userId;

        const [games]: any = await pool.query(
            `SELECT g.id, g.title, g.description, g.image_url, g.difficulty, g.duration,
                    ugp.joined_at,
                    (SELECT COUNT(*) FROM user_completed_steps WHERE user_id = ? AND game_id = g.id) as completed_steps,
                    (SELECT COUNT(*) FROM game_steps WHERE game_id = g.id) as total_steps
             FROM user_game_progress ugp
             JOIN games g ON ugp.game_id = g.id
             WHERE ugp.user_id = ? AND ugp.completed_at IS NULL
             ORDER BY ugp.joined_at DESC`,
            [userId, userId]
        );

        res.json({
            success: true,
            games: games.map((game: any) => ({
                id: game.id,
                title: game.title,
                description: game.description,
                image: game.image_url,
                difficulty: game.difficulty,
                duration: game.duration,
                joinedAt: game.joined_at,
                progress: Math.round((game.completed_steps / game.total_steps) * 100) || 0
            }))
        });
    } catch (error) {
        console.error('Get current games error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};