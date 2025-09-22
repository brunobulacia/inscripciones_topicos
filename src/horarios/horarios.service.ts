import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Horario } from '@prisma/client';

@Injectable()
export class HorariosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    try {
      // Verificar conflictos de horario para la misma aula-grupo-materia
      const conflictingHorario = await this.prismaService.horario.findFirst({
        where: {
          aulaGrupoMateriaId: createHorarioDto.aulaGrupoMateriaId,
          diaSemana: createHorarioDto.diaSemana,
          estaActivo: true,
          OR: [
            // Horario nuevo comienza durante un horario existente
            {
              horaInicio: { lte: createHorarioDto.horaInicio },
              horaFin: { gt: createHorarioDto.horaInicio },
            },
            // Horario nuevo termina durante un horario existente
            {
              horaInicio: { lt: createHorarioDto.horaFin },
              horaFin: { gte: createHorarioDto.horaFin },
            },
            // Horario nuevo contiene completamente un horario existente
            {
              horaInicio: { gte: createHorarioDto.horaInicio },
              horaFin: { lte: createHorarioDto.horaFin },
            },
          ],
        },
      });

      if (conflictingHorario) {
        throw new ConflictException(
          `Ya existe un horario que se solapa en ${createHorarioDto.diaSemana} para esta aula-grupo-materia`,
        );
      }

      const createdHorario = await this.prismaService.horario.create({
        data: createHorarioDto,
        include: {
          aulaGrupoMateria: {
            include: {
              grupoMateria: {
                include: {
                  materia: { select: { nombre: true, sigla: true } },
                  docente: { select: { nombre: true, apellido_paterno: true } },
                },
              },
              aula: { select: { numero: true } },
            },
          },
        },
      });

      if (!createdHorario) {
        throw new NotAcceptableException('Error al crear el horario');
      }

      return createdHorario;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el aula-grupo-materia',
        );
      }
      throw new NotAcceptableException('Error al crear el horario');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await this.prismaService.horario.findMany({
        where: { estaActivo: true },
        include: {
          aulaGrupoMateria: {
            include: {
              grupoMateria: {
                include: {
                  materia: { select: { nombre: true, sigla: true } },
                  docente: { select: { nombre: true, apellido_paterno: true } },
                },
              },
              aula: { select: { numero: true } },
            },
          },
        },
        orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
      });
    } catch (error) {
      throw new NotAcceptableException('Error al obtener los horarios');
    }
  }

  async findByAulaGrupoMateria(aulaGrupoMateriaId: string): Promise<Horario[]> {
    try {
      return await this.prismaService.horario.findMany({
        where: {
          aulaGrupoMateriaId,
          estaActivo: true,
        },
        include: {
          aulaGrupoMateria: {
            include: {
              grupoMateria: {
                include: {
                  materia: { select: { nombre: true, sigla: true } },
                  docente: { select: { nombre: true, apellido_paterno: true } },
                },
              },
              aula: { select: { numero: true } },
            },
          },
        },
        orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
      });
    } catch (error) {
      throw new NotAcceptableException(
        'Error al buscar horarios por aula-grupo-materia',
      );
    }
  }

  async findOne(id: string): Promise<Horario | null> {
    try {
      const foundHorario = await this.prismaService.horario.findUnique({
        where: { id, estaActivo: true },
        include: {
          aulaGrupoMateria: {
            include: {
              grupoMateria: {
                include: {
                  materia: { select: { nombre: true, sigla: true } },
                  docente: { select: { nombre: true, apellido_paterno: true } },
                },
              },
              aula: { select: { numero: true } },
            },
          },
        },
      });

      if (!foundHorario) {
        throw new NotFoundException('Horario no encontrado');
      }

      return foundHorario;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Error al buscar el horario');
    }
  }

  async update(
    id: string,
    updateHorarioDto: UpdateHorarioDto,
  ): Promise<Horario> {
    try {
      // Verificar si el horario existe
      const existingHorario = await this.prismaService.horario.findUnique({
        where: { id, estaActivo: true },
      });

      if (!existingHorario) {
        throw new NotFoundException('Horario no encontrado');
      }

      // Si se está actualizando el horario, verificar conflictos
      if (
        updateHorarioDto.horaInicio ||
        updateHorarioDto.horaFin ||
        updateHorarioDto.diaSemana ||
        updateHorarioDto.aulaGrupoMateriaId
      ) {
        const conflictingHorario = await this.prismaService.horario.findFirst({
          where: {
            aulaGrupoMateriaId:
              updateHorarioDto.aulaGrupoMateriaId ||
              existingHorario.aulaGrupoMateriaId,
            diaSemana: updateHorarioDto.diaSemana || existingHorario.diaSemana,
            id: { not: id },
            estaActivo: true,
            OR: [
              {
                horaInicio: {
                  lte:
                    updateHorarioDto.horaInicio || existingHorario.horaInicio,
                },
                horaFin: {
                  gt: updateHorarioDto.horaInicio || existingHorario.horaInicio,
                },
              },
              {
                horaInicio: {
                  lt: updateHorarioDto.horaFin || existingHorario.horaFin,
                },
                horaFin: {
                  gte: updateHorarioDto.horaFin || existingHorario.horaFin,
                },
              },
              {
                horaInicio: {
                  gte:
                    updateHorarioDto.horaInicio || existingHorario.horaInicio,
                },
                horaFin: {
                  lte: updateHorarioDto.horaFin || existingHorario.horaFin,
                },
              },
            ],
          },
        });

        if (conflictingHorario) {
          throw new ConflictException(
            `Ya existe un horario que se solapa en ${updateHorarioDto.diaSemana || existingHorario.diaSemana} para esta aula-grupo-materia`,
          );
        }
      }

      const updatedHorario = await this.prismaService.horario.update({
        where: { id },
        data: updateHorarioDto,
        include: {
          aulaGrupoMateria: {
            include: {
              grupoMateria: {
                include: {
                  materia: { select: { nombre: true, sigla: true } },
                  docente: { select: { nombre: true, apellido_paterno: true } },
                },
              },
              aula: { select: { numero: true } },
            },
          },
        },
      });

      return updatedHorario;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el aula-grupo-materia',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Horario no encontrado');
      }
      throw new NotAcceptableException('Error al actualizar el horario');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const existingHorario = await this.prismaService.horario.findUnique({
        where: { id, estaActivo: true },
      });

      if (!existingHorario) {
        throw new NotFoundException('Horario no encontrado');
      }

      await this.prismaService.horario.update({
        where: { id },
        data: { estaActivo: false },
      });

      return {
        message: 'Horario eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Horario no encontrado');
      }
      throw new NotAcceptableException('Error al eliminar el horario');
    }
  }
}
