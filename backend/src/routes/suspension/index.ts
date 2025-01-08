import express from "express";
import suspendUserRoute from "./suspendUser";
import updateSuspensionRoute from "./updateSuspension";
import { verifyJWT } from "../../utils/jwt";
import { checkPermission } from "../../middleware/checkPermission";

const router = express.Router();

router.post("/suspend", verifyJWT, checkPermission("user", "suspend"), suspendUserRoute);
router.patch("/suspend", verifyJWT, checkPermission("user", "suspend"), updateSuspensionRoute);

export default router;
