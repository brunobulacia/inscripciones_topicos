/*
  Warnings:

  - A unique constraint covering the columns `[estudianteId]` on the table `AvanceAcademico` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[estudianteId]` on the table `BoletaInscripcion` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "public"."BoletaInscripcion" DROP CONSTRAINT "BoletaInscripcion_avanceAcademicoId_fkey";

-- AlterTable
ALTER TABLE "public"."AvanceAcademico" ADD COLUMN     "estudianteId" TEXT;

-- AlterTable
ALTER TABLE "public"."BoletaInscripcion" ADD COLUMN     "estudianteId" TEXT,
ALTER COLUMN "avanceAcademicoId" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AvanceAcademico_estudianteId_key" ON "public"."AvanceAcademico"("estudianteId");

-- CreateIndex
CREATE UNIQUE INDEX "BoletaInscripcion_estudianteId_key" ON "public"."BoletaInscripcion"("estudianteId");

-- AddForeignKey
ALTER TABLE "public"."BoletaInscripcion" ADD CONSTRAINT "BoletaInscripcion_avanceAcademicoId_fkey" FOREIGN KEY ("avanceAcademicoId") REFERENCES "public"."AvanceAcademico"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoletaInscripcion" ADD CONSTRAINT "BoletaInscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AvanceAcademico" ADD CONSTRAINT "AvanceAcademico_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE SET NULL ON UPDATE CASCADE;
