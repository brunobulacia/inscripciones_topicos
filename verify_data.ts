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
      aulaGrupoMateria: {
        include: {
          grupoMateria: {
            include: {
              materia: { select: { nombre: true } },
              docente: { select: { nombre: true } },
            },
          },
          aula: {
            select: { numero: true },
          },
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
    if (horario.aulaGrupoMateria?.grupoMateria?.length > 0) {
      const grupo = horario.aulaGrupoMateria.grupoMateria[0];
      console.log(`   Materia: ${grupo.materia.nombre}`);
      console.log(`   Docente: ${grupo.docente.nombre}`);
    }
    if (horario.aulaGrupoMateria?.aula?.length > 0) {
      console.log(`   Aula: ${horario.aulaGrupoMateria.aula[0].numero}`);
    }
    console.log(`   AulaGrupoMateria ID: ${horario.aulaGrupoMateriaId}\n`);
  });

  await prisma.$disconnect();
}

verifyData().catch(console.error);
