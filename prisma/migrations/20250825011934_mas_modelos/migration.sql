-- CreateTable
CREATE TABLE "public"."Nivel" (
    "id" TEXT NOT NULL,
    "semestre" INTEGER NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Nivel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Materia" (
    "id" TEXT NOT NULL,
    "sigla" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "creditos" INTEGER NOT NULL,
    "esElectiva" BOOLEAN NOT NULL DEFAULT false,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "nivelId" TEXT NOT NULL,
    "planDeEstudioId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Materia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Prerequisito" (
    "siglaMateria" TEXT NOT NULL,
    "siglaPrerequisito" TEXT NOT NULL,

    CONSTRAINT "Prerequisito_pkey" PRIMARY KEY ("siglaMateria","siglaPrerequisito")
);

-- CreateTable
CREATE TABLE "public"."GrupoMateria" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "materiaId" TEXT NOT NULL,
    "docenteId" TEXT NOT NULL,
    "detalleInscripcionId" TEXT NOT NULL,
    "aulaGrupoMateriaId" TEXT NOT NULL,
    "periodoId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GrupoMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Docente" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "registro" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Docente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Estudiante" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "apellido_paterno" TEXT NOT NULL,
    "apellido_materno" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "ci" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "matricula" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Estudiante_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."FichaInscripcion" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FichaInscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DetalleInscripcion" (
    "id" TEXT NOT NULL,
    "fichaInscripcionId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DetalleInscripcion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AulaGrupoMateria" (
    "id" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AulaGrupoMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Modulo" (
    "id" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Modulo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Aula" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "capacidad" INTEGER NOT NULL,
    "aulaGrupoMateriaId" TEXT NOT NULL,
    "moduloId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Aula_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gestion" (
    "id" TEXT NOT NULL,
    "año" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Periodo" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "gestionId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Periodo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Materia_sigla_key" ON "public"."Materia"("sigla");

-- CreateIndex
CREATE INDEX "Prerequisito_siglaPrerequisito_idx" ON "public"."Prerequisito"("siglaPrerequisito");

-- CreateIndex
CREATE INDEX "Prerequisito_siglaMateria_idx" ON "public"."Prerequisito"("siglaMateria");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_ci_key" ON "public"."Docente"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_registro_key" ON "public"."Docente"("registro");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_email_key" ON "public"."Docente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Docente_telefono_key" ON "public"."Docente"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_telefono_key" ON "public"."Estudiante"("telefono");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_ci_key" ON "public"."Estudiante"("ci");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_email_key" ON "public"."Estudiante"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Estudiante_matricula_key" ON "public"."Estudiante"("matricula");

-- CreateIndex
CREATE UNIQUE INDEX "Aula_numero_moduloId_key" ON "public"."Aula"("numero", "moduloId");

-- CreateIndex
CREATE UNIQUE INDEX "Periodo_numero_gestionId_key" ON "public"."Periodo"("numero", "gestionId");

-- AddForeignKey
ALTER TABLE "public"."Materia" ADD CONSTRAINT "Materia_nivelId_fkey" FOREIGN KEY ("nivelId") REFERENCES "public"."Nivel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Materia" ADD CONSTRAINT "Materia_planDeEstudioId_fkey" FOREIGN KEY ("planDeEstudioId") REFERENCES "public"."PlanDeEstudio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prerequisito" ADD CONSTRAINT "Prerequisito_siglaMateria_fkey" FOREIGN KEY ("siglaMateria") REFERENCES "public"."Materia"("sigla") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Prerequisito" ADD CONSTRAINT "Prerequisito_siglaPrerequisito_fkey" FOREIGN KEY ("siglaPrerequisito") REFERENCES "public"."Materia"("sigla") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoMateria" ADD CONSTRAINT "GrupoMateria_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "public"."Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoMateria" ADD CONSTRAINT "GrupoMateria_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "public"."Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoMateria" ADD CONSTRAINT "GrupoMateria_detalleInscripcionId_fkey" FOREIGN KEY ("detalleInscripcionId") REFERENCES "public"."DetalleInscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoMateria" ADD CONSTRAINT "GrupoMateria_aulaGrupoMateriaId_fkey" FOREIGN KEY ("aulaGrupoMateriaId") REFERENCES "public"."AulaGrupoMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."GrupoMateria" ADD CONSTRAINT "GrupoMateria_periodoId_fkey" FOREIGN KEY ("periodoId") REFERENCES "public"."Periodo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FichaInscripcion" ADD CONSTRAINT "FichaInscripcion_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "public"."Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DetalleInscripcion" ADD CONSTRAINT "DetalleInscripcion_fichaInscripcionId_fkey" FOREIGN KEY ("fichaInscripcionId") REFERENCES "public"."FichaInscripcion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aula" ADD CONSTRAINT "Aula_aulaGrupoMateriaId_fkey" FOREIGN KEY ("aulaGrupoMateriaId") REFERENCES "public"."AulaGrupoMateria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Aula" ADD CONSTRAINT "Aula_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "public"."Modulo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Periodo" ADD CONSTRAINT "Periodo_gestionId_fkey" FOREIGN KEY ("gestionId") REFERENCES "public"."Gestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
