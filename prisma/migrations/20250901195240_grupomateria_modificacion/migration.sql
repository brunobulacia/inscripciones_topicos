/*
  Warnings:

  - A unique constraint covering the columns `[id,grupo,periodoId]` on the table `GrupoMateria` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."GrupoMateria_grupo_periodoId_key";

-- CreateIndex
CREATE UNIQUE INDEX "GrupoMateria_id_grupo_periodoId_key" ON "public"."GrupoMateria"("id", "grupo", "periodoId");
