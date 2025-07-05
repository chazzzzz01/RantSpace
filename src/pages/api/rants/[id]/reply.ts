// pages/api/rants/[id]/reply.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const rantId = parseInt(id as string, 10);

  if (isNaN(rantId)) {
    return res.status(400).json({ message: "Invalid rant ID" });
  }

  if (req.method === "POST") {
    const { content } = req.body;

    if (!content || typeof content !== "string") {
      return res.status(400).json({ message: "Reply content is required" });
    }

    try {
      const reply = await prisma.reply.create({
        data: {
          content,
          rantId,
        },
      });

      return res.status(201).json(reply);
    } catch (error) {
      console.error("Error creating reply:", error);
      return res.status(500).json({ message: "Failed to create reply" });
    }
  }

  if (req.method === "GET") {
    try {
      const replies = await prisma.reply.findMany({
        where: { rantId },
        orderBy: { createdAt: "asc" },
      });

      return res.status(200).json(replies);
    } catch (error) {
      console.error("Error fetching replies:", error);
      return res.status(500).json({ message: "Failed to fetch replies" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}
