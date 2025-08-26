/*
  Warnings:

  - Added the required column `ppac` to the `Estudiante` table without a default value. This is not possible if the table is not empty.

*/
-- Primero agregar la columna como nullable
ALTER TABLE "public"."Estudiante" ADD COLUMN "ppac" INTEGER;

-- Actualizar los valores NULL a 0
UPDATE "public"."Estudiante" SET "ppac" = 0 WHERE "ppac" IS NULL;

-- Ahora hacer la columna NOT NULL
ALTER TABLE "public"."Estudiante" ALTER COLUMN "ppac" SET NOT NULL;

-- Agregar default para futuros registros
ALTER TABLE "public"."Estudiante" ALTER COLUMN "ppac" SET DEFAULT 0;

-- CreateTable
CREATE TABLE "public"."Horario" (
    "id" TEXT NOT NULL,
    "diaSemana" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "grupoMateriaId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Horario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Horario_grupoMateriaId_diaSemana_horaInicio_key" ON "public"."Horario"("grupoMateriaId", "diaSemana", "horaInicio");

-- AddForeignKey
ALTER TABLE "public"."Horario" ADD CONSTRAINT "Horario_grupoMateriaId_fkey" FOREIGN KEY ("grupoMateriaId") REFERENCES "public"."GrupoMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
