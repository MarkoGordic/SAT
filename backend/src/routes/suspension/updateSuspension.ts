import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export default [
    body("suspension_id").notEmpty().withMessage("Suspension ID is required."),
    body("revoked")
        .isBoolean()
        .withMessage("Revoked must be a boolean value."),
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { suspension_id, revoked } = req.body;

        try {
            const suspension = await prisma.suspensions.update({
                where: { id: suspension_id },
                data: { revoked },
            });

            res.status(200).json({ message: "Suspension updated successfully.", suspension });
        } catch (error) {
            console.error("[error]: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
];
