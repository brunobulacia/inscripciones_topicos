import {
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
    const createdDetalleInsOferta =
      await this.prismaService.detalleInsOferta.create({
        data: createDetalleInsOfertaDto,
      });

    if (!createdDetalleInsOferta) {
      throw new NotAcceptableException(
        'No se pudo crear el detalle ins oferta',
      );
    }

    return createdDetalleInsOferta;
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
    const updatedDetalleInsOferta =
      await this.prismaService.detalleInsOferta.update({
        where: { id },
        data: updateDetalleInsOfertaDto,
      });

    if (!updatedDetalleInsOferta) {
      throw new NotFoundException('Detalle ins oferta no encontrado');
    }

    return updatedDetalleInsOferta;
  }

  async remove(id: string): Promise<DetalleInsOferta> {
    const deletedDetalleInsOferta =
      await this.prismaService.detalleInsOferta.update({
        where: { id },
        data: { estaActivo: false },
      });

    if (!deletedDetalleInsOferta) {
      throw new NotFoundException('Detalle ins oferta no encontrado');
    }

    return deletedDetalleInsOferta;
  }
}
