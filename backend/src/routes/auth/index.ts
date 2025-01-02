import express from "express";
import loginRoute from "./login";

const router = express.Router();

router.use("/login", loginRoute);

export default router;