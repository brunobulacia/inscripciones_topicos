import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateMateriaJobData,
  FindAllMateriaJobData,
  FindOneMateriaJobData,
  UpdateMateriaJobData,
  DeleteMateriaJobData,
} from '../../types/materia-job.types';

@Injectable()
export class CreateMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: CreateMateriaJobData) {
    try {
      const materia = await this.prisma.materia.create({
        data: {
          sigla: data.sigla,
          nombre: data.nombre,
          creditos: data.creditos,
          esElectiva: data.esElectiva ?? false,
          estaActiva: data.estaActiva ?? true,
          nivelId: data.nivelId,
          planDeEstudioId: data.planDeEstudioId,
        },
        include: {
          nivel: true,
          planDeEstudio: {
            include: {
              carrera: true,
            },
          },
        },
      });

      return {
        success: true,
        data: materia,
        message: 'Materia creada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe una materia con esa sigla',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'El nivel o plan de estudio especificado no existe',
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
export class FindAllMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindAllMateriaJobData = {}) {
    try {
      const { page = 1, limit = 10 } = data;
      const skip = (page - 1) * limit;

      const [materias, total] = await Promise.all([
        this.prisma.materia.findMany({
          skip,
          take: limit,
          include: {
            nivel: true,
            planDeEstudio: {
              include: {
                carrera: true,
              },
            },
            grupoMateria: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }),
        this.prisma.materia.count(),
      ]);

      return {
        success: true,
        data: materias,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
        message: 'Materias obtenidas exitosamente',
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
export class FindOneMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindOneMateriaJobData) {
    try {
      const materia = await this.prisma.materia.findUnique({
        where: { id: data.id },
        include: {
          nivel: true,
          planDeEstudio: {
            include: {
              carrera: true,
            },
          },
          grupoMateria: {
            include: {
              docente: true,
              periodo: {
                include: {
                  gestion: true,
                },
              },
            },
          },
          siglaMateria: {
            include: {
              prerequisito: true,
            },
          },
          siglaPrerequisito: {
            include: {
              materia: true,
            },
          },
        },
      });

      if (!materia) {
        return {
          success: false,
          error: 'Materia no encontrada',
          details: `No se encontró materia con ID: ${data.id}`,
        };
      }

      return {
        success: true,
        data: materia,
        message: 'Materia obtenida exitosamente',
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
export class UpdateMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: UpdateMateriaJobData) {
    try {
      const { id, ...updateData } = data;

      const materia = await this.prisma.materia.update({
        where: { id },
        data: updateData,
        include: {
          nivel: true,
          planDeEstudio: {
            include: {
              carrera: true,
            },
          },
        },
      });

      return {
        success: true,
        data: materia,
        message: 'Materia actualizada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Materia no encontrada',
          details: `No se encontró materia con ID: ${data.id}`,
        };
      }
      if (error.code === 'P2002') {
        return {
          success: false,
          error: 'Ya existe una materia con esa sigla',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'El nivel o plan de estudio especificado no existe',
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
export class DeleteMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: DeleteMateriaJobData) {
    try {
      const materia = await this.prisma.materia.delete({
        where: { id: data.id },
      });

      return {
        success: true,
        data: materia,
        message: 'Materia eliminada exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Materia no encontrada',
          details: `No se encontró materia con ID: ${data.id}`,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error:
            'No se puede eliminar la materia porque tiene registros relacionados',
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
