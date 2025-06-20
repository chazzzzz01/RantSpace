import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const rants = await prisma.rant.findMany({
      orderBy: { createdAt: "desc" },
      take: 50
    });
    return res.json(rants);
  }

  if (req.method === "POST") {
    const { content, nickname } = req.body;
    if (!content || content.trim().length < 1) {
      return res.status(400).json({ error: "Content required" });
    }
    const rant = await prisma.rant.create({
      data: { content, nickname: nickname || null }
    });
    return res.status(201).json(rant);
  }

  res.setHeader("Allow", "GET, POST");
  res.status(405).end("Method Not Allowed");
}
