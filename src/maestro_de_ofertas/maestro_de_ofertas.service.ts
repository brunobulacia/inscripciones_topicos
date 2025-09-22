import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CreateMaestroDeOfertaDto } from './dto/create-maestro_de_oferta.dto';
import { UpdateMaestroDeOfertaDto } from './dto/update-maestro_de_oferta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MaestroDeOferta } from '@prisma/client';

@Injectable()
export class MaestroDeOfertasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createMaestroDeOfertaDto: CreateMaestroDeOfertaDto,
  ): Promise<MaestroDeOferta> {
    try {
      // Verificar si ya existe un maestro de oferta para el mismo período y estudiante
      const existingMaestroDeOferta =
        await this.prismaService.maestroDeOferta.findFirst({
          where: {
            periodoId: createMaestroDeOfertaDto.periodoId,
            estudianteId: createMaestroDeOfertaDto.estudianteId,
            estaActivo: true,
          },
        });

      if (existingMaestroDeOferta) {
        throw new ConflictException(
          'Ya existe un maestro de oferta para este período y estudiante',
        );
      }

      const createdMaestroDeOferta =
        await this.prismaService.maestroDeOferta.create({
          data: createMaestroDeOfertaDto,
        });

      if (!createdMaestroDeOferta) {
        throw new NotAcceptableException('Error al crear el maestro de oferta');
      }

      return createdMaestroDeOferta;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un maestro de oferta con esta combinación',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el período y estudiante',
        );
      }
      throw new NotAcceptableException('Error al crear el maestro de oferta');
    }
  }

  async findAll(): Promise<MaestroDeOferta[]> {
    try {
      return await this.prismaService.maestroDeOferta.findMany({
        where: { estaActivo: true },
        include: {
          periodo: { select: { numero: true } },
          estudiante: {
            select: {
              nombre: true,
              apellido_paterno: true,
              apellido_materno: true,
              ci: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      throw new NotAcceptableException(
        'Error al obtener los maestros de ofertas',
      );
    }
  }

  async findOne(id: string): Promise<MaestroDeOferta | null> {
    try {
      const foundMaestroDeOferta =
        await this.prismaService.maestroDeOferta.findUnique({
          where: { id, estaActivo: true },
          include: {
            periodo: { select: { numero: true } },
            estudiante: {
              select: {
                nombre: true,
                apellido_paterno: true,
                apellido_materno: true,
                ci: true,
              },
            },
          },
        });

      if (!foundMaestroDeOferta) {
        throw new NotFoundException('Maestro de oferta no encontrado');
      }

      return foundMaestroDeOferta;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotAcceptableException('Error al buscar el maestro de oferta');
    }
  }

  async update(
    id: string,
    updateMaestroDeOfertaDto: UpdateMaestroDeOfertaDto,
  ): Promise<MaestroDeOferta> {
    try {
      // Verificar si el maestro de oferta existe
      const existingMaestroDeOferta =
        await this.prismaService.maestroDeOferta.findUnique({
          where: { id, estaActivo: true },
        });

      if (!existingMaestroDeOferta) {
        throw new NotFoundException('Maestro de oferta no encontrado');
      }

      // Si se está actualizando el período o estudiante, verificar que no exista otra combinación igual
      if (
        (updateMaestroDeOfertaDto.periodoId &&
          updateMaestroDeOfertaDto.periodoId !==
            existingMaestroDeOferta.periodoId) ||
        (updateMaestroDeOfertaDto.estudianteId &&
          updateMaestroDeOfertaDto.estudianteId !==
            existingMaestroDeOferta.estudianteId)
      ) {
        const conflictingMaestroDeOferta =
          await this.prismaService.maestroDeOferta.findFirst({
            where: {
              periodoId:
                updateMaestroDeOfertaDto.periodoId ||
                existingMaestroDeOferta.periodoId,
              estudianteId:
                updateMaestroDeOfertaDto.estudianteId ||
                existingMaestroDeOferta.estudianteId,
              id: { not: id },
              estaActivo: true,
            },
          });

        if (conflictingMaestroDeOferta) {
          throw new ConflictException(
            'Ya existe un maestro de oferta para este período y estudiante',
          );
        }
      }

      const updatedMaestroDeOferta =
        await this.prismaService.maestroDeOferta.update({
          where: { id },
          data: updateMaestroDeOfertaDto,
        });

      return updatedMaestroDeOferta;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un maestro de oferta con esta combinación',
        );
      }
      if (error.code === 'P2003') {
        throw new BadRequestException(
          'Referencias inválidas: verifica el período y estudiante',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Maestro de oferta no encontrado');
      }
      throw new NotAcceptableException(
        'Error al actualizar el maestro de oferta',
      );
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const existingMaestroDeOferta =
        await this.prismaService.maestroDeOferta.findUnique({
          where: { id, estaActivo: true },
        });

      if (!existingMaestroDeOferta) {
        throw new NotFoundException('Maestro de oferta no encontrado');
      }

      await this.prismaService.maestroDeOferta.update({
        where: { id },
        data: { estaActivo: false },
      });

      return {
        message: 'Maestro de oferta eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Maestro de oferta no encontrado');
      }
      throw new NotAcceptableException(
        'Error al eliminar el maestro de oferta',
      );
    }
  }
}
