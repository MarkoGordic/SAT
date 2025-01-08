import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions, VerifyErrors, JwtPayload } from 'jsonwebtoken';
import fs from 'fs';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { JwtUser, Role } from '../types';

dotenv.config();

const prisma = new PrismaClient();

const private_key = fs.readFileSync(process.env.PRIVATE_KEY_PATH || '', 'utf8');
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

    return jwt.sign(payload, private_key, options);
};

export const verifyJWT = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    const auth_header = req.headers['authorization'];
    const token = auth_header && auth_header.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token not found.' });
        return;
    }

    jwt.verify(token, publicKey, { algorithms: ["RS512"] }, async (err: VerifyErrors | null, decoded: string | JwtPayload | undefined) => {
        if (err) {
            res.status(403).json({ message: 'Invalid token. Access forbidden.' });
            return;
        }

        if (typeof decoded === 'object' && decoded !== null) {
            const id = decoded.id as string;

            try {
                const suspension = await prisma.suspensions.findFirst({
                    where: {
                        user_id: id,
                        revoked: false,
                        end_date: {
                            gte: new Date(),
                        },
                    },
                });

                if (suspension) {
                    res.status(403).json({
                        message: 'User is suspended. Access denied.',
                        reason: suspension.reason,
                    });
                    return;
                }

                req.user = {
                    id: id,
                    email: decoded.email as string,
                    roles: decoded.roles as Role[],
                };

                next();
            } catch (error) {
                console.error('[Suspension Check Error]:', error);
                res.status(500).json({ message: 'Internal server error.' });
            }
        } else {
            res.status(403).json({ message: 'Invalid token. Access forbidden.' });
        }
    });
};