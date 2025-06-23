-- CreateTable
CREATE TABLE "EmojiReaction" (
    "id" SERIAL NOT NULL,
    "rantId" INTEGER NOT NULL,
    "emoji" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "EmojiReaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmojiReaction_rantId_emoji_key" ON "EmojiReaction"("rantId", "emoji");

-- AddForeignKey
ALTER TABLE "EmojiReaction" ADD CONSTRAINT "EmojiReaction_rantId_fkey" FOREIGN KEY ("rantId") REFERENCES "Rant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
