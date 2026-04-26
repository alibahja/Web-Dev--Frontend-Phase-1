"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicStats = exports.getGenres = exports.getRandomBook = exports.getBooksByGenre = exports.getBooksByCollection = exports.getBookDetails = exports.advancedSearch = exports.searchBooks = exports.getAllBooks = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get all books with pagination
const getAllBooks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        const [books] = await database_1.default.query(`SELECT id, title, author, description, cover_url, price, rating, year, genre, available_copies
             FROM books 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`, [limit, offset]);
        const [total] = await database_1.default.query('SELECT COUNT(*) as count FROM books');
        res.json({
            success: true,
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year,
                genre: book.genre,
                copiesleft: book.available_copies
            })),
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total[0].count / limit),
                totalBooks: total[0].count
            }
        });
    }
    catch (error) {
        console.error('Get all books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getAllBooks = getAllBooks;
// Basic search (title, author, genre)
// Basic search (title, author, genre)
const searchBooks = async (req, res) => {
    try {
        const { q, type } = req.query;
        // 1. Ensure page and limit are actual numbers for SQL
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.max(1, parseInt(req.query.limit) || 12);
        const offset = (page - 1) * limit;
        let query = '';
        let countQuery = '';
        let params = [];
        let countParams = [];
        const searchTerm = `%${String(q || "").toLowerCase()}%`;
        if (type === 'collection') {
            query = `SELECT id, title, author, description, cover_url as coverUrl, price, rating, year, genre, available_copies as copiesleft
                     FROM books WHERE tags LIKE ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`;
            params = [searchTerm, limit, offset];
            countQuery = `SELECT COUNT(*) as count FROM books WHERE tags LIKE ?`;
            countParams = [searchTerm];
        }
        else if (type === 'genre') {
            query = `SELECT id, title, author, description, cover_url as coverUrl, price, rating, year, genre, available_copies as copiesleft
                     FROM books WHERE LOWER(genre) LIKE ? ORDER BY created_at DESC, id DESC LIMIT ? OFFSET ?`;
            params = [searchTerm, limit, offset];
            countQuery = `SELECT COUNT(*) as count FROM books WHERE LOWER(genre) LIKE ?`;
            countParams = [searchTerm];
        }
        else {
            // Standard Search
            query = `SELECT id, title, author, description, cover_url as coverUrl, price, rating, year, genre, available_copies as copiesleft
                     FROM books 
                     WHERE LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?
                     ORDER BY CASE 
                        WHEN LOWER(title) LIKE ? THEN 1 
                        WHEN LOWER(author) LIKE ? THEN 2 
                        ELSE 3 END
                     LIMIT ? OFFSET ?`;
            params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, limit, offset];
            countQuery = `SELECT COUNT(*) as count FROM books WHERE LOWER(title) LIKE ? OR LOWER(author) LIKE ? OR LOWER(genre) LIKE ?`;
            countParams = [searchTerm, searchTerm, searchTerm];
        }
        const [books] = await database_1.default.query(query, params);
        const [total] = await database_1.default.query(countQuery, countParams);
        console.log(`Executing Query: LIMIT ${limit} OFFSET ${offset} for term: ${q}`);
        res.json({
            success: true,
            books: books, // Using alias in SQL to match frontend expectations
            total: total[0].count,
            page: page,
            limit: limit
        });
    }
    catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.searchBooks = searchBooks;
// Advanced search with multiple filters
// Advanced search with multiple filters
const advancedSearch = async (req, res) => {
    try {
        const { title, author, genre, isbn, placeOfPublishing, minPages, maxPages, minYear, maxYear, language, publisher } = req.query;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const offset = (page - 1) * limit;
        let query = `
            SELECT id, title, author, description, cover_url, price, rating, 
                   year, genre, pages, isbn, publisher, language, place_of_publish, available_copies
            FROM books 
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) as count FROM books WHERE 1=1`;
        let params = [];
        let countParams = [];
        if (title) {
            query += ` AND LOWER(title) LIKE ?`;
            params.push(`%${title}%`);
            countQuery += ` AND LOWER(title) LIKE ?`;
            countParams.push(`%${title}%`);
        }
        if (author) {
            query += ` AND LOWER(author) LIKE ?`;
            params.push(`%${author}%`);
            countQuery += ` AND LOWER(author) LIKE ?`;
            countParams.push(`%${author}%`);
        }
        if (genre && genre !== 'All Genres') {
            query += ` AND LOWER(genre) = ?`;
            params.push(String(genre).toLowerCase());
            countQuery += ` AND LOWER(genre) = ?`;
            countParams.push(String(genre).toLowerCase());
        }
        if (isbn) {
            query += ` AND isbn LIKE ?`;
            params.push(`%${isbn}%`);
            countQuery += ` AND isbn LIKE ?`;
            countParams.push(`%${isbn}%`);
        }
        if (placeOfPublishing) {
            query += ` AND LOWER(place_of_publish) LIKE ?`;
            params.push(`%${placeOfPublishing}%`);
            countQuery += ` AND LOWER(place_of_publish) LIKE ?`;
            countParams.push(`%${placeOfPublishing}%`);
        }
        if (minPages) {
            query += ` AND pages >= ?`;
            params.push(parseInt(minPages));
            countQuery += ` AND pages >= ?`;
            countParams.push(parseInt(minPages));
        }
        if (maxPages) {
            query += ` AND pages <= ?`;
            params.push(parseInt(maxPages));
            countQuery += ` AND pages <= ?`;
            countParams.push(parseInt(maxPages));
        }
        if (minYear) {
            query += ` AND year >= ?`;
            params.push(parseInt(minYear));
            countQuery += ` AND year >= ?`;
            countParams.push(parseInt(minYear));
        }
        if (maxYear) {
            query += ` AND year <= ?`;
            params.push(parseInt(maxYear));
            countQuery += ` AND year <= ?`;
            countParams.push(parseInt(maxYear));
        }
        if (language) {
            query += ` AND LOWER(language) = ?`;
            params.push(String(language).toLowerCase());
            countQuery += ` AND LOWER(language) = ?`;
            countParams.push(String(language).toLowerCase());
        }
        if (publisher) {
            query += ` AND LOWER(publisher) LIKE ?`;
            params.push(`%${publisher}%`);
            countQuery += ` AND LOWER(publisher) LIKE ?`;
            countParams.push(`%${publisher}%`);
        }
        query += ` ORDER BY title, id LIMIT ? OFFSET ?`;
        params.push(limit, offset);
        const [books] = await database_1.default.query(query, params);
        const [total] = await database_1.default.query(countQuery, countParams);
        res.json({
            success: true,
            count: books.length,
            total: total[0].count,
            page: page,
            limit: limit,
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year,
                genre: book.genre,
                pages: book.pages,
                isbn: book.isbn,
                publisher: book.publisher,
                language: book.language,
                placeOfPublish: book.place_of_publish,
                copiesleft: book.available_copies
            }))
        });
    }
    catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.advancedSearch = advancedSearch;
