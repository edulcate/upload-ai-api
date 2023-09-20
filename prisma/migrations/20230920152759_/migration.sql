/*
  Warnings:

  - You are about to drop the `Prompt` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Prompt";

-- CreateTable
CREATE TABLE "prompt" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "template" TEXT NOT NULL,

    CONSTRAINT "prompt_pkey" PRIMARY KEY ("id")
);
