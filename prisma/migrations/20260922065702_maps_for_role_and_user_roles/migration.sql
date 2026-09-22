/*
  Warnings:

  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `StaffRole` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "StaffRole" DROP CONSTRAINT "StaffRole_assigned_by_fkey";

-- DropForeignKey
ALTER TABLE "StaffRole" DROP CONSTRAINT "StaffRole_role_id_fkey";

-- DropForeignKey
ALTER TABLE "StaffRole" DROP CONSTRAINT "StaffRole_staff_id_fkey";

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "StaffRole";

-- CreateTable
CREATE TABLE "role" (
    "id" SERIAL NOT NULL,
    "title" JSONB NOT NULL,
    "key" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMPTZ(5) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(5),
    "deleted_at" TIMESTAMPTZ(5),

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staff_role" (
    "id" SERIAL NOT NULL,
    "role_id" INTEGER NOT NULL,
    "staff_id" INTEGER NOT NULL,
    "assigned_by" INTEGER,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "staff_role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_key_key" ON "role"("key");

-- AddForeignKey
ALTER TABLE "staff_role" ADD CONSTRAINT "staff_role_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_role" ADD CONSTRAINT "staff_role_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "staff"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staff_role" ADD CONSTRAINT "staff_role_assigned_by_fkey" FOREIGN KEY ("assigned_by") REFERENCES "staff"("id") ON DELETE SET NULL ON UPDATE CASCADE;
