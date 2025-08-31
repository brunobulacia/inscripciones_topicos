/*
  Warnings:

  - You are about to drop the column `aulaGrupoMateriaId` on the `GrupoMateria` table. All the data in the column will be lost.
  - You are about to drop the column `fechaFin` on the `Periodo` table. All the data in the column will be lost.
  - You are about to drop the column `fechaInicio` on the `Periodo` table. All the data in the column will be lost.
  - Added the required column `grupoMateriaId` to the `AulaGrupoMateria` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `numero` on the `Periodo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "public"."GrupoMateria" DROP CONSTRAINT "GrupoMateria_aulaGrupoMateriaId_fkey";

-- AlterTable
ALTER TABLE "public"."AulaGrupoMateria" ADD COLUMN     "grupoMateriaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."GrupoMateria" DROP COLUMN "aulaGrupoMateriaId";

-- AlterTable
ALTER TABLE "public"."Periodo" DROP COLUMN "fechaFin",
DROP COLUMN "fechaInicio",
DROP COLUMN "numero",
ADD COLUMN     "numero" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Periodo_numero_gestionId_key" ON "public"."Periodo"("numero", "gestionId");

-- AddForeignKey
ALTER TABLE "public"."AulaGrupoMateria" ADD CONSTRAINT "AulaGrupoMateria_grupoMateriaId_fkey" FOREIGN KEY ("grupoMateriaId") REFERENCES "public"."GrupoMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
