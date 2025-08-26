import {
  Injectable,
  NotAcceptableException,
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
    const createdDetalleInscripcion =
      await this.prismaService.detalleInscripcion.create({
        data: createDetalleInscripcionDto,
      });
    if (!createdDetalleInscripcion)
      throw new NotAcceptableException('Error creando detalle de inscripción');
    return createdDetalleInscripcion;
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
    const updatedDetalleInscripcion =
      await this.prismaService.detalleInscripcion.update({
        where: { id },
        data: updatedDetalleInscripcionDto,
      });
    if (!updatedDetalleInscripcion)
      throw new NotFoundException('Detalle de inscripción no encontrado');
    return updatedDetalleInscripcion;
  }

  async remove(id: string): Promise<DetalleInscripcion> {
    const deletedDetalleInscripcion =
      await this.prismaService.detalleInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });
    if (!deletedDetalleInscripcion)
      throw new NotFoundException('Detalle de inscripción no encontrado');
    return deletedDetalleInscripcion;
  }
}
