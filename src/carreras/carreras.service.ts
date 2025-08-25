import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCarreraDto } from './dto/create-carrera.dto';
import { UpdateCarreraDto } from './dto/update-carrera.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Carrera } from '@prisma/client';

@Injectable()
export class CarrerasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createCarreraDto: CreateCarreraDto): Promise<Carrera> {
    const createdCarrera = await this.prismaService.carrera.create({
      data: createCarreraDto,
    });

    if (!createdCarrera) {
      throw new NotAcceptableException('Error al crear carrera');
    }

    return createdCarrera;
  }

  async findAll(): Promise<Carrera[]> {
    return this.prismaService.carrera.findMany({
      where: { estaActivo: true },
      include: { planDeEstudio: { select: { id: true } } },
    });
  }

  async findOne(id: string): Promise<Carrera | null> {
    const foundCarrera = await this.prismaService.carrera.findUnique({
      where: { id, estaActivo: true },
      include: { planDeEstudio: { select: { id: true } } },
    });

    if (!foundCarrera) {
      throw new NotFoundException(`Carrera con id ${id} no encontrada`);
    }

    return foundCarrera;
  }

  async update(
    id: string,
    updateCarreraDto: UpdateCarreraDto,
  ): Promise<Carrera> {
    const updatedCarrera = await this.prismaService.carrera.update({
      where: { id },
      data: updateCarreraDto,
    });

    if (!updatedCarrera) {
      throw new NotFoundException('Error al actualizar carrera');
    }

    return updatedCarrera;
  }

  async remove(id: string): Promise<Carrera> {
    const deletedCarrera = await this.prismaService.carrera.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedCarrera) {
      throw new NotFoundException('Error al borrar carrera');
    }

    return deletedCarrera;
  }
}
