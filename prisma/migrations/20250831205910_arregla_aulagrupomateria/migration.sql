/*
  Warnings:

  - Added the required column `aulaId` to the `AulaGrupoMateria` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Aula" DROP CONSTRAINT "Aula_aulaGrupoMateriaId_fkey";

-- AlterTable
ALTER TABLE "public"."AulaGrupoMateria" ADD COLUMN     "aulaId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."AulaGrupoMateria" ADD CONSTRAINT "AulaGrupoMateria_aulaId_fkey" FOREIGN KEY ("aulaId") REFERENCES "public"."Aula"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
