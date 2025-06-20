-- CreateTable
CREATE TABLE "Rant" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "nickname" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rant_pkey" PRIMARY KEY ("id")
);
