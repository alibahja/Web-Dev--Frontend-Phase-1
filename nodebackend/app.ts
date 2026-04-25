

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './src/routes/authRoutes';
import profileRoutes from './src/routes/profileRoutes';
import gameRoutes from './src/routes/gameRoutes';
import communityRoutes from './src/routes/communityRoutes';
import commentRoutes from './src/routes/commentRoutes';
import bookRoutes from './src/routes/bookRoutes';
import adminRoutes from './src/routes/adminRoutes';
import emailRoutes from './src/routes/emailRoutes';
import pool, { initializeDatabase } from './src/config/database';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('pool', pool);
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/communities', communityRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/email', emailRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

app.get('/test-uploads', (req, res) => {
    res.json({ message: 'Uploads folder path: ' + path.join(process.cwd(), 'uploads') });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Something went wrong!' 
    });
});

// Initialize database and start server
const startServer = async () => {
    try {
        await initializeDatabase();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 BiblioTech API is ready`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();

export default app;
