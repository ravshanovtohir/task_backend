/*
  Warnings:

  - You are about to drop the `adminSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "adminSession" DROP CONSTRAINT "adminSession_staff_id_fkey";

-- DropTable
DROP TABLE "adminSession";

-- CreateTable
CREATE TABLE "admin_session" (
    "id" SERIAL NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_session_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "admin_session" ADD CONSTRAINT "admin_session_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
