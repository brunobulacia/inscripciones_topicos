/*
  Warnings:

  - Changed the type of `numero` on the `Aula` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Aula" DROP COLUMN "numero",
ADD COLUMN     "numero" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Aula_numero_moduloId_key" ON "public"."Aula"("numero", "moduloId");
