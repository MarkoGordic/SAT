import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { jwtDecode } from "jwt-decode";

const prisma = new PrismaClient();

export const meRoute = async (req: Request, res: Response) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized." });

    try {
        const decodedToken: any = jwtDecode(token);
        const user = await prisma.user.findUnique({
            where: { email: decodedToken.email },
            select: {
                id: true,
                email: true,
                first_name: true,
                last_name: true,
                date_of_birth: true,
                profile_pic: true,
                roles: true,
                created_at: true,
            },
        });
        if (!user) return res.status(404).json({ message: "User not found." });

        return res.status(200).json(user);
    } catch (error) {
        console.error("error: ", error);
        return res.status(500).json({ message: "Internal server error." });
    }
};