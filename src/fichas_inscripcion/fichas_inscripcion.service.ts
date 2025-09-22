import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FichaInscripcion } from '@prisma/client';
import { CreateFichaInscripcionDto } from './dto/create-ficha_inscripcion.dto';
import { UpdateFichaInscripcionDto } from './dto/update-ficha_inscripcion.dto';

@Injectable()
export class FichasInscripcionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createFichaInscripcionDto: CreateFichaInscripcionDto,
  ): Promise<FichaInscripcion> {
    try {
      const createdFichaInscripcion =
        await this.prismaService.fichaInscripcion.create({
          data: createFichaInscripcionDto,
        });

      return createdFichaInscripcion;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una ficha de inscripción con estos datos',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<FichaInscripcion[]> {
    return this.prismaService.fichaInscripcion.findMany({
      where: { estaActivo: true },
      include: {
        estudiante: true,
        detalleInscripcion: true,
      },
    });
  }

  async findOne(id: string): Promise<FichaInscripcion> {
    const foundFichaInscripcion =
      await this.prismaService.fichaInscripcion.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundFichaInscripcion) {
      throw new NotFoundException('Ficha de inscripción no encontrada');
    }

    return foundFichaInscripcion;
  }

  async update(
    id: string,
    updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ): Promise<FichaInscripcion> {
    try {
      const updatedFichaInscripcion =
        await this.prismaService.fichaInscripcion.update({
          where: { id },
          data: updateFichaInscripcionDto,
        });

      return updatedFichaInscripcion;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Ficha de inscripción no encontrada');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una ficha de inscripción con estos datos',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.fichaInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Ficha de inscripción eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Ficha de inscripción no encontrada');
      }
      throw error;
    }
  }
}
