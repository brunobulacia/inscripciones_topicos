/*
  Warnings:

  - The primary key for the `Prerequisito` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[siglaMateria,siglaPrerequisito]` on the table `Prerequisito` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Prerequisito` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Prerequisito" DROP CONSTRAINT "Prerequisito_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "Prerequisito_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "Prerequisito_siglaMateria_siglaPrerequisito_key" ON "public"."Prerequisito"("siglaMateria", "siglaPrerequisito");
