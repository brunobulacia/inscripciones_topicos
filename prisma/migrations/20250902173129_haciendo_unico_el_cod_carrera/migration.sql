/*
  Warnings:

  - A unique constraint covering the columns `[codigo]` on the table `Carrera` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nombre]` on the table `Carrera` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Carrera_codigo_key" ON "public"."Carrera"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Carrera_nombre_key" ON "public"."Carrera"("nombre");
