import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();

export default [
    body("user_id").notEmpty().withMessage("User ID is required."),
    body("issuer_id").notEmpty().withMessage("Issuer ID is required."),
    body("reason").notEmpty().withMessage("Reason is required."),
    body("end_date")
        .isISO8601()
        .toDate()
        .withMessage("End date must be a valid ISO8601 date."),
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { user_id, issuer_id, reason, end_date } = req.body;

        try {
            const suspension = await prisma.suspensions.create({
                data: {
                    user_id,
                    issuer_id,
                    reason,
                    revoked: false,
                    end_date,
                    created_at: new Date(),
                },
            });

            res.status(201).json({ message: "Suspension created successfully.", suspension });
        } catch (error) {
            console.error("[error]: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    },
];