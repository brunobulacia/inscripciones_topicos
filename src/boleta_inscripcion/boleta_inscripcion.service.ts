import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoletaInscripcion } from '@prisma/client';
import { CreateBoletaInscripcionDto } from './dto/create-boleta_inscripcion.dto';
import { UpdateBoletaInscripcionDto } from './dto/update-boleta_inscripcion.dto';

@Injectable()
export class BoletaInscripcionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createBoletaInscripcionDto: CreateBoletaInscripcionDto,
  ): Promise<BoletaInscripcion> {
    try {
      const createdBoletaInscripcion =
        await this.prismaService.boletaInscripcion.create({
          data: createBoletaInscripcionDto,
        });
      return createdBoletaInscripcion;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una boleta de inscripción con esos datos únicos',
        );
      }
      throw new NotAcceptableException('Error creando boleta de inscripción');
    }
  }

  async findAll(): Promise<BoletaInscripcion[]> {
    return this.prismaService.boletaInscripcion.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<BoletaInscripcion> {
    const foundBoletaInscripcion =
      await this.prismaService.boletaInscripcion.findUnique({
        where: { id, estaActivo: true },
      });
    if (!foundBoletaInscripcion)
      throw new NotFoundException('Boleta de inscripción no encontrada');
    return foundBoletaInscripcion;
  }

  async update(
    id: string,
    updateBoletaInscripcionDto: UpdateBoletaInscripcionDto,
  ): Promise<BoletaInscripcion> {
    try {
      const updated = await this.prismaService.boletaInscripcion.update({
        where: { id },
        data: updateBoletaInscripcionDto,
      });
      return updated;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una boleta de inscripción con esos datos únicos',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Boleta de inscripción no encontrada');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.boletaInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });
      return { message: 'Boleta de inscripción eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Boleta de inscripción no encontrada');
      }
      throw error;
    }
  }
}
