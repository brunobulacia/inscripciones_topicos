/*
  Warnings:

  - Changed the type of `codigo` on the `Carrera` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Carrera" DROP COLUMN "codigo",
ADD COLUMN     "codigo" INTEGER NOT NULL;
