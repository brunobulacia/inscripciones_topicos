/*
  Warnings:

  - You are about to drop the column `colaId` on the `Endpoint` table. All the data in the column will be lost.
  - You are about to drop the column `descripcion` on the `Endpoint` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Endpoint" DROP CONSTRAINT "Endpoint_colaId_fkey";

-- AlterTable
ALTER TABLE "public"."Endpoint" DROP COLUMN "colaId",
DROP COLUMN "descripcion";

-- CreateTable
CREATE TABLE "public"."ColaEndpoint" (
    "id" TEXT NOT NULL,
    "colaId" TEXT NOT NULL,
    "endpointId" TEXT NOT NULL,
    "prioridad" INTEGER NOT NULL DEFAULT 1,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ColaEndpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ColaEndpoint_colaId_endpointId_key" ON "public"."ColaEndpoint"("colaId", "endpointId");

-- AddForeignKey
ALTER TABLE "public"."ColaEndpoint" ADD CONSTRAINT "ColaEndpoint_colaId_fkey" FOREIGN KEY ("colaId") REFERENCES "public"."Cola"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ColaEndpoint" ADD CONSTRAINT "ColaEndpoint_endpointId_fkey" FOREIGN KEY ("endpointId") REFERENCES "public"."Endpoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
