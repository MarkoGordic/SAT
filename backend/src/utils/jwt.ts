import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, VerifyErrors, JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';
import { JwtUser, Role } from '../types';

dotenv.config();

const privateKey = fs.readFileSync(process.env.PRIVATE_KEY_PATH || '', 'utf8');
const publicKey = fs.readFileSync(process.env.PUBLIC_KEY_PATH || '', 'utf8');

interface AuthenticatedRequest extends Request {
    user?: JwtUser;
}

export const generateJWT = (user: JwtUser): string => {
    const payload = {
        id: user.id,
        roles: user.roles,
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

    jwt.verify(token, publicKey, { algorithms: ["RS512"] }, (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
            if (err) {
                res.status(403).json({ message: 'Invalid token. Access forbidden.' });
                return;
            }

            if (typeof decoded === 'object' && decoded !== null) {
                req.user = {
                    id: decoded.id as string,
                    email: decoded.email as string,
                    roles: decoded.roles as Role[],
                };
                next();
            } else {
                res.status(403).json({ message: 'Invalid token. Access forbidden.' });
            }
        }
    );
};
