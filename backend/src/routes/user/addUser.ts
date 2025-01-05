import { Request, Response } from "express";
import bcrypt from "bcrypt";
import path from "path";
import { unlinkSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { upload_middleware } from "../../middleware/avatarUpload";
import { Role } from "../../types";

const prisma = new PrismaClient();

export default [
    upload_middleware.single("avatar"),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("first_name").notEmpty().withMessage("Name is required."),
    body("last_name").notEmpty().withMessage("Surname is required."),
    body("date_of_birth").isDate().withMessage("Invalid date format."),
    body("roles")
        .isArray({ min: 1 })
        .withMessage("Roles are required and must be an array.")
        .custom((roles: string[]) => {
            const validRoles: Role[] = ["assistant", "professor", "admin"];
            return roles.every((role) => validRoles.includes(role as Role));
        })
        .withMessage("Invalid roles provided."),
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, first_name, last_name, date_of_birth, roles } = req.body;

        try {
            const existing_user = await prisma.user.findUnique({
                where: { email: email },
            });

            if (existing_user) {
                if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
                res.status(409).json({ message: "User with this email already exists." });
                return;
            }

            const hashed_password = await bcrypt.hash(password, 10);
            const profile_pic_filename = req.file ? req.file.filename : null;

            const user = await prisma.user.create({
                data: {
                    email: email,
                    password: hashed_password,
                    first_name: first_name,
                    last_name: last_name,
                    date_of_birth: new Date(date_of_birth),
                    created_at: new Date(),
                    profile_pic: profile_pic_filename || "",
                    roles: roles as Role[],
                },
            });

            res.status(201).json({ message: `User ${user.email} registered successfully.` });
        } catch (error) {
            console.error("[error]: ", error);

            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));

            res.status(500).json({ message: "Internal server error." });
        }
    }
];
