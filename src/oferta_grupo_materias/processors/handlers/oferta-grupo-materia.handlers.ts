import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateOfertaGrupoMateriaJobData,
  FindAllOfertaGrupoMateriaJobData,
  FindOneOfertaGrupoMateriaJobData,
  UpdateOfertaGrupoMateriaJobData,
  DeleteOfertaGrupoMateriaJobData,
} from '../../types/oferta-grupo-materia-job.types';

@Injectable()
export class CreateOfertaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: CreateOfertaGrupoMateriaJobData) {
    try {
      return await this.prisma.ofertaGrupoMateria.create({
        data: {
          grupoMateriaId: data.grupoMateriaId,
          maestroDeOfertaId: data.maestroDeOfertaId,
          estaActivo: data.estaActivo ?? true,
        },
        include: {
          GrupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: true,
            },
          },
          MaestroDeOferta: {
            include: {
              estudiante: true,
              periodo: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(
          `Ya existe una oferta para este grupo de materia y maestro de oferta`,
        );
      }
      if (error.code === 'P2003') {
        throw new Error(
          `Error de referencia: Grupo de materia o maestro de oferta no encontrado`,
        );
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllOfertaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindAllOfertaGrupoMateriaJobData) {
    const { page = 1, limit = 10 } = data;
    const skip = (page - 1) * limit;

    const [ofertas, total] = await Promise.all([
      this.prisma.ofertaGrupoMateria.findMany({
        skip,
        take: limit,
        where: {
          estaActivo: true,
        },
        include: {
          GrupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: true,
            },
          },
          MaestroDeOferta: {
            include: {
              estudiante: true,
              periodo: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.ofertaGrupoMateria.count({
        where: {
          estaActivo: true,
        },
      }),
    ]);

    return {
      data: ofertas,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }
}

@Injectable()
export class FindOneOfertaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindOneOfertaGrupoMateriaJobData) {
    const oferta = await this.prisma.ofertaGrupoMateria.findUnique({
      where: {
        id: data.id,
      },
      include: {
        GrupoMateria: {
          include: {
            materia: true,
            docente: true,
            periodo: true,
          },
        },
        MaestroDeOferta: {
          include: {
            estudiante: true,
            periodo: true,
          },
        },
        DetalleInsOferta: true,
      },
    });

    if (!oferta) {
      throw new Error(`Oferta grupo materia con ID ${data.id} no encontrada`);
    }

    return oferta;
  }
}

@Injectable()
export class UpdateOfertaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: UpdateOfertaGrupoMateriaJobData) {
    try {
      const { id, ...updateData } = data;

      const oferta = await this.prisma.ofertaGrupoMateria.findUnique({
        where: { id },
      });

      if (!oferta) {
        throw new Error(`Oferta grupo materia con ID ${id} no encontrada`);
      }

      return await this.prisma.ofertaGrupoMateria.update({
        where: { id },
        data: updateData,
        include: {
          GrupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: true,
            },
          },
          MaestroDeOferta: {
            include: {
              estudiante: true,
              periodo: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new Error(
          `Ya existe una oferta para este grupo de materia y maestro de oferta`,
        );
      }
      if (error.code === 'P2003') {
        throw new Error(
          `Error de referencia: Grupo de materia o maestro de oferta no encontrado`,
        );
      }
      if (error.code === 'P2025') {
        throw new Error(`Oferta grupo materia con ID ${data.id} no encontrada`);
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteOfertaGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: DeleteOfertaGrupoMateriaJobData) {
    try {
      const oferta = await this.prisma.ofertaGrupoMateria.findUnique({
        where: { id: data.id },
      });

      if (!oferta) {
        throw new Error(`Oferta grupo materia con ID ${data.id} no encontrada`);
      }

      // Eliminación lógica
      return await this.prisma.ofertaGrupoMateria.update({
        where: { id: data.id },
        data: {
          estaActivo: false,
        },
        include: {
          GrupoMateria: {
            include: {
              materia: true,
              docente: true,
              periodo: true,
            },
          },
          MaestroDeOferta: {
            include: {
              estudiante: true,
              periodo: true,
            },
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new Error(`Oferta grupo materia con ID ${data.id} no encontrada`);
      }
      throw error;
    }
  }
}
