import {
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
    const createdBoletaInscripcion =
      await this.prismaService.boletaInscripcion.create({
        data: createBoletaInscripcionDto,
      });
    if (!createdBoletaInscripcion)
      throw new NotAcceptableException('Error creando boleta de inscripción');
    return createdBoletaInscripcion;
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
    const updated = await this.prismaService.boletaInscripcion.update({
      where: { id },
      data: updateBoletaInscripcionDto,
    });
    if (!updated)
      throw new NotFoundException('Boleta de inscripción no encontrada');
    return updated;
  }

  async remove(id: string): Promise<BoletaInscripcion> {
    const deletedBoletaInscripcion =
      await this.prismaService.boletaInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });
    if (!deletedBoletaInscripcion)
      throw new NotFoundException('Boleta de inscripción no encontrada');
    return deletedBoletaInscripcion;
  }
}
