/*
  Warnings:

  - You are about to drop the `admin_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "admin_session" DROP CONSTRAINT "admin_session_staff_id_fkey";

-- DropTable
DROP TABLE "admin_session";

-- CreateTable
CREATE TABLE "staff_session" (
    "id" UUID NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "ip_address" TEXT NOT NULL,
    "user_agent" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "staff_session_staff_id_is_active_idx" ON "staff_session"("staff_id", "is_active");

-- AddForeignKey
ALTER TABLE "staff_session" ADD CONSTRAINT "staff_session_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
