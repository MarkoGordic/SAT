import multer, { FileFilterCallback } from "multer";
import path from "path";
import { Request } from "express";

export const avatar_storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, path.join(__dirname, "..", "uploads", "avatars"));
  },
  filename: (req, file, callback) => {
    const unique_seed = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const file_name = `${unique_seed}${path.extname(file.originalname)}`;
    callback(null, file_name);
  },
});

export const file_filter = (req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
        callback(null, true);
    } else {
        callback(null, false);
    }
};

export const upload_middleware = multer({
    storage: avatar_storage,
    fileFilter: file_filter,
    limits: {
        fileSize: 1024 * 1024 * 5, // 5MB file limit
    },
});
