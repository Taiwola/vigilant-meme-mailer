import { findOne } from "../services";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface Decoded {
    id: string;
    email: string;
}

export const authentication = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
             res.status(401).json({ success: false, message: 'Not authorized, no token' });
             return
        }

        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET_KEY;

        if (!secretKey) {
            console.error('JWT_SECRET_KEY is not defined');
            res.status(500).json({ success: false, message: 'Server error' });
            return
        }

        try {
            const decode = jwt.verify(token, secretKey) as JwtPayload;
            const user = await findOne(decode.id);

            if (!user) {
                res.status(401).json({ success: false, message: 'Token not authorized' });
                return
            }

            req.user = {
                id: user._id.toString(),
                email: user.email,
            };

            next(); // Proceed to the next middleware or route handler
        } catch (error) {
            console.error('Token error:', error);
            res.status(401).json({ success: false, message: 'Invalid token' });
            return
        }
    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

