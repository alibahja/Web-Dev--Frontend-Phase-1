"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addStepBook = exports.addGameStep = exports.deleteGame = exports.updateGame = exports.createGame = exports.getAllGamesAdmin = exports.deleteCommunityAdmin = exports.getAllCommunitiesAdmin = exports.deleteCommentAdmin = exports.getAllComments = exports.getMostPopularGenre = exports.getMostBorrowedBook = exports.updateUserRole = exports.deleteUser = exports.getAllUsers = exports.deleteBook = exports.updateBook = exports.addBook = exports.getAllBooksAdmin = exports.getDashboardStats = void 0;
const database_1 = __importDefault(require("../config/database"));
// ============ DASHBOARD STATS ============
const getDashboardStats = async (req, res) => {
    try {
        // Total books
        const [totalBooks] = await database_1.default.query('SELECT COUNT(*) as count FROM books');
        // Total users
        const [totalUsers] = await database_1.default.query('SELECT COUNT(*) as count FROM users WHERE role != "admin"');
        // Borrowed books
        const [borrowedBooks] = await database_1.default.query('SELECT COUNT(*) as count FROM user_books WHERE status = "borrowed" AND return_date IS NULL');
        // Overdue books (due date passed)
        const [overdueBooks] = await database_1.default.query('SELECT COUNT(*) as count FROM user_books WHERE status = "borrowed" AND due_date < CURDATE() AND return_date IS NULL');
        res.json({
            success: true,
            stats: {
                totalBooks: totalBooks[0].count,
                totalUsers: totalUsers[0].count,
                borrowedBooks: borrowedBooks[0].count,
                overdue: overdueBooks[0].count
            }
        });
    }
    catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getAllBooksAdmin = async (req, res) => {
    try {
        const [books] = await database_1.default.query('SELECT id, title, author, genre, total_copies, available_copies, price, year, description, isbn, publisher, pages, language FROM books ORDER BY id DESC');
        res.json({
            success: true,
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                genre: book.genre,
                total_copies: book.total_copies,
                available_copies: book.available_copies,
                price: book.price,
                year: book.year,
                description: book.description,
                isbn: book.isbn,
                publisher: book.publisher,
                pages: book.pages,
                language: book.language
            }))
        });
    }
    catch (error) {
        console.error('Get all books admin error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllBooksAdmin = getAllBooksAdmin;
const addBook = async (req, res) => {
    try {
        const { title, author, isbn, genre, description, cover_url, total_copies, price, year, publisher, pages, language, place_of_publish, tags } = req.body;
        const [result] = await database_1.default.query(`INSERT INTO books (title, author, isbn, genre, description, cover_url, 
             total_copies, available_copies, price, year, publisher, pages, language, place_of_publish, tags)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [title, author, isbn, genre, description, cover_url,
            total_copies, total_copies, price, year, publisher, pages, language, place_of_publish || null, tags || null]);
        res.json({
            success: true,
            message: 'Book added successfully',
            bookId: result.insertId
        });
    }
    catch (error) {
        console.error('Add book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addBook = addBook;
const updateBook = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const [result] = await database_1.default.query('UPDATE books SET ? WHERE id = ?', [updates, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Book updated successfully'
        });
    }
    catch (error) {
        console.error('Update book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateBook = updateBook;
const deleteBook = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query('DELETE FROM books WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Book deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteBook = deleteBook;
// ============ USER MANAGEMENT ============
const getAllUsers = async (req, res) => {
    try {
        const [users] = await database_1.default.query('SELECT id, full_name, email, role, profile_picture, created_at FROM users');
        res.json({
            success: true,
            users: users.map((user) => ({
                id: user.id,
                name: user.full_name,
                email: user.email,
                role: user.role,
                joined: user.created_at
            }))
        });
    }
    catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        // Don't allow deleting self
        if (parseInt(id) === req.user?.userId) {
            res.status(400).json({ success: false, message: 'Cannot delete your own account' });
            return;
        }
        const [result] = await database_1.default.query('DELETE FROM users WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteUser = deleteUser;
const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        const [result] = await database_1.default.query('UPDATE users SET role = ? WHERE id = ?', [role, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({
            success: true,
            message: 'User role updated successfully'
        });
    }
    catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateUserRole = updateUserRole;
// ============ ANALYTICS ============
const getMostBorrowedBook = async (req, res) => {
    try {
        const [books] = await database_1.default.query(`SELECT b.id, b.title, b.author, COUNT(ub.id) as borrow_count
             FROM books b
             JOIN user_books ub ON b.id = ub.book_id
             GROUP BY b.id
             ORDER BY borrow_count DESC
             LIMIT 1`);
        res.json({
            success: true,
            mostBorrowed: books[0] || null
        });
    }
    catch (error) {
        console.error('Get most borrowed book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getMostBorrowedBook = getMostBorrowedBook;
const getMostPopularGenre = async (req, res) => {
    try {
        const [genres] = await database_1.default.query(`SELECT b.genre, COUNT(ub.id) as borrow_count
             FROM books b
             JOIN user_books ub ON b.id = ub.book_id
             WHERE b.genre IS NOT NULL
             GROUP BY b.genre
             ORDER BY borrow_count DESC
             LIMIT 1`);
        res.json({
            success: true,
            popularGenre: genres[0] || null
        });
    }
    catch (error) {
        console.error('Get popular genre error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getMostPopularGenre = getMostPopularGenre;
// Update in adminController.ts
const getAllComments = async (req, res) => {
    try {
        const [comments] = await database_1.default.query(`
            SELECT c.*, u.full_name as user_name, b.title as book_title, com.name as community_name
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN books b ON c.book_id = b.id
            LEFT JOIN communities com ON c.community_id = com.id
            ORDER BY c.created_at DESC
        `);
        res.json({ success: true, comments });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching comments' });
    }
};
exports.getAllComments = getAllComments;
const deleteCommentAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.query('DELETE FROM comments WHERE id = ?', [id]);
        res.json({
            success: true,
            message: 'Comment deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteCommentAdmin = deleteCommentAdmin;
const getAllCommunitiesAdmin = async (req, res) => {
    try {
        const [communities] = await database_1.default.query(`
            SELECT c.*, u.full_name as admin_name 
            FROM communities c 
            JOIN users u ON c.admin_id = u.id
        `);
        res.json({ success: true, communities });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching communities' });
    }
};
exports.getAllCommunitiesAdmin = getAllCommunitiesAdmin;
const deleteCommunityAdmin = async (req, res) => {
    try {
        const { id } = req.params;
        await database_1.default.query('DELETE FROM communities WHERE id = ?', [id]);
        res.json({
            success: true,
            message: 'Community deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete community error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteCommunityAdmin = deleteCommunityAdmin;
// ============ GAME MANAGEMENT ============
const getAllGamesAdmin = async (req, res) => {
    try {
        const [games] = await database_1.default.query('SELECT * FROM games ORDER BY created_at DESC');
        res.json({
            success: true,
            games
        });
    }
    catch (error) {
        console.error('Get all games admin error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllGamesAdmin = getAllGamesAdmin;
const createGame = async (req, res) => {
    try {
        const { title, description, difficulty, duration, image_url } = req.body;
        const [result] = await database_1.default.query('INSERT INTO games (title, description, difficulty, duration, image_url) VALUES (?, ?, ?, ?, ?)', [title, description, difficulty, duration, image_url]);
        res.json({
            success: true,
            message: 'Game created successfully',
            gameId: result.insertId
        });
    }
    catch (error) {
        console.error('Create game error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.createGame = createGame;
const updateGame = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const [result] = await database_1.default.query('UPDATE games SET ? WHERE id = ?', [updates, id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Game not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Game updated successfully'
        });
    }
    catch (error) {
        console.error('Update game error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.updateGame = updateGame;
const deleteGame = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await database_1.default.query('DELETE FROM games WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            res.status(404).json({ success: false, message: 'Game not found' });
            return;
        }
        res.json({
            success: true,
            message: 'Game deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete game error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteGame = deleteGame;
// Add step to game
const addGameStep = async (req, res) => {
    try {
        const { gameId, level, title, step_order } = req.body;
        const [result] = await database_1.default.query('INSERT INTO game_steps (game_id, level, title, step_order) VALUES (?, ?, ?, ?)', [gameId, level, title, step_order]);
        res.json({
            success: true,
            message: 'Step added successfully',
            stepId: result.insertId
        });
    }
    catch (error) {
        console.error('Add game step error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addGameStep = addGameStep;
// Add book to step
const addStepBook = async (req, res) => {
    try {
        const { stepId, bookId, book_order } = req.body;
        await database_1.default.query('INSERT INTO step_books (step_id, book_id, book_order) VALUES (?, ?, ?)', [stepId, bookId, book_order]);
        res.json({
            success: true,
            message: 'Book added to step successfully'
        });
    }
    catch (error) {
        console.error('Add step book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addStepBook = addStepBook;
