import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import {
  CreateGrupoMateriaJobData,
  FindAllGrupoMateriaJobData,
  FindOneGrupoMateriaJobData,
  UpdateGrupoMateriaJobData,
  DeleteGrupoMateriaJobData,
} from '../../types/grupo-materia-job.types';
import { Prisma } from '@prisma/client';

@Injectable()
export class CreateGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: CreateGrupoMateriaJobData) {
    try {
      return await this.prisma.grupoMateria.create({
        data: {
          grupo: data.grupo,
          inscritos: data.inscritos ?? 0,
          cupos: data.cupos ?? 20,
          materiaId: data.materiaId,
          docenteId: data.docenteId,
          periodoId: data.periodoId,
          estaActivo: data.estaActivo ?? true,
        },
        include: {
          materia: true,
          docente: true,
          periodo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(
            `Ya existe un grupo de materia con la combinación id-grupo-periodo especificada`,
          );
        }
        if (error.code === 'P2003') {
          throw new Error(
            `Referencia inválida: materia, docente o periodo no existe`,
          );
        }
      }
      throw error;
    }
  }
}

@Injectable()
export class FindAllGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindAllGrupoMateriaJobData = {}) {
    const { page = 1, limit = 10 } = data;
    const skip = (page - 1) * limit;

    const [grupoMaterias, total] = await Promise.all([
      this.prisma.grupoMateria.findMany({
        skip,
        take: limit,
        where: { estaActivo: true },
        include: {
          materia: true,
          docente: true,
          periodo: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.grupoMateria.count({
        where: { estaActivo: true },
      }),
    ]);

    return {
      data: grupoMaterias,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

@Injectable()
export class FindOneGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindOneGrupoMateriaJobData) {
    const grupoMateria = await this.prisma.grupoMateria.findUnique({
      where: { id: data.id },
      include: {
        materia: true,
        docente: true,
        periodo: true,
        aulaGrupoMateria: {
          include: {
            aula: true,
            horario: true,
          },
        },
        BoletaGrupoMateria: true,
        OfertaGrupoMateria: true,
      },
    });

    if (!grupoMateria || !grupoMateria.estaActivo) {
      throw new Error(`Grupo materia con ID ${data.id} no encontrado`);
    }

    return grupoMateria;
  }
}

@Injectable()
export class UpdateGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: UpdateGrupoMateriaJobData) {
    try {
      return await this.prisma.grupoMateria.update({
        where: { id: data.id },
        data: {
          ...(data.grupo !== undefined && { grupo: data.grupo }),
          ...(data.inscritos !== undefined && { inscritos: data.inscritos }),
          ...(data.cupos !== undefined && { cupos: data.cupos }),
          ...(data.materiaId !== undefined && { materiaId: data.materiaId }),
          ...(data.docenteId !== undefined && { docenteId: data.docenteId }),
          ...(data.periodoId !== undefined && { periodoId: data.periodoId }),
          ...(data.estaActivo !== undefined && { estaActivo: data.estaActivo }),
        },
        include: {
          materia: true,
          docente: true,
          periodo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(
            `Ya existe un grupo de materia con la combinación id-grupo-periodo especificada`,
          );
        }
        if (error.code === 'P2003') {
          throw new Error(
            `Referencia inválida: materia, docente o periodo no existe`,
          );
        }
        if (error.code === 'P2025') {
          throw new Error(`Grupo materia con ID ${data.id} no encontrado`);
        }
      }
      throw error;
    }
  }
}

@Injectable()
export class DeleteGrupoMateriaHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: DeleteGrupoMateriaJobData) {
    try {
      return await this.prisma.grupoMateria.update({
        where: { id: data.id },
        data: { estaActivo: false },
        include: {
          materia: true,
          docente: true,
          periodo: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new Error(`Grupo materia con ID ${data.id} no encontrado`);
        }
      }
      throw error;
    }
  }
}
