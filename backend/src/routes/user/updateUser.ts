import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";
import { unlinkSync } from "fs";
import path from "path";
import { upload_middleware } from "../../middleware/avatarUpload";

const prisma = new PrismaClient();

export default [
    upload_middleware.single("avatar"),
    body("email").optional().isEmail().withMessage("Invalid email format."),
    body("first_name").optional().notEmpty().withMessage("Name cannot be empty."),
    body("last_name").optional().notEmpty().withMessage("Surname cannot be empty."),
    body("date_of_birth").optional().isDate().withMessage("Invalid date format."),
    body("old_password").optional().notEmpty().withMessage("Old password cannot be empty."),
    body("new_password").optional().isLength({ min: 6 }).withMessage("New password must be at least 6 characters long."),
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, first_name, last_name, date_of_birth, old_password, new_password } = req.body;

        if (!email && !first_name && !last_name && !date_of_birth && !old_password && !new_password && !req.file) {
            res.status(400).json({ message: "No update requested." });
            return;
        }

        const user_id = req.user?.id;

        try {
            const user = await prisma.user.findUnique({
                where: { id: user_id },
            });

            if (!user) {
                if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
                res.status(404).json({ message: "User not found." });
                return;
            }

            let updated_data: { [key: string]: any } = {};

            if (email) updated_data.email = email;
            if (first_name) updated_data.first_name = first_name;
            if (last_name) updated_data.last_name = last_name;
            if (date_of_birth) updated_data.date_of_birth = new Date(date_of_birth);
            if (old_password || new_password) {
                if (!old_password || !new_password) {
                    if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
                    res.status(400).json({
                        message: "Both old_password and new_password are required to update the password."
                    });
                    return;
                }

                const is_password_valid = await bcrypt.compare(old_password, user.password);
                if (!is_password_valid) {
                    if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
                    res.status(400).json({ message: "Old password is incorrect." });
                    return;
                }

                updated_data.password = await bcrypt.hash(new_password, 10);
            }

            if (req.file) {
                const new_avatar_path = path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename);
                const old_avatar_path = user.profile_pic ? path.join(__dirname, "..", "..", "uploads", "avatars", user.profile_pic) : null;

                updated_data.profile_pic = req.file.filename;

                try {
                    const updated_user = await prisma.user.update({
                        where: { id: user_id },
                        data: updated_data,
                    });

                    if (old_avatar_path) unlinkSync(old_avatar_path);

                    res.status(200).json({ message: "User updated successfully.", user: updated_user });
                } catch (error) {
                    unlinkSync(new_avatar_path);
                    console.error("[error]: ", error);
                    res.status(500).json({ message: "Internal server error." });
                }

                return;
            }

            const updated_user = await prisma.user.update({
                where: { id: user_id },
                data: updated_data,
            });

            res.status(200).json({ message: "User updated successfully.", user: updated_user });
        } catch (error) {
            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
            console.error("[error]: ", error);
            res.status(500).json({ message: "Internal server error." });
        }
    }
];
