import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function getUserRoute(req: Request, res: Response): Promise<void> {
  const { id } = req.params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
      select: {
        id: true,
        email: true,
        first_name: true,
        last_name: true,
        date_of_birth: true,
        profile_pic: true,
        roles: true,
        created_at: true,
      },
    });

    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("[error]: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}