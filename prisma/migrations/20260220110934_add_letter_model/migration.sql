/*
  Warnings:

  - Added the required column `letterId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "letterId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Letter" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Letter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_letterId_fkey" FOREIGN KEY ("letterId") REFERENCES "Letter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
