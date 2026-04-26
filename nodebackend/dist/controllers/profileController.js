"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentGames = exports.getCompletedGames = exports.getBookStatus = exports.removeFromCollection = exports.updateRating = exports.addToCollection = exports.getBooksByStatus = exports.returnBook = exports.borrowBook = exports.getBorrowedBooks = exports.getProfile = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get user profile with stats
// Get user profile with stats
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        // Get user basic info
        const [users] = await database_1.default.query('SELECT id, full_name, email, role, profile_picture, created_at FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const user = users[0];
        // Get total books read (from completed status)
        const [booksReadResult] = await database_1.default.query('SELECT COUNT(*) as count FROM user_books WHERE user_id = ? AND status = "completed"', [userId]);
        const booksRead = booksReadResult[0].count;
        // Get total pages read from completed books
        const [pagesResult] = await database_1.default.query(`SELECT COALESCE(SUM(b.pages), 0) as total_pages 
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = "completed"`, [userId]);
        const pagesRead = pagesResult[0].total_pages;
        // Get most common genre from completed books
        const [genreResult] = await database_1.default.query(`SELECT b.genre, COUNT(*) as genre_count
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = "completed" AND b.genre IS NOT NULL
             GROUP BY b.genre
             ORDER BY genre_count DESC
             LIMIT 1`, [userId]);
        const favoriteGenre = genreResult[0]?.genre || 'Not set';
        // Get books read this month
        const [monthlyResult] = await database_1.default.query(`SELECT COUNT(*) as count FROM user_books 
             WHERE user_id = ? AND status = "completed" 
             AND MONTH(return_date) = MONTH(CURDATE()) 
             AND YEAR(return_date) = YEAR(CURDATE())`, [userId]);
        const monthlyRead = monthlyResult[0].count;
        // Update or create reading_stats table for persistence
        await database_1.default.query(`INSERT INTO reading_stats (user_id, books_read_total, pages_read_total, favorite_genre, monthly_books_read)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE
             books_read_total = VALUES(books_read_total),
             pages_read_total = VALUES(pages_read_total),
             favorite_genre = VALUES(favorite_genre),
             monthly_books_read = VALUES(monthly_books_read)`, [userId, booksRead, pagesRead, favoriteGenre, monthlyRead]);
        res.json({
            success: true,
            profile: {
                name: user.full_name,
                initials: user.full_name.split(' ').map((n) => n[0]).join(''),
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
    }
    catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getProfile = getProfile;
// Get borrowed books
const getBorrowedBooks = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const [books] = await database_1.default.query(`SELECT b.id, b.title, b.author, b.cover_url, b.price,
                    ub.borrow_date, ub.due_date, ub.return_date, ub.rating
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = 'borrowed' AND ub.return_date IS NULL
             ORDER BY ub.due_date ASC`, [userId]);
        res.json({
            success: true,
            borrowedBooks: books.map((book) => ({
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
    }
    catch (error) {
        console.error('Get borrowed books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBorrowedBooks = getBorrowedBooks;
// Borrow a book
const borrowBook = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId, daysToBorrow = 14 } = req.body;
        // Check if book exists and has available copies
        const [books] = await database_1.default.query('SELECT id, title, available_copies FROM books WHERE id = ?', [bookId]);
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
        const [existing] = await database_1.default.query('SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = "borrowed" AND return_date IS NULL', [userId, bookId]);
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'You already borrowed this book' });
            return;
        }
        const borrowDate = new Date();
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + daysToBorrow);
        // Start transaction
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Add to user_books
            await connection.query(`INSERT INTO user_books (user_id, book_id, status, borrow_date, due_date)
                 VALUES (?, ?, 'borrowed', ?, ?)`, [userId, bookId, borrowDate, dueDate]);
            // Decrease available copies
            await connection.query('UPDATE books SET available_copies = available_copies - 1 WHERE id = ?', [bookId]);
            await connection.commit();
            connection.release();
            res.json({
                success: true,
                message: 'Book borrowed successfully',
                borrowDate: borrowDate.toISOString().split('T')[0],
                dueDate: dueDate.toISOString().split('T')[0]
            });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Borrow book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.borrowBook = borrowBook;
// Return a book
const returnBook = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId } = req.body;
        // Find the borrowed record
        const [records] = await database_1.default.query(`SELECT id FROM user_books 
             WHERE user_id = ? AND book_id = ? AND status = 'borrowed' AND return_date IS NULL`, [userId, bookId]);
        if (records.length === 0) {
            res.status(404).json({ success: false, message: 'Borrowed book not found' });
            return;
        }
        // Get book details for pages
        const [bookInfo] = await database_1.default.query('SELECT pages, genre FROM books WHERE id = ?', [bookId]);
        const connection = await database_1.default.getConnection();
        await connection.beginTransaction();
        try {
            // Delete the borrowed record
            await connection.query('DELETE FROM user_books WHERE id = ?', [records[0].id]);
            // Check if completed record already exists
            const [existingCompleted] = await connection.query('SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = "completed"', [userId, bookId]);
            // Only insert completed record if it doesn't exist
            if (existingCompleted.length === 0) {
                await connection.query(`INSERT INTO user_books (user_id, book_id, status, return_date)
                     VALUES (?, ?, 'completed', NOW())`, [userId, bookId]);
                // Update reading stats with pages and genre
                const pages = bookInfo[0]?.pages || 0;
                const genre = bookInfo[0]?.genre;
                // Get current stats
                const [currentStats] = await connection.query('SELECT * FROM reading_stats WHERE user_id = ?', [userId]);
                if (currentStats.length > 0) {
                    // Update existing stats
                    await connection.query(`UPDATE reading_stats 
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
                         WHERE user_id = ?`, [pages, genre, genre, userId, userId]);
                }
                else {
                    // Create new stats
                    await connection.query(`INSERT INTO reading_stats (user_id, books_read_total, pages_read_total, monthly_books_read, favorite_genre)
                         VALUES (?, 1, ?, 1, ?)`, [userId, pages, genre]);
                }
            }
            // Increase available copies
            await connection.query('UPDATE books SET available_copies = available_copies + 1 WHERE id = ?', [bookId]);
            await connection.commit();
            connection.release();
            res.json({ success: true, message: 'Book returned successfully' });
        }
        catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
    catch (error) {
        console.error('Return book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.returnBook = returnBook;
// Get books by status (reading, wishlist, favorite, completed, purchased)
const getBooksByStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { status } = req.params; // reading, wishlist, favorite, completed, purchased
        const [books] = await database_1.default.query(`SELECT b.id, b.title, b.author, b.cover_url, b.price, b.rating as book_rating,
                    ub.status, ub.rating as user_rating, ub.purchase_date, ub.created_at
             FROM user_books ub
             JOIN books b ON ub.book_id = b.id
             WHERE ub.user_id = ? AND ub.status = ?
             ORDER BY ub.created_at DESC`, [userId, status]);
        let formattedBooks = books.map((book) => {
            const baseBook = {
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.user_rating || book.book_rating || 0
            };
            if (status === 'purchased') {
                baseBook.purchaseDate = book.purchase_date?.toISOString().split('T')[0];
            }
            else if (status === 'completed') {
                baseBook.completedDate = book.created_at?.toISOString().split('T')[0];
            }
            return baseBook;
        });
        res.json({
            success: true,
            books: formattedBooks
        });
    }
    catch (error) {
        console.error('Get books by status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBooksByStatus = getBooksByStatus;
// Add book to collection (reading, wishlist, favorite)
const addToCollection = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId, status, rating, purchaseDate } = req.body;
        // Check if book exists, if not create a basic entry
        const [books] = await database_1.default.query('SELECT id FROM books WHERE id = ?', [bookId]);
        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }
        // Check if already exists with same status
        const [existing] = await database_1.default.query('SELECT id FROM user_books WHERE user_id = ? AND book_id = ? AND status = ?', [userId, bookId, status]);
        if (existing.length > 0) {
            res.status(400).json({ success: false, message: 'Book already in this collection' });
            return;
        }
        const insertData = {
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
        await database_1.default.query('INSERT INTO user_books SET ?', [insertData]);
        res.json({
            success: true,
            message: `Book added to ${status} successfully`
        });
    }
    catch (error) {
        console.error('Add to collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addToCollection = addToCollection;
// Update book rating
const updateRating = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId, rating } = req.body;
        if (rating < 1 || rating > 5) {
            res.status(400).json({ success: false, message: 'Rating must be between 1 and 5' });
            return;
        }
        // Update rating in user_books
        const [result] = await database_1.default.query(`UPDATE user_books 
             SET rating = ? 
             WHERE user_id = ? AND book_id = ? AND status IN ('completed', 'borrowed')`, [rating, userId, bookId]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found or not completed' });
            return;
        }
        // Update average rating in books table
        await database_1.default.query(`UPDATE books b 
             SET rating = (
                 SELECT AVG(rating) FROM user_books 
                 WHERE book_id = ? AND rating IS NOT NULL
             )
             WHERE b.id = ?`, [bookId, bookId]);
        res.json({ success: true, message: 'Rating updated successfully' });
    }
    catch (error) {
        console.error('Update rating error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateRating = updateRating;
// Helper function
function getRank(booksRead) {
    if (booksRead >= 50)
        return 'Scholar';
    if (booksRead >= 25)
        return 'Book Master';
    if (booksRead >= 10)
        return 'Book Lover';
    if (booksRead >= 5)
        return 'Avid Reader';
    return 'New Reader';
}
// Remove book from collection (reading, wishlist, favorite)
const removeFromCollection = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId, status } = req.body;
        const [result] = await database_1.default.query('DELETE FROM user_books WHERE user_id = ? AND book_id = ? AND status = ?', [userId, bookId, status]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found in this collection' });
            return;
        }
        res.json({
            success: true,
            message: `Book removed from ${status} successfully`
        });
    }
    catch (error) {
        console.error('Remove from collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.removeFromCollection = removeFromCollection;
// Check if book is in user's collections
const getBookStatus = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId } = req.params;
        const [statuses] = await database_1.default.query('SELECT status FROM user_books WHERE user_id = ? AND book_id = ?', [userId, bookId]);
        const userStatuses = statuses.map((s) => s.status);
        res.json({
            success: true,
            isBorrowed: userStatuses.includes('borrowed'),
            isCompleted: userStatuses.includes('completed'),
            isReading: userStatuses.includes('reading'),
            isWishlist: userStatuses.includes('wishlist'),
            isFavorite: userStatuses.includes('favorite'),
            isPurchased: userStatuses.includes('purchased')
        });
    }
    catch (error) {
        console.error('Get book status error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBookStatus = getBookStatus;
// Get user's completed games
const getCompletedGames = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const [games] = await database_1.default.query(`SELECT g.id, g.title, g.description, g.image_url, g.difficulty, g.duration,
                    ugp.completed_at
             FROM user_game_progress ugp
             JOIN games g ON ugp.game_id = g.id
             WHERE ugp.user_id = ? AND ugp.completed_at IS NOT NULL
             ORDER BY ugp.completed_at DESC`, [userId]);
        res.json({
            success: true,
            games: games.map((game) => ({
                id: game.id,
                title: game.title,
                description: game.description,
                image: game.image_url,
                difficulty: game.difficulty,
                duration: game.duration,
                completedAt: game.completed_at
            }))
        });
    }
    catch (error) {
        console.error('Get completed games error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCompletedGames = getCompletedGames;
// Get user's current enrolled games (joined but not completed)
const getCurrentGames = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const [games] = await database_1.default.query(`SELECT g.id, g.title, g.description, g.image_url, g.difficulty, g.duration,
                    ugp.joined_at,
                    (SELECT COUNT(*) FROM user_completed_steps WHERE user_id = ? AND game_id = g.id) as completed_steps,
                    (SELECT COUNT(*) FROM game_steps WHERE game_id = g.id) as total_steps
             FROM user_game_progress ugp
             JOIN games g ON ugp.game_id = g.id
             WHERE ugp.user_id = ? AND ugp.completed_at IS NULL
             ORDER BY ugp.joined_at DESC`, [userId, userId]);
        res.json({
            success: true,
            games: games.map((game) => ({
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
    }
    catch (error) {
        console.error('Get current games error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCurrentGames = getCurrentGames;
