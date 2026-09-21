/*
  Warnings:

  - You are about to drop the column `login` on the `staff` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `staff` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "staff_login_key";

-- AlterTable
ALTER TABLE "staff" DROP COLUMN "login",
ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "staff_email_key" ON "staff"("email");
