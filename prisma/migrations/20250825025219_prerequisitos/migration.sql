-- DropForeignKey
ALTER TABLE "public"."Prerequisito" DROP CONSTRAINT "Prerequisito_siglaMateria_fkey";

-- DropForeignKey
ALTER TABLE "public"."Prerequisito" DROP CONSTRAINT "Prerequisito_siglaPrerequisito_fkey";

-- DropIndex
DROP INDEX "public"."Prerequisito_siglaMateria_idx";

-- DropIndex
DROP INDEX "public"."Prerequisito_siglaPrerequisito_idx";

-- AddForeignKey
ALTER TABLE "public"."Prerequisito" ADD CONSTRAINT "Prerequisito_siglaMateria_fkey" FOREIGN KEY ("siglaMateria") REFERENCES "public"."Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prerequisito" ADD CONSTRAINT "Prerequisito_siglaPrerequisito_fkey" FOREIGN KEY ("siglaPrerequisito") REFERENCES "public"."Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
