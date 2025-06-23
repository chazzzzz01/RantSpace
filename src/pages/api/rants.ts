import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method === "GET") {
      const rants = await prisma.rant.findMany({
        orderBy: { createdAt: "desc" },
        take: 50,
      });
      return res.status(200).json(rants);
    }

    if (req.method === "POST") {
      const { content, nickname } = req.body;

      if (!content || content.trim().length === 0) {
        return res.status(400).json({ error: "Content is required" });
      }

      const rant = await prisma.rant.create({
        data: {
          content: content.trim(),
          nickname: nickname?.trim() || null,
        },
      });

      return res.status(201).json(rant);
    }

    res.setHeader("Allow", ["GET", "POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  } catch (error) {
    console.error("❌ API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
