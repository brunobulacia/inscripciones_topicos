-- CreateEnum
CREATE TYPE "public"."SeatRequestStatus" AS ENUM ('REQUESTED', 'CONFIRMED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "public"."SeatRequest" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "ofertaGrupoMateriaId" TEXT NOT NULL,
    "estado" "public"."SeatRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3),
    "prioridad" INTEGER NOT NULL DEFAULT 0,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeatRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SeatRequest_estado_idx" ON "public"."SeatRequest"("estado");

-- CreateIndex
CREATE INDEX "SeatRequest_expiresAt_idx" ON "public"."SeatRequest"("expiresAt");

-- CreateIndex
CREATE INDEX "SeatRequest_requestedAt_idx" ON "public"."SeatRequest"("requestedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SeatRequest_estudianteId_ofertaGrupoMateriaId_key" ON "public"."SeatRequest"("estudianteId", "ofertaGrupoMateriaId");

-- AddForeignKey
ALTER TABLE "public"."SeatRequest" ADD CONSTRAINT "SeatRequest_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."SeatRequest" ADD CONSTRAINT "SeatRequest_ofertaGrupoMateriaId_fkey" FOREIGN KEY ("ofertaGrupoMateriaId") REFERENCES "public"."OfertaGrupoMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
