import express from "express";
import loginRoute from "./login";
import registerRoute from "./register";

const router = express.Router();

router.use("/login", loginRoute);
router.use("/register", registerRoute);

export default router;