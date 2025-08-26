-- CreateTable
CREATE TABLE "public"."BoletaInscripcion" (
    "id" TEXT NOT NULL,
    "fichaInscripcionId" TEXT NOT NULL,
    "avanceAcademicoId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BoletaInscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AvanceAcademico" (
    "id" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AvanceAcademico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoletaInscripcion_fichaInscripcionId_key" ON "public"."BoletaInscripcion"("fichaInscripcionId");

-- AddForeignKey
ALTER TABLE "public"."BoletaInscripcion" ADD CONSTRAINT "BoletaInscripcion_fichaInscripcionId_fkey" FOREIGN KEY ("fichaInscripcionId") REFERENCES "public"."FichaInscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."BoletaInscripcion" ADD CONSTRAINT "BoletaInscripcion_avanceAcademicoId_fkey" FOREIGN KEY ("avanceAcademicoId") REFERENCES "public"."AvanceAcademico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
