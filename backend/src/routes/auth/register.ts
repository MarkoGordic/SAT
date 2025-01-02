import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import { unlinkSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { body, validationResult } from "express-validator";

const prisma = new PrismaClient();
const router = express.Router();

const avatar_storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, path.join(__dirname, "..", "..", "uploads", "avatars"));
    },
    filename: (req: Request, file: Express.Multer.File, callback) => {
        const unique_seed = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const file_name = `${unique_seed}${path.extname(file.originalname)}`;
        callback(null, file_name);
    },
});

const file_filter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

const upload_middleware = multer({
    storage: avatar_storage,
    fileFilter: file_filter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB file limit
    },
});

router.post(
    "/register",
    upload_middleware.single("avatar"),
    body("email").isEmail().withMessage("Invalid email format."),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long."),
    body("first_name").notEmpty().withMessage("Name is required."),
    body("last_name").notEmpty().withMessage("Surname is required."),
    body("date_of_birth").isDate().withMessage("Invalid date format."),
    async (req: Request, res: Response): Promise<void> => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));
            res.status(400).json({ errors: errors.array() });
            return;
        }

        const { email, password, first_name, last_name, date_of_birth } = req.body;

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
                    role: [],
                    permissions: [],
                },
            });

            res.status(201).json({ message: `User ${user.email} registered successfully.` });
        } catch (error) {
            console.error("[error]: ", error);

            if (req.file) unlinkSync(path.join(__dirname, "..", "..", "uploads", "avatars", req.file.filename));

            res.status(500).json({ message: "Internal server error." });
        }
    }
);

export default router;
