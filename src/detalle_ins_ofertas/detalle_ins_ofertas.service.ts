import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDetalleInsOfertaDto } from './dto/create-detalle_ins_oferta.dto';
import { UpdateDetalleInsOfertaDto } from './dto/update-detalle_ins_oferta.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DetalleInsOferta } from '@prisma/client';

@Injectable()
export class DetalleInsOfertasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createDetalleInsOfertaDto: CreateDetalleInsOfertaDto,
  ): Promise<DetalleInsOferta> {
    try {
      const createdDetalleInsOferta =
        await this.prismaService.detalleInsOferta.create({
          data: createDetalleInsOfertaDto,
        });

      return createdDetalleInsOferta;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un detalle ins oferta con esos datos únicos',
        );
      }
      throw new NotAcceptableException(
        'No se pudo crear el detalle ins oferta',
      );
    }
  }

  async findAll(): Promise<DetalleInsOferta[]> {
    return this.prismaService.detalleInsOferta.findMany({
      where: { estaActivo: true },
      include: {
        detalleInscripcion: { select: { id: true } },
        OfertaGrupoMateria: { select: { id: true } },
      },
    });
  }

  async findOne(id: string): Promise<DetalleInsOferta | null> {
    const foundDetalleInsOferta =
      await this.prismaService.detalleInsOferta.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundDetalleInsOferta) {
      throw new NotFoundException('Detalle ins oferta no encontrado');
    }

    return foundDetalleInsOferta;
  }

  async update(
    id: string,
    updateDetalleInsOfertaDto: UpdateDetalleInsOfertaDto,
  ): Promise<DetalleInsOferta> {
    try {
      const updatedDetalleInsOferta =
        await this.prismaService.detalleInsOferta.update({
          where: { id },
          data: updateDetalleInsOfertaDto,
        });

      return updatedDetalleInsOferta;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un detalle ins oferta con esos datos únicos',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Detalle ins oferta no encontrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.detalleInsOferta.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Detalle ins oferta eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Detalle ins oferta no encontrado');
      }
      throw error;
    }
  }
}
