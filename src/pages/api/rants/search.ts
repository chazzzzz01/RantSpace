import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const nickname = req.query.nickname as string;

  if (!nickname || nickname.trim() === "") {
    return res.status(400).json({ error: "Nickname is required" });
  }

  try {
    const rants = await prisma.rant.findMany({
      where: {
        nickname: {
          contains: nickname,     // ✅ allows partial matching
          mode: "insensitive",    // ✅ case-insensitive search
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.status(200).json(rants);
  } catch (err) {
    console.error("Error searching rants", err);
    res.status(500).json({ error: "Internal server error" });
  }
}
