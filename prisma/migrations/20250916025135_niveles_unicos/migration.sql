/*
  Warnings:

  - A unique constraint covering the columns `[semestre]` on the table `Nivel` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Nivel_semestre_key" ON "public"."Nivel"("semestre");
