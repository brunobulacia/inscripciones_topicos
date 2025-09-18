-- CreateTable
CREATE TABLE "public"."Cola" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estaActiva" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Worker" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "concurrencia" INTEGER NOT NULL DEFAULT 1,
    "colaId" TEXT NOT NULL,
    "estaActivo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Worker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cola_nombre_key" ON "public"."Cola"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Worker_nombre_colaId_key" ON "public"."Worker"("nombre", "colaId");

-- AddForeignKey
ALTER TABLE "public"."Worker" ADD CONSTRAINT "Worker_colaId_fkey" FOREIGN KEY ("colaId") REFERENCES "public"."Cola"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
