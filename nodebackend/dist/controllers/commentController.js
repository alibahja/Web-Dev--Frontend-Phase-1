"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllComments = exports.deleteComment = exports.addReply = exports.addCommunityComment = exports.addBookComment = exports.getCommunityComments = exports.getBookComments = void 0;
const database_1 = __importDefault(require("../config/database"));
// Get comments for a book
const getBookComments = async (req, res) => {
    try {
        const { bookId } = req.params;
        const [comments] = await database_1.default.query(`SELECT c.*, u.full_name as author_name,
                    (SELECT COUNT(*) FROM comments WHERE parent_comment_id = c.id) as reply_count
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.book_id = ? AND c.parent_comment_id IS NULL
             ORDER BY c.created_at DESC`, [bookId]);
        // Get replies for each comment
        for (const comment of comments) {
            const [replies] = await database_1.default.query(`SELECT c.*, u.full_name as author_name
                 FROM comments c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.parent_comment_id = ?
                 ORDER BY c.created_at ASC`, [comment.id]);
            comment.replies = replies;
        }
        res.json({
            success: true,
            comments: comments.map((c) => ({
                id: c.id,
                author: c.author_name,
                text: c.content,
                replies: c.replies.map((r) => ({
                    id: r.id,
                    author: r.author_name,
                    text: r.content
                }))
            }))
        });
    }
    catch (error) {
        console.error('Get book comments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getBookComments = getBookComments;
// Get comments for a community
const getCommunityComments = async (req, res) => {
    try {
        const { communityId } = req.params;
        const [comments] = await database_1.default.query(`SELECT c.*, u.full_name as author_name,
                    (SELECT COUNT(*) FROM comments WHERE parent_comment_id = c.id) as reply_count
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.community_id = ? AND c.parent_comment_id IS NULL
             ORDER BY c.created_at DESC`, [communityId]);
        // Get replies for each comment
        for (const comment of comments) {
            const [replies] = await database_1.default.query(`SELECT c.*, u.full_name as author_name
                 FROM comments c
                 JOIN users u ON c.user_id = u.id
                 WHERE c.parent_comment_id = ?
                 ORDER BY c.created_at ASC`, [comment.id]);
            comment.replies = replies;
        }
        res.json({
            success: true,
            comments: comments.map((c) => ({
                id: c.id,
                author: c.author_name,
                text: c.content,
                replies: c.replies.map((r) => ({
                    id: r.id,
                    author: r.author_name,
                    text: r.content
                }))
            }))
        });
    }
    catch (error) {
        console.error('Get community comments error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.getCommunityComments = getCommunityComments;
// Add comment to book
const addBookComment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { bookId } = req.params;
        const { content } = req.body;
        if (!content || content.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            return;
        }
        const [result] = await database_1.default.query('INSERT INTO comments (user_id, book_id, content) VALUES (?, ?, ?)', [userId, bookId, content]);
        // Get the created comment with author name
        const [newComment] = await database_1.default.query(`SELECT c.*, u.full_name as author_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = ?`, [result.insertId]);
        res.json({
            success: true,
            message: 'Comment added successfully',
            comment: {
                id: newComment[0].id,
                author: newComment[0].author_name,
                text: newComment[0].content,
                replies: []
            }
        });
    }
    catch (error) {
        console.error('Add book comment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addBookComment = addBookComment;
// Add comment to community
const addCommunityComment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { communityId } = req.params;
        const { content } = req.body;
        // Check if user is a member of the community
        const [isMember] = await database_1.default.query('SELECT id FROM community_members WHERE community_id = ? AND user_id = ?', [communityId, userId]);
        if (isMember.length === 0) {
            res.status(403).json({ success: false, message: 'Must be a member to comment' });
            return;
        }
        if (!content || content.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Comment cannot be empty' });
            return;
        }
        const [result] = await database_1.default.query('INSERT INTO comments (user_id, community_id, content) VALUES (?, ?, ?)', [userId, communityId, content]);
        // Get the created comment with author name
        const [newComment] = await database_1.default.query(`SELECT c.*, u.full_name as author_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = ?`, [result.insertId]);
        res.json({
            success: true,
            message: 'Comment added successfully',
            comment: {
                id: newComment[0].id,
                author: newComment[0].author_name,
                text: newComment[0].content,
                replies: []
            }
        });
    }
    catch (error) {
        console.error('Add community comment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addCommunityComment = addCommunityComment;
// Add reply to a comment
const addReply = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { commentId } = req.params;
        const { content } = req.body;
        // Get parent comment to know if it's for book or community
        const [parentComment] = await database_1.default.query('SELECT book_id, community_id FROM comments WHERE id = ?', [commentId]);
        if (parentComment.length === 0) {
            res.status(404).json({ success: false, message: 'Parent comment not found' });
            return;
        }
        if (!content || content.trim().length === 0) {
            res.status(400).json({ success: false, message: 'Reply cannot be empty' });
            return;
        }
        const insertData = {
            user_id: userId,
            parent_comment_id: commentId,
            content: content
        };
        if (parentComment[0].book_id) {
            insertData.book_id = parentComment[0].book_id;
        }
        else {
            insertData.community_id = parentComment[0].community_id;
        }
        const [result] = await database_1.default.query('INSERT INTO comments SET ?', [insertData]);
        // Get the created reply with author name
        const [newReply] = await database_1.default.query(`SELECT c.*, u.full_name as author_name
             FROM comments c
             JOIN users u ON c.user_id = u.id
             WHERE c.id = ?`, [result.insertId]);
        res.json({
            success: true,
            message: 'Reply added successfully',
            reply: {
                id: newReply[0].id,
                author: newReply[0].author_name,
                text: newReply[0].content
            }
        });
    }
    catch (error) {
        console.error('Add reply error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.addReply = addReply;
// Delete comment (only by author or admin)
const deleteComment = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const userRole = req.user?.role;
        const { commentId } = req.params;
        // Check if comment exists and get author
        const [comment] = await database_1.default.query('SELECT user_id FROM comments WHERE id = ?', [commentId]);
        if (comment.length === 0) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }
        // Allow if user is author or admin
        if (comment[0].user_id !== userId && userRole !== 'admin') {
            res.status(403).json({ success: false, message: 'Unauthorized to delete this comment' });
            return;
        }
        // Delete comment (cascade will delete replies)
        await database_1.default.query('DELETE FROM comments WHERE id = ?', [commentId]);
        res.json({ success: true, message: 'Comment deleted successfully' });
    }
    catch (error) {
        console.error('Delete comment error:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
exports.deleteComment = deleteComment;
const getAllComments = async (req, res) => {
    try {
        const [comments] = await database_1.default.query(`
            SELECT c.*, 
                   u.full_name as user_name,
                   b.title as book_title,
                   com.name as community_name,
                   CASE 
                       WHEN c.book_id IS NOT NULL THEN CONCAT('Book: ', b.title)
                       WHEN c.community_id IS NOT NULL THEN CONCAT('Community: ', com.name)
                       ELSE 'Unknown'
                   END as target
            FROM comments c
            JOIN users u ON c.user_id = u.id
            LEFT JOIN books b ON c.book_id = b.id
            LEFT JOIN communities com ON c.community_id = com.id
            ORDER BY c.created_at DESC
        `);
        res.json({ success: true, comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error fetching comments' });
    }
};
exports.getAllComments = getAllComments;
