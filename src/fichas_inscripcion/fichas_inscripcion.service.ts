import {
  Injectable,
  NotAcceptableException,
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
    const createdFichaInscripcion =
      await this.prismaService.fichaInscripcion.create({
        data: createFichaInscripcionDto,
      });
    if (!createdFichaInscripcion)
      throw new NotAcceptableException('Error creando ficha de inscripción');
    return createdFichaInscripcion;
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
    if (!foundFichaInscripcion)
      throw new NotFoundException('Ficha de inscripción no encontrada');
    return foundFichaInscripcion;
  }

  async update(
    id: string,
    updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ): Promise<FichaInscripcion> {
    const updatedFichaInscripcion =
      await this.prismaService.fichaInscripcion.update({
        where: { id },
        data: updateFichaInscripcionDto,
      });
    if (!updatedFichaInscripcion)
      throw new NotFoundException('Ficha de inscripción no encontrada');
    return updatedFichaInscripcion;
  }

  async remove(id: string): Promise<FichaInscripcion> {
    const deletedFichaInscripcion =
      await this.prismaService.fichaInscripcion.update({
        where: { id },
        data: { estaActivo: false },
      });
    if (!deletedFichaInscripcion)
      throw new NotFoundException('Ficha de inscripción no encontrada');
    return deletedFichaInscripcion;
  }
}
