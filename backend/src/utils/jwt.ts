import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, VerifyErrors, JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH || '', 'utf8');
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH || '', 'utf8');

interface User {
    id: number;
    role: number;
    email: string;
}

interface AuthenticatedRequest extends Request {
    user?: JwtPayload | string;
}

export const generateJWT = (user: User): string => {
    const payload = {
        user_id: user.id,
        role: user.role,
        email: user.email,
    };

    const options: SignOptions = {
        algorithm: "RS512",
        expiresIn: "12h",
    };

    return jwt.sign(payload, privateKey, options);
};

export const verifyJWT = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token not found.' });
        return;
    }

    jwt.verify(token, publicKey, { algorithms: ["RS512"] }, (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
            res.status(403).json({ message: 'Invalid token. Access forbidden.' });
            return;
        }

        req.user = decoded;
        next();
    });
};