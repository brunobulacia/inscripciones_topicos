/*
  Warnings:

  - You are about to drop the column `avanceAcademicoId` on the `Estudiante` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[estudianteId]` on the table `AvanceAcademico` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `estudianteId` to the `AvanceAcademico` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Estudiante" DROP CONSTRAINT "Estudiante_avanceAcademicoId_fkey";

-- DropIndex
DROP INDEX "public"."Estudiante_avanceAcademicoId_key";

-- AlterTable
ALTER TABLE "public"."AvanceAcademico" ADD COLUMN     "estudianteId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Estudiante" DROP COLUMN "avanceAcademicoId";

-- CreateIndex
CREATE UNIQUE INDEX "AvanceAcademico_estudianteId_key" ON "public"."AvanceAcademico"("estudianteId");

-- AddForeignKey
ALTER TABLE "public"."AvanceAcademico" ADD CONSTRAINT "AvanceAcademico_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
