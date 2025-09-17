/*
  Warnings:

  - A unique constraint covering the columns `[numero]` on the table `Modulo` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Modulo_numero_key" ON "public"."Modulo"("numero");
