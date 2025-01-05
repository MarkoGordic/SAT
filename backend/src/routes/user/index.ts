import express from "express";
import addUserRoute from "./addUser";
import getUserRoute from "./getUser";
import getAllUsersRoute from "./getAllUsers";
import updateUserRoute from "./updateUser";
import deleteUserRoute from "./deleteUser";
import { verifyJWT } from "../../utils/jwt";
import { checkPermission } from "../../middleware/checkPermission";
import { PrismaClient } from "@prisma/client";
import { Role, User } from "../../types";

const prisma = new PrismaClient();
const router = express.Router();

router.post("/", verifyJWT, checkPermission("user", "create"), addUserRoute);

router.get(
  "/:id",
  verifyJWT,
  checkPermission("user", "view", async (req) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is missing from the request parameters.");
    return getUserById(id);
  }),
  getUserRoute
);

router.get("/all", verifyJWT, checkPermission("user", "view_all"), getAllUsersRoute);

router.patch(
  "/:id",
  verifyJWT,
  checkPermission("user", "update", async (req) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is missing from the request parameters.");
    return getUserById(id);
  }),
  updateUserRoute
);

router.delete(
  "/:id",
  verifyJWT,
  checkPermission("user", "delete", async (req) => {
    const { id } = req.params;
    if (!id) throw new Error("ID is missing from the request parameters.");
    return getUserById(id);
  }),
  deleteUserRoute
);

async function getUserById(id: string): Promise<User> {
  const user = await prisma.user.findUnique({
    where: { id: id },
  });

  if (!user) {
    throw new Error("User with provided ID could not be found.");
  }

  return {
    ...user,
    date_of_birth: user.date_of_birth.toISOString(),
    created_at: user.created_at.toISOString(),
    roles: user.roles.map((role) => role as Role),
  };
}

export default router;
