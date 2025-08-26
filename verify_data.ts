import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifyData() {
  console.log('Verificando datos...\n');

  // Verificar boletas de inscripción
  const boletas = await prisma.boletaInscripcion.findMany({
    include: {
      estudiante: {
        select: { matricula: true, nombre: true, email: true },
      },
    },
  });

  console.log('📋 BOLETAS DE INSCRIPCIÓN:');
  boletas.forEach((boleta, index) => {
    console.log(`${index + 1}. ID: ${boleta.id}`);
    console.log(`   Estudiante ID: ${boleta.estudianteId || 'NULL'}`);
    console.log(
      `   Estudiante: ${boleta.estudiante ? `${boleta.estudiante.matricula} - ${boleta.estudiante.nombre}` : 'No asignado'}`,
    );
    console.log(`   Ficha: ${boleta.fichaInscripcionId}`);
    console.log(`   Estado: ${boleta.estaActivo ? 'Activo' : 'Inactivo'}\n`);
  });

  // Verificar avances académicos
  const avances = await prisma.avanceAcademico.findMany({
    include: {
      estudiante: {
        select: { matricula: true, nombre: true },
      },
    },
  });

  console.log('🎓 AVANCES ACADÉMICOS:');
  avances.forEach((avance, index) => {
    console.log(`${index + 1}. ID: ${avance.id}`);
    console.log(`   Estudiante ID: ${avance.estudianteId || 'NULL'}`);
    console.log(
      `   Estudiante: ${avance.estudiante ? `${avance.estudiante.matricula} - ${avance.estudiante.nombre}` : 'No asignado'}`,
    );
    console.log(`   Estado: ${avance.estaActivo ? 'Activo' : 'Inactivo'}\n`);
  });

  // Verificar horarios
  const horarios = await prisma.horario.findMany({
    include: {
      grupoMateria: {
        include: {
          materia: { select: { nombre: true } },
          docente: { select: { nombre: true } },
        },
      },
    },
    take: 5, // Solo los primeros 5 para no saturar
  });

  console.log('⏰ HORARIOS (primeros 5):');
  horarios.forEach((horario, index) => {
    console.log(
      `${index + 1}. ${horario.diaSemana} ${horario.horaInicio}-${horario.horaFin}`,
    );
    console.log(`   Materia: ${horario.grupoMateria.materia.nombre}`);
    console.log(`   Docente: ${horario.grupoMateria.docente.nombre}`);
    console.log(`   Grupo: ${horario.grupoMateriaId}\n`);
  });

  await prisma.$disconnect();
}

verifyData().catch(console.error);
