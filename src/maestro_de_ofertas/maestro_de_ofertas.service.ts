import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
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
    const createdMaestroDeOferta =
      await this.prismaService.maestroDeOferta.create({
        data: createMaestroDeOfertaDto,
      });

    if (!createdMaestroDeOferta) {
      throw new NotAcceptableException('No se pudo crear el maestro de oferta');
    }

    return createdMaestroDeOferta;
  }

  async findAll(): Promise<MaestroDeOferta[]> {
    return this.prismaService.maestroDeOferta.findMany({
      where: { estaActivo: true },
      include: {
        periodo: { select: { numero: true } },
        estudiante: { select: { nombre: true, apellido_paterno: true } },
      },
    });
  }

  async findOne(id: string): Promise<MaestroDeOferta | null> {
    const foundMaestroDeOferta =
      await this.prismaService.maestroDeOferta.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundMaestroDeOferta) {
      throw new NotFoundException('Maestro de oferta no encontrado');
    }

    return foundMaestroDeOferta;
  }

  async update(
    id: string,
    updateMaestroDeOfertaDto: UpdateMaestroDeOfertaDto,
  ): Promise<MaestroDeOferta> {
    const updatedMaestroDeOferta =
      await this.prismaService.maestroDeOferta.update({
        where: { id },
        data: updateMaestroDeOfertaDto,
      });

    if (!updatedMaestroDeOferta) {
      throw new NotFoundException('Maestro de oferta no encontrado');
    }

    return updatedMaestroDeOferta;
  }

  async remove(id: string): Promise<MaestroDeOferta> {
    const deletedMaestroDeOferta =
      await this.prismaService.maestroDeOferta.update({
        where: { id },
        data: { estaActivo: false },
      });

    if (!deletedMaestroDeOferta) {
      throw new NotFoundException('Maestro de oferta no encontrado');
    }

    return deletedMaestroDeOferta;
  }
}
