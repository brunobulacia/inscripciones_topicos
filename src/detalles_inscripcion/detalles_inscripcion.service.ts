import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { DetalleInscripcion } from '@prisma/client';
import { CreateDetalleInscripcionDto } from './dto/create-detalle_inscripcion.dto';
import { UpdateDetalleInscripcionDto } from './dto/update-detalle_inscripcion.dto';

@Injectable()
export class DetallesInscripcionService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createDetalleInscripcionDto: CreateDetalleInscripcionDto,
  ): Promise<DetalleInscripcion> {
    try {
      const createdDetalleInscripcion =
        await this.prismaService.detalleInscripcion.create({
          data: createDetalleInscripcionDto,
        });
      return createdDetalleInscripcion;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un detalle de inscripción con el mismo ${error.meta?.target?.[0] || 'campo'}`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<DetalleInscripcion[]> {
    return this.prismaService.detalleInscripcion.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<DetalleInscripcion> {
    const foundDetalleInscripcion =
      await this.prismaService.detalleInscripcion.findUnique({
        where: { id, estaActivo: true },
      });
    if (!foundDetalleInscripcion)
      throw new NotFoundException('Detalle de inscripción no encontrado');
    return foundDetalleInscripcion;
  }

  async update(
    id: string,
    updatedDetalleInscripcionDto: UpdateDetalleInscripcionDto,
  ): Promise<DetalleInscripcion> {
    try {
      const updatedDetalleInscripcion =
        await this.prismaService.detalleInscripcion.update({
          where: { id },
          data: updatedDetalleInscripcionDto,
        });
      return updatedDetalleInscripcion;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Detalle de inscripción no encontrado');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un detalle de inscripción con el mismo ${error.meta?.target?.[0] || 'campo'}`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.detalleInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });
      return { message: 'Detalle de inscripción eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Detalle de inscripción no encontrado');
      }
      throw error;
    }
  }
}
