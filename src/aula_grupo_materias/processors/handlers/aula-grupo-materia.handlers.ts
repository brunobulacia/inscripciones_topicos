import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateAulaGrupoMateriaJobData,
  FindAllAulaGrupoMateriaJobData,
  FindOneAulaGrupoMateriaJobData,
  UpdateAulaGrupoMateriaJobData,
  DeleteAulaGrupoMateriaJobData,
} from '../../types/aula-grupo-materia-job.types';

@Injectable()
export class CreateAulaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: CreateAulaGrupoMateriaJobData) {
    try {
      const aulaGrupoMateria = await this.prisma.aulaGrupoMateria.create({
        data: {
          grupoMateriaId: data.grupoMateriaId,
          aulaId: data.aulaId,
          estaActivo: data.estaActivo ?? true,
        },
        include: {
          grupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: {
                include: {
                  gestion: true,
                },
              },
            },
          },
          aula: {
            include: {
              Modulo: true,
            },
          },
          horario: true,
        },
      });

      return {
        success: true,
        data: aulaGrupoMateria,
        message: 'Aula grupo materia creada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe una asignación de aula para este grupo materia',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'El grupo materia o aula especificado no existe',
          details: error.message,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class FindAllAulaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindAllAulaGrupoMateriaJobData = {}) {
    try {
      const { page = 1, limit = 10 } = data;
      const skip = (page - 1) * limit;

      const [aulaGrupoMaterias, total] = await Promise.all([
        this.prisma.aulaGrupoMateria.findMany({
          skip,
          take: limit,
          include: {
            grupoMateria: {
              include: {
                materia: true,
                docente: true,
                periodo: {
                  include: {
                    gestion: true,
                  },
                },
              },
            },
            aula: {
              include: {
                Modulo: true,
              },
            },
            horario: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.aulaGrupoMateria.count(),
      ]);

      return {
        success: true,
        data: aulaGrupoMaterias,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
        message: 'Aula grupo materias obtenidas exitosamente',
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class FindOneAulaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindOneAulaGrupoMateriaJobData) {
    try {
      const aulaGrupoMateria = await this.prisma.aulaGrupoMateria.findUnique({
        where: { id: data.id },
        include: {
          grupoMateria: {
            include: {
              materia: {
                include: {
                  nivel: true,
                  planDeEstudio: {
                    include: {
                      carrera: true,
                    },
                  },
                },
              },
              docente: true,
              periodo: {
                include: {
                  gestion: true,
                },
              },
            },
          },
          aula: {
            include: {
              Modulo: true,
            },
          },
          horario: {
            orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
          },
        },
      });

      if (!aulaGrupoMateria) {
        return {
          success: false,
          error: 'Aula grupo materia no encontrada',
          details: `No se encontró aula grupo materia con ID: ${data.id}`,
        };
      }

      return {
        success: true,
        data: aulaGrupoMateria,
        message: 'Aula grupo materia obtenida exitosamente',
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class UpdateAulaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: UpdateAulaGrupoMateriaJobData) {
    try {
      const { id, ...updateData } = data;

      const aulaGrupoMateria = await this.prisma.aulaGrupoMateria.update({
        where: { id },
        data: updateData,
        include: {
          grupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: {
                include: {
                  gestion: true,
                },
              },
            },
          },
          aula: {
            include: {
              Modulo: true,
            },
          },
          horario: true,
        },
      });

      return {
        success: true,
        data: aulaGrupoMateria,
        message: 'Aula grupo materia actualizada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Aula grupo materia no encontrada',
          details: `No se encontró aula grupo materia con ID: ${data.id}`,
        };
      }
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe una asignación de aula para este grupo materia',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'El grupo materia o aula especificado no existe',
          details: error.message,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class DeleteAulaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: DeleteAulaGrupoMateriaJobData) {
    try {
      const aulaGrupoMateria = await this.prisma.aulaGrupoMateria.delete({
        where: { id: data.id },
      });

      return {
        success: true,
        data: aulaGrupoMateria,
        message: 'Aula grupo materia eliminada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Aula grupo materia no encontrada',
          details: `No se encontró aula grupo materia con ID: ${data.id}`,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error:
            'No se puede eliminar la aula grupo materia porque tiene horarios relacionados',
          details: error.message,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}
