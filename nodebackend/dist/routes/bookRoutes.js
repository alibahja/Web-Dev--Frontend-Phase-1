"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bookController_1 = require("../controllers/bookController");
const router = express_1.default.Router();
/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get all books with pagination
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of books with pagination
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 books:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       description:
 *                         type: string
 *                       coverUrl:
 *                         type: string
 *                       price:
 *                         type: number
 *                       rating:
 *                         type: number
 *                       year:
 *                         type: integer
 *                       genre:
 *                         type: string
 *                       copiesleft:
 *                         type: integer
 *                 pagination:
 *                   type: object
 *       500:
 *         description: Server error
 */
router.get('/', bookController_1.getAllBooks);
/**
 * @swagger
 * /books/search:
 *   get:
 *     summary: Search books by title, author, genre, or collection
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [collection, genre]
 *         description: Search type (collection or genre)
 *     responses:
 *       200:
 *         description: Search results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 books:
 *                   type: array
 *       500:
 *         description: Server error
 */
router.get('/search', bookController_1.searchBooks);
/**
 * @swagger
 * /books/advanced-search:
 *   get:
 *     summary: Advanced search with multiple filters
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: isbn
 *         schema:
 *           type: string
 *       - in: query
 *         name: placeOfPublishing
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPages
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxPages
 *         schema:
 *           type: integer
 *       - in: query
 *         name: minYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxYear
 *         schema:
 *           type: integer
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: publisher
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Advanced search results
 *       500:
 *         description: Server error
 */
router.get('/advanced-search', bookController_1.advancedSearch);
/**
 * @swagger
 * /books/random:
 *   get:
 *     summary: Get a random book
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Random book retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 book:
 *                   type: object
 *       404:
 *         description: No books found
 *       500:
 *         description: Server error
 */
router.get('/random', bookController_1.getRandomBook);
/**
 * @swagger
 * /books/genres:
 *   get:
 *     summary: Get all distinct genres
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: List of genres
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 genres:
 *                   type: array
 *                   items:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/genres', bookController_1.getGenres);
/**
 * @swagger
 * /books/collection/{collection}:
 *   get:
 *     summary: Get books by collection (best-sellers, popular-books, new-releases)
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: collection
 *         required: true
 *         schema:
 *           type: string
 *           enum: [best-sellers, popular-books, new-releases]
 *     responses:
 *       200:
 *         description: Books in collection
 *       500:
 *         description: Server error
 */
router.get('/collection/:collection', bookController_1.getBooksByCollection);
/**
 * @swagger
 * /books/genre/{genre}:
 *   get:
 *     summary: Get books by genre
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: genre
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of books to return
 *     responses:
 *       200:
 *         description: Books in genre
 *       500:
 *         description: Server error
 */
router.get('/genre/:genre', bookController_1.getBooksByGenre);
/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Book details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 book:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     title:
 *                       type: string
 *                     author:
 *                       type: string
 *                     description:
 *                       type: string
 *                     coverUrl:
 *                       type: string
 *                     rating:
 *                       type: number
 *                     copiesleft:
 *                       type: integer
 *                     publisher:
 *                       type: string
 *                     placeOfPublish:
 *                       type: string
 *                     language:
 *                       type: string
 *                     ISBN:
 *                       type: string
 *                     genre:
 *                       type: string
 *                     type:
 *                       type: string
 *                     pages:
 *                       type: integer
 *                     publicationDate:
 *                       type: string
 *                     year:
 *                       type: integer
 *                 moreBooks:
 *                   type: array
 *       404:
 *         description: Book not found
 *       500:
 *         description: Server error
 */
router.get('/:id', bookController_1.getBookDetails);
/**
 * @swagger
 * /books/stats/public:
 *   get:
 *     summary: Get public statistics for homepage
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: Public statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 stats:
 *                   type: object
 *                   properties:
 *                     totalBooks:
 *                       type: integer
 *                     totalUsers:
 *                       type: integer
 *                     borrowedBooks:
 *                       type: integer
 *       500:
 *         description: Server error
 */
router.get('/stats/public', bookController_1.getPublicStats);
exports.default = router;
