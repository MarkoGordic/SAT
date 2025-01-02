import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function deleteUserRoute(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id) {
        res.status(400).json({ message: "ID is missing from the request parameters." });
        return;
    }

    try {
        const user = await prisma.user.findUnique({ where: { id } });

        if (!user) {
            res.status(404).json({ message: "User with the provided ID does not exist." });
            return;
        }

        await prisma.user.delete({ where: { id } });

        res.status(200).json({ message: `User with ID ${id} has been deleted successfully.` });
    } catch (error) {
        console.error("[error]: ", error);
        res.status(500).json({ message: "Internal server error." });
    }
}