// Get single book details
const getBookDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const [books] = await database_1.default.query(`SELECT b.*, 
                    (SELECT AVG(rating) FROM user_books WHERE book_id = b.id AND rating IS NOT NULL) as avg_rating,
                    (SELECT COUNT(*) FROM user_books WHERE book_id = b.id AND status = 'borrowed') as borrowed_count
             FROM books b
             WHERE b.id = ?`, [id]);
        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }
        const book = books[0];
        // Get more books by same author
        const [moreByAuthor] = await database_1.default.query(`SELECT id, title, year, cover_url 
             FROM books 
             WHERE author = ? AND id != ? 
             LIMIT 4`, [book.author, id]);
        res.json({
            success: true,
            book: {
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                coverUrl: book.cover_url,
                rating: book.avg_rating || book.rating || 0,
                copiesleft: book.available_copies,
                publisher: book.publisher,
                placeOfPublish: book.place_of_publish,
                language: book.language,
                ISBN: book.isbn,
                genre: book.genre,
                type: book.type || 'Paperback',
                pages: book.pages,
                publicationDate: book.publication_date || `${book.year}`,
                year: book.year
            },
            moreBooks: moreByAuthor.map((b) => ({
                id: b.id,
                title: b.title,
                year: b.year,
                coverUrl: b.cover_url
            }))
        });
    }
    catch (error) {
        console.error('Get book details error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBookDetails = getBookDetails;
// Get books by collection (best-sellers, popular-books, new-releases)
const getBooksByCollection = async (req, res) => {
    try {
        const { collection } = req.params;
        let query = '';
        let limit = 12;
        switch (collection) {
            case 'best-sellers':
                query = `
                    SELECT id, title, author, cover_url, price, rating, year
                    FROM books 
                    WHERE tags LIKE '%best-seller%' OR rating >= 4.7
                    ORDER BY rating DESC
                    LIMIT ?
                `;
                break;
            case 'popular-books':
                query = `
                    SELECT b.id, b.title, b.author, b.cover_url, b.price, b.rating, b.year
                    FROM books b
                    LEFT JOIN user_books ub ON b.id = ub.book_id
                    WHERE b.tags LIKE '%popular%' OR ub.id IS NOT NULL
                    GROUP BY b.id
                    ORDER BY COUNT(ub.id) DESC, b.rating DESC
                    LIMIT ?
                `;
                break;
            case 'new-releases':
                query = `
                    SELECT id, title, author, cover_url, price, rating, year
                    FROM books 
                    WHERE tags LIKE '%new-release%' OR year >= YEAR(CURDATE()) - 2
                    ORDER BY year DESC, created_at DESC
                    LIMIT ?
                `;
                break;
            default:
                query = `
                    SELECT id, title, author, cover_url, price, rating, year
                    FROM books 
                    ORDER BY created_at DESC
                    LIMIT ?
                `;
        }
        const [books] = await database_1.default.query(query, [limit]);
        res.json({
            success: true,
            collection,
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year
            }))
        });
    }
    catch (error) {
        console.error('Get books by collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBooksByCollection = getBooksByCollection;
// Get books by genre
const getBooksByGenre = async (req, res) => {
    try {
        const { genre } = req.params;
        const limit = parseInt(req.query.limit) || 12;
        const [books] = await database_1.default.query(`SELECT id, title, author, cover_url, price, rating, year, description
             FROM books 
             WHERE LOWER(genre) = LOWER(?)
             ORDER BY rating DESC
             LIMIT ?`, [genre, limit]);
        res.json({
            success: true,
            genre,
            count: books.length,
            books: books.map((book) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year,
                description: book.description
            }))
        });
    }
    catch (error) {
        console.error('Get books by genre error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBooksByGenre = getBooksByGenre;
// Get random book
const getRandomBook = async (req, res) => {
    try {
        const [books] = await database_1.default.query(`SELECT id, title, author, description, cover_url, price, rating, year, genre, pages, isbn
             FROM books 
             ORDER BY RAND() 
             LIMIT 1`);
        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'No books found' });
            return;
        }
        const book = books[0];
        res.json({
            success: true,
            book: {
                id: book.id,
                title: book.title,
                author: book.author,
                description: book.description,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year,
                genre: book.genre,
                pages: book.pages,
                isbn: book.isbn
            }
        });
    }
    catch (error) {
        console.error('Get random book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getRandomBook = getRandomBook;
// Get all distinct genres
const getGenres = async (req, res) => {
    try {
        const [genres] = await database_1.default.query('SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre');
        res.json({
            success: true,
            genres: genres.map((g) => g.genre)
        });
    }
    catch (error) {
        console.error('Get genres error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getGenres = getGenres;
// Get public stats for homepage (no authentication required)
const getPublicStats = async (req, res) => {
    try {
        // Get total books count
        const [totalBooks] = await database_1.default.query('SELECT COUNT(*) as count FROM books');
        // Get total users count (excluding admins if you want)
        const [totalUsers] = await database_1.default.query('SELECT COUNT(*) as count FROM users WHERE role != "admin"');
        // Get currently borrowed books count
        const [borrowedBooks] = await database_1.default.query('SELECT COUNT(*) as count FROM user_books WHERE status = "borrowed" AND return_date IS NULL');
        res.json({
            success: true,
            stats: {
                totalBooks: totalBooks[0].count,
                totalUsers: totalUsers[0].count,
                borrowedBooks: borrowedBooks[0].count
            }
        });
    }
    catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getPublicStats = getPublicStats;
