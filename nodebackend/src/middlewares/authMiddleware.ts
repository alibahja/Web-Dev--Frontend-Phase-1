import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt';

export interface AuthRequest extends Request {
    user?: {
        userId: number;
        email: string;
        role: string;
    };
}

export const authenticateToken = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ success: false, message: 'Access token required' });
        return;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        res.status(403).json({ success: false, message: 'Invalid or expired token' });
        return;
    }

    req.user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role
    };
    
    next();
};

export const authorizeRole = (...allowedRoles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ 
                success: false, 
                message: 'Insufficient permissions' 
            });
            return;
        }

        next();
    };
};