-- DropForeignKey
ALTER TABLE "public"."BoletaInscripcion" DROP CONSTRAINT "BoletaInscripcion_avanceAcademicoId_fkey";

-- AlterTable
ALTER TABLE "public"."BoletaInscripcion" ALTER COLUMN "avanceAcademicoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."BoletaInscripcion" ADD CONSTRAINT "BoletaInscripcion_avanceAcademicoId_fkey" FOREIGN KEY ("avanceAcademicoId") REFERENCES "public"."AvanceAcademico"("id") ON DELETE SET NULL ON UPDATE CASCADE;
