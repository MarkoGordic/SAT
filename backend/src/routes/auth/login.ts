import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { generateJWT } from "../../utils/jwt";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).json({ message: "Email and password are required." });
        return;
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            res.status(401).json({ message: "Invalid email or password." });
            return;
        }

        const token = generateJWT({
            id: user.id,
            email: user.email,
            roles: user.roles,
        });

        res.status(200).json({ token });
    } catch (error) {
        console.error("error: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

export default router;
