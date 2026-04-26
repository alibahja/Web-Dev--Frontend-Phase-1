"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDatabase = exports.createPool = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createPool = () => {
    return promise_1.default.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'bibliotech',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
};
exports.createPool = createPool;
const pool = (0, exports.createPool)();
const initializeDatabase = async () => {
    const sql = `
        CREATE TABLE IF NOT EXISTS users (
            id INT PRIMARY KEY AUTO_INCREMENT,
            full_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            role ENUM('student', 'librarian', 'admin') DEFAULT 'student',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        ALTER TABLE users ADD COLUMN profile_picture TEXT NULL;
        
        CREATE TABLE IF NOT EXISTS books (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            author VARCHAR(255) NOT NULL,
            isbn VARCHAR(50),
            genre VARCHAR(100),
            description TEXT,
            cover_url TEXT,
            total_copies INT DEFAULT 1,
            available_copies INT DEFAULT 1,
            price DECIMAL(10,2) DEFAULT 0,
            rating DECIMAL(3,2) DEFAULT 0,
            year INT,
            publisher VARCHAR(255),
            pages INT,
            language VARCHAR(50),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        ALTER TABLE books ADD COLUMN tags VARCHAR(255) NULL;
        
        CREATE TABLE IF NOT EXISTS user_books (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NOT NULL,
            status ENUM('borrowed', 'reading', 'completed', 'wishlist', 'favorite', 'purchased') NOT NULL,
            borrow_date DATE,
            due_date DATE,
            return_date DATE,
            rating INT CHECK (rating >= 1 AND rating <= 5),
            purchase_date DATE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_book_status (user_id, book_id, status)
        );
        
        CREATE TABLE IF NOT EXISTS reading_stats (
            user_id INT PRIMARY KEY,
            books_read_total INT DEFAULT 0,
            pages_read_total INT DEFAULT 0,
            favorite_genre VARCHAR(100),
            monthly_books_read INT DEFAULT 0,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        -- GAMES / ROADMAPS TABLES
        CREATE TABLE IF NOT EXISTS games (
            id INT PRIMARY KEY AUTO_INCREMENT,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            difficulty ENUM('Beginner', 'Intermediate', 'Advanced') DEFAULT 'Beginner',
            duration VARCHAR(100),
            image_url TEXT,
            members_count INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        );
        
        CREATE TABLE IF NOT EXISTS game_steps (
            id INT PRIMARY KEY AUTO_INCREMENT,
            game_id INT NOT NULL,
            level VARCHAR(100) NOT NULL,
            title VARCHAR(255) NOT NULL,
            step_order INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            UNIQUE KEY unique_game_step_order (game_id, step_order)
        );
        
        CREATE TABLE IF NOT EXISTS step_books (
            id INT PRIMARY KEY AUTO_INCREMENT,
            step_id INT NOT NULL,
            book_id INT NOT NULL,
            book_order INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (step_id) REFERENCES game_steps(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            UNIQUE KEY unique_step_book_order (step_id, book_order)
        );
        
        CREATE TABLE IF NOT EXISTS user_game_progress (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            game_id INT NOT NULL,
            current_step_id INT,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            completed_at TIMESTAMP NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (current_step_id) REFERENCES game_steps(id) ON DELETE SET NULL,
            UNIQUE KEY unique_user_game (user_id, game_id)
        );
        
        CREATE TABLE IF NOT EXISTS user_completed_steps (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            game_id INT NOT NULL,
            step_id INT NOT NULL,
            completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
            FOREIGN KEY (step_id) REFERENCES game_steps(id) ON DELETE CASCADE,
            UNIQUE KEY unique_user_completed_step (user_id, game_id, step_id)
        );
        
        -- COMMUNITIES TABLES
        CREATE TABLE IF NOT EXISTS communities (
            id INT PRIMARY KEY AUTO_INCREMENT,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            category VARCHAR(100),
            admin_id INT NOT NULL,
            members_count INT DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
        );
        
        CREATE TABLE IF NOT EXISTS community_members (
            id INT PRIMARY KEY AUTO_INCREMENT,
            community_id INT NOT NULL,
            user_id INT NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            UNIQUE KEY unique_community_member (community_id, user_id)
        );
        
        -- COMMENTS TABLE (for both books and communities)
        CREATE TABLE IF NOT EXISTS comments (
            id INT PRIMARY KEY AUTO_INCREMENT,
            user_id INT NOT NULL,
            book_id INT NULL,
            community_id INT NULL,
            parent_comment_id INT NULL,
            content TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
            FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
            FOREIGN KEY (community_id) REFERENCES communities(id) ON DELETE CASCADE,
            FOREIGN KEY (parent_comment_id) REFERENCES comments(id) ON DELETE CASCADE,
            CHECK (
                (book_id IS NOT NULL AND community_id IS NULL) OR
                (book_id IS NULL AND community_id IS NOT NULL)
            )
        );
        
        CREATE INDEX idx_comments_book ON comments(book_id);
        CREATE INDEX idx_comments_community ON comments(community_id);
        CREATE INDEX idx_comments_parent ON comments(parent_comment_id);
        CREATE INDEX idx_comments_user ON comments(user_id);
        CREATE INDEX idx_communities_name ON communities(name);
        CREATE INDEX idx_community_members_community ON community_members(community_id);
        CREATE INDEX idx_community_members_user ON community_members(user_id);
        CREATE INDEX idx_books_title_search ON books(title(50));
        CREATE INDEX idx_books_author_search ON books(author(50));
        CREATE INDEX idx_books_genre_search ON books(genre);
        CREATE INDEX idx_books_isbn ON books(isbn);
        CREATE INDEX idx_books_pages ON books(pages);
        CREATE INDEX idx_books_place ON books(place_of_publish);
        CREATE INDEX idx_books_year ON books(year);
    `;
    try {
        const statements = sql.split(';').filter(stmt => stmt.trim());
        for (const statement of statements) {
            if (statement.trim()) {
                try {
                    await pool.query(statement);
                }
                catch (error) {
                    if (!error.message?.includes('Duplicate key name')) {
                        console.error('SQL Error:', error.message);
                    }
                }
            }
        }
        console.log('✅ Database initialized successfully');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error);
        throw error;
    }
};
exports.initializeDatabase = initializeDatabase;
exports.default = pool;
