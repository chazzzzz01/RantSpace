-- DropForeignKey
ALTER TABLE "EmojiReaction" DROP CONSTRAINT "EmojiReaction_rantId_fkey";

-- AddForeignKey
ALTER TABLE "EmojiReaction" ADD CONSTRAINT "EmojiReaction_rantId_fkey" FOREIGN KEY ("rantId") REFERENCES "Rant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
