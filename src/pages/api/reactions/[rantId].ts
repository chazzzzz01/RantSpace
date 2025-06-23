import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rantId = parseInt(req.query.rantId as string);

  if (req.method === "GET") {
    const reactions = await prisma.emojiReaction.findMany({
      where: { rantId },
    });
    return res.status(200).json(reactions);
  }

  if (req.method === "POST") {
    const { emoji } = req.body;

    const existing = await prisma.emojiReaction.findUnique({
      where: {
        rantId_emoji: {
          rantId,
          emoji,
        },
      },
    });

    if (existing) {
      const updated = await prisma.emojiReaction.update({
        where: {
          rantId_emoji: {
            rantId,
            emoji,
          },
        },
        data: {
          count: existing.count + 1,
        },
      });
      return res.status(200).json(updated);
    } else {
      const created = await prisma.emojiReaction.create({
        data: {
          rantId,
          emoji,
          count: 1,
        },
      });
      return res.status(200).json(created);
    }
  }

  res.status(405).end();
}
