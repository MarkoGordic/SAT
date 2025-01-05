import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma_client = new PrismaClient();

export default async function getAllUsers(req: Request, res: Response): Promise<void> {
  const { offset = 0, limit = 10 } = req.query;

  try {
    const parsed_offset = parseInt(offset as string, 10) || 0;
    const parsed_limit = parseInt(limit as string, 10) || 10;

    const total_users = await prisma_client.user.count();

    const users = await prisma_client.user.findMany({
      skip: parsed_offset,
      take: parsed_limit,
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

    res.status(200).json({
      total: total_users,
      offset: parsed_offset,
      limit: parsed_limit,
      users,
    });
  } catch (error) {
    console.error("[error]: ", error);
    res.status(500).json({ message: "Internal server error." });
  }
}
