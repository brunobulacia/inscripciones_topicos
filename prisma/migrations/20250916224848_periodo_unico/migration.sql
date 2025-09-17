/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Periodo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Periodo_numero_key" ON "public"."Periodo"("numero");
