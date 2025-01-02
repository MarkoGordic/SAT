import express from "express";
import loginRoute from "./login";
import registerRoute from "./register";
import { verifyJWT } from "../../utils/jwt";
import { checkPermission } from "../../middleware/checkPermission";

const router = express.Router();

router.use("/login", loginRoute);
router.use("/register", verifyJWT, checkPermission("users", "create"), registerRoute);

export default router;