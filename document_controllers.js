// Script para documentar automáticamente todos los controladores
const fs = require('fs');
const path = require('path');

const controllers = [
  {
    name: 'niveles',
    tag: 'niveles',
    description: 'Niveles Académicos',
    schema: {
      semestre: { type: 'number', example: 1 },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'prerequisitos',
    tag: 'prerequisitos',
    description: 'Prerequisites',
    schema: {
      siglaMateria: { type: 'string', example: 'uuid-materia' },
      siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
      esActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'grupo_materias',
    tag: 'grupo-materias',
    description: 'Grupos de Materias',
    schema: {
      nombre: { type: 'string', example: 'Grupo A' },
      materiaId: { type: 'string', example: 'uuid-materia' },
      docenteId: { type: 'string', example: 'uuid-docente' },
      detalleInscripcionId: { type: 'string', example: 'uuid-detalle' },
      aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
      periodoId: { type: 'string', example: 'uuid-periodo' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'detalles_inscripcion',
    tag: 'detalles-inscripcion',
    description: 'Detalles de Inscripción',
    schema: {
      fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'modulos',
    tag: 'modulos',
    description: 'Módulos',
    schema: {
      numero: { type: 'number', example: 1 },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'aulas',
    tag: 'aulas',
    description: 'Aulas',
    schema: {
      numero: { type: 'number', example: 101 },
      capacidad: { type: 'number', example: 30 },
      aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
      moduloId: { type: 'string', example: 'uuid-modulo' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'gestiones',
    tag: 'gestiones',
    description: 'Gestiones',
    schema: {
      año: { type: 'string', example: '2024' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'periodos',
    tag: 'periodos',
    description: 'Periodos',
    schema: {
      numero: { type: 'string', example: 'I-2024' },
      fechaInicio: { type: 'string', format: 'date-time', example: '2024-03-01T00:00:00Z' },
      fechaFin: { type: 'string', format: 'date-time', example: '2024-07-31T23:59:59Z' },
      gestionId: { type: 'string', example: 'uuid-gestion' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'boleta_inscripcion',
    tag: 'boleta-inscripcion',
    description: 'Boletas de Inscripción',
    schema: {
      fichaInscripcionId: { type: 'string', example: 'uuid-ficha' },
      avanceAcademicoId: { type: 'string', example: 'uuid-avance' },
      estudianteId: { type: 'string', example: 'uuid-estudiante' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'avance_academico',
    tag: 'avance-academico',
    description: 'Avance Académico',
    schema: {
      estudianteId: { type: 'string', example: 'uuid-estudiante' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'horarios',
    tag: 'horarios',
    description: 'Horarios',
    schema: {
      diaSemana: { type: 'string', example: 'Lunes' },
      horaInicio: { type: 'string', example: '08:00' },
      horaFin: { type: 'string', example: '10:00' },
      aulaGrupoMateriaId: { type: 'string', example: 'uuid-aula-grupo' },
      estaActivo: { type: 'boolean', example: true }
    }
  },
  {
    name: 'aula_grupo_materias',
    tag: 'aula-grupo-materias',
    description: 'Aula Grupo Materias',
    schema: {
      estaActivo: { type: 'boolean', example: true }
    }
  }
];

console.log('Controladores para documentar:');
controllers.forEach(controller => {
  console.log(`- ${controller.name} (${controller.description})`);
});
