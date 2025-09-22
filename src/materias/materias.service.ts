import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Materia } from '@prisma/client';

@Injectable()
export class MateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    try {
      // Verificar si ya existe una materia con la misma sigla
      const existingMateria = await this.prismaService.materia.findFirst({
        where: {
          sigla: createMateriaDto.sigla,
          estaActiva: true,
        },
      });

      if (existingMateria) {
        throw new ConflictException(
          `Ya existe una materia con la sigla "${createMateriaDto.sigla}"`,
        );
      }

      const createdMateria = await this.prismaService.materia.create({
        data: createMateriaDto,
      });

      if (!createdMateria) {
        throw new NotAcceptableException('Error al crear la materia');
      }

      return createdMateria;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('La sigla de materia ya existe');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el nivel y plan de estudio',
        );
      }
      throw new NotAcceptableException('Error al crear la materia');
    }
  }

  async findAll(): Promise<any[]> {
    try {
      return await this.prismaService.materia.findMany({
        where: { estaActiva: true },
        include: {
          planDeEstudio: { select: { carrera: true, version: true } },
          nivel: true,
        },
        orderBy: { nombre: 'asc' },
      });
    } catch (error) {
      throw new NotAcceptableException('Error al obtener las materias');
    }
  }

  async findOne(id: string): Promise<Materia | null> {
    try {
      const foundMateria = await this.prismaService.materia.findUnique({
        where: { id, estaActiva: true },
        include: {
          planDeEstudio: { select: { carrera: true, version: true } },
          nivel: true,
        },
      });

      if (!foundMateria) {
        throw new NotFoundException('Materia no encontrada');
      }

      return foundMateria;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Error al buscar la materia');
    }
  }

  async update(
    id: string,
    updateMateriaDto: UpdateMateriaDto,
  ): Promise<Materia | null> {
    try {
      // Verificar si la materia existe
      const existingMateria = await this.prismaService.materia.findUnique({
        where: { id, estaActiva: true },
      });

      if (!existingMateria) {
        throw new NotFoundException('Materia no encontrada');
      }

      // Si se está actualizando la sigla, verificar que no exista otra con la misma sigla
      if (
        updateMateriaDto.sigla &&
        updateMateriaDto.sigla !== existingMateria.sigla
      ) {
        const materiaWithSigla = await this.prismaService.materia.findFirst({
          where: {
            sigla: updateMateriaDto.sigla,
            id: { not: id },
            estaActiva: true,
          },
        });

        if (materiaWithSigla) {
          throw new ConflictException(
            `Ya existe una materia con la sigla "${updateMateriaDto.sigla}"`,
          );
        }
      }

      const updatedMateria = await this.prismaService.materia.update({
        where: { id },
        data: updateMateriaDto,
      });

      return updatedMateria;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException('La sigla de materia ya existe');
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el nivel y plan de estudio',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Materia no encontrada');
      }
      throw new NotAcceptableException('Error al actualizar la materia');
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const existingMateria = await this.prismaService.materia.findUnique({
        where: { id, estaActiva: true },
      });

      if (!existingMateria) {
        throw new NotFoundException('Materia no encontrada');
      }

      await this.prismaService.materia.update({
        where: { id },
        data: { estaActiva: false },
      });

      return {
        message: 'Materia eliminada exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Materia no encontrada');
      }
      throw new NotAcceptableException('Error al eliminar la materia');
    }
  }
}
