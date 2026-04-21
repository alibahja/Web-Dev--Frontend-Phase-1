import { Request, Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middlewares/authMiddleware';

// Get all books with pagination
export const getAllBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = (page - 1) * limit;
        
        const [books]: any = await pool.query(
            `SELECT id, title, author, description, cover_url, price, rating, year, genre, available_copies
             FROM books 
             ORDER BY created_at DESC 
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        const [total]: any = await pool.query('SELECT COUNT(*) as count FROM books');
        
        res.json({
            success: true,
            books: books.map((book: any) => ({
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
    } catch (error) {
        console.error('Get all books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Basic search (title, author, genre)
export const searchBooks = async (req: Request, res: Response): Promise<void> => {
    try {
        const { q, type } = req.query;
        let query = '';
        let params: any[] = [];
        
        if (type === 'collection') {
            // Search by collection/tag
            query = `
                SELECT id, title, author, description, cover_url, price, rating, year, genre, available_copies
                FROM books 
                WHERE tags LIKE ?
                ORDER BY created_at DESC
            `;
            params = [`%${q}%`];
        } else if (type === 'genre') {
            // Search by genre
            query = `
                SELECT id, title, author, description, cover_url, price, rating, year, genre, available_copies
                FROM books 
                WHERE LOWER(genre) LIKE ?
                ORDER BY created_at DESC
            `;
            params = [`%${q}%`];
        } else {
            // Basic search (title, author, genre)
            query = `
                SELECT id, title, author, description, cover_url, price, rating, year, genre, available_copies
                FROM books 
                WHERE LOWER(title) LIKE ? 
                   OR LOWER(author) LIKE ? 
                   OR LOWER(genre) LIKE ?
                ORDER BY 
                    CASE 
                        WHEN LOWER(title) LIKE ? THEN 1
                        WHEN LOWER(author) LIKE ? THEN 2
                        ELSE 3
                    END
                LIMIT 50
            `;
            const searchTerm = `%${q}%`;
            params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
        }
        
        const [books]: any = await pool.query(query, params);
        
        res.json({
            success: true,
            books: books.map((book: any) => ({
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
            }))
        });
    } catch (error) {
        console.error('Search books error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Advanced search with multiple filters
export const advancedSearch = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            title,
            author,
            genre,
            isbn,
            placeOfPublishing,
            minPages,
            maxPages,
            minYear,
            maxYear,
            language,
            publisher
        } = req.query;
        
        let query = `
            SELECT id, title, author, description, cover_url, price, rating, 
                   year, genre, pages, isbn, publisher, language, place_of_publish, available_copies
            FROM books 
            WHERE 1=1
        `;
        let params: any[] = [];
        
        if (title) {
            query += ` AND LOWER(title) LIKE ?`;
            params.push(`%${title}%`);
        }
        
        if (author) {
            query += ` AND LOWER(author) LIKE ?`;
            params.push(`%${author}%`);
        }
        
        if (genre && genre !== 'All Genres') {
            query += ` AND LOWER(genre) = ?`;
            params.push(String(genre).toLowerCase());
        }
        
        if (isbn) {
            query += ` AND isbn LIKE ?`;
            params.push(`%${isbn}%`);
        }
        
        if (placeOfPublishing) {
            query += ` AND LOWER(place_of_publish) LIKE ?`;
            params.push(`%${placeOfPublishing}%`);
        }
        
        if (minPages) {
            query += ` AND pages >= ?`;
            params.push(parseInt(minPages as string));
        }
        
        if (maxPages) {
            query += ` AND pages <= ?`;
            params.push(parseInt(maxPages as string));
        }
        
        if (minYear) {
            query += ` AND year >= ?`;
            params.push(parseInt(minYear as string));
        }
        
        if (maxYear) {
            query += ` AND year <= ?`;
            params.push(parseInt(maxYear as string));
        }
        
        if (language) {
            query += ` AND LOWER(language) = ?`;
            params.push(String(language).toLowerCase());
        }
        
        if (publisher) {
            query += ` AND LOWER(publisher) LIKE ?`;
            params.push(`%${publisher}%`);
        }
        
        query += ` ORDER BY title LIMIT 100`;
        
        const [books]: any = await pool.query(query, params);
        
        res.json({
            success: true,
            count: books.length,
            books: books.map((book: any) => ({
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
    } catch (error) {
        console.error('Advanced search error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get single book details
export const getBookDetails = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        
        const [books]: any = await pool.query(
            `SELECT b.*, 
                    (SELECT AVG(rating) FROM user_books WHERE book_id = b.id AND rating IS NOT NULL) as avg_rating,
                    (SELECT COUNT(*) FROM user_books WHERE book_id = b.id AND status = 'borrowed') as borrowed_count
             FROM books b
             WHERE b.id = ?`,
            [id]
        );
        
        if (books.length === 0) {
            res.status(404).json({ success: false, message: 'Book not found' });
            return;
        }
        
        const book = books[0];
        
        // Get more books by same author
        const [moreByAuthor]: any = await pool.query(
            `SELECT id, title, year, cover_url 
             FROM books 
             WHERE author = ? AND id != ? 
             LIMIT 4`,
            [book.author, id]
        );
        
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
            moreBooks: moreByAuthor.map((b: any) => ({
                id: b.id,
                title: b.title,
                year: b.year,
                coverUrl: b.cover_url
            }))
        });
    } catch (error) {
        console.error('Get book details error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get books by collection (best-sellers, popular-books, new-releases)
export const getBooksByCollection = async (req: Request, res: Response): Promise<void> => {
    try {
        const { collection } = req.params;
        let query = '';
        let limit = 10;
        
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
        
        const [books]: any = await pool.query(query, [limit]);
        
        res.json({
            success: true,
            collection,
            books: books.map((book: any) => ({
                id: book.id,
                title: book.title,
                author: book.author,
                coverUrl: book.cover_url,
                price: book.price,
                rating: book.rating,
                year: book.year
            }))
        });
    } catch (error) {
        console.error('Get books by collection error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get books by genre
export const getBooksByGenre = async (req: Request, res: Response): Promise<void> => {
    try {
        const { genre } = req.params;
        const limit = parseInt(req.query.limit as string) || 20;
        
        const [books]: any = await pool.query(
            `SELECT id, title, author, cover_url, price, rating, year, description
             FROM books 
             WHERE LOWER(genre) = LOWER(?)
             ORDER BY rating DESC
             LIMIT ?`,
            [genre, limit]
        );
        
        res.json({
            success: true,
            genre,
            count: books.length,
            books: books.map((book: any) => ({
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
    } catch (error) {
        console.error('Get books by genre error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get random book
export const getRandomBook = async (req: Request, res: Response): Promise<void> => {
    try {
        const [books]: any = await pool.query(
            `SELECT id, title, author, description, cover_url, price, rating, year, genre, pages, isbn
             FROM books 
             ORDER BY RAND() 
             LIMIT 1`
        );
        
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
    } catch (error) {
        console.error('Get random book error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// Get all distinct genres
export const getGenres = async (req: Request, res: Response): Promise<void> => {
    try {
        const [genres]: any = await pool.query(
            'SELECT DISTINCT genre FROM books WHERE genre IS NOT NULL ORDER BY genre'
        );
        
        res.json({
            success: true,
            genres: genres.map((g: any) => g.genre)
        });
    } catch (error) {
        console.error('Get genres error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
// Get public stats for homepage (no authentication required)
export const getPublicStats = async (req: Request, res: Response): Promise<void> => {
    try {
        // Get total books count
        const [totalBooks]: any = await pool.query('SELECT COUNT(*) as count FROM books');
        
        // Get total users count (excluding admins if you want)
        const [totalUsers]: any = await pool.query('SELECT COUNT(*) as count FROM users WHERE role != "admin"');
        
        // Get currently borrowed books count
        const [borrowedBooks]: any = await pool.query(
            'SELECT COUNT(*) as count FROM user_books WHERE status = "borrowed" AND return_date IS NULL'
        );
        
        res.json({
            success: true,
            stats: {
                totalBooks: totalBooks[0].count,
                totalUsers: totalUsers[0].count,
                borrowedBooks: borrowedBooks[0].count
            }
        });
    } catch (error) {
        console.error('Get public stats error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};