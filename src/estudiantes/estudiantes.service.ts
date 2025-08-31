import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateEstudianteDto } from './dto/create-estudiante.dto';
import { UpdateEstudianteDto } from './dto/update-estudiante.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Estudiante } from '@prisma/client';
import { PaginationDto } from './dto/pagination.dto';

@Injectable()
export class EstudiantesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    const createdEstudiante = await this.prismaService.estudiante.create({
      data: createEstudianteDto,
    });

    if (!createdEstudiante) {
      throw new NotAcceptableException('Error creando estudiante');
    }

    return createdEstudiante;
  }

  async findAll(paginationDto: PaginationDto): Promise<Estudiante[]> {
    const { page = 0, limit = 10 } = paginationDto;
    return this.prismaService.estudiante.findMany({
      where: { estaActivo: true },
      take: Number(limit),
      skip: page * limit,
    });
  }

  async findOne(id: string): Promise<Estudiante | null> {
    const foundEstudiante = await this.prismaService.estudiante.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundEstudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }
    return foundEstudiante;
  }

  async update(
    id: string,
    updateEstudianteDto: UpdateEstudianteDto,
  ): Promise<Estudiante> {
    const updatedEstudiante = await this.prismaService.estudiante.update({
      where: { id },
      data: updateEstudianteDto,
    });

    if (!updatedEstudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return updatedEstudiante;
  }

  async remove(id: string): Promise<Estudiante> {
    const deletedEstudiante = await this.prismaService.estudiante.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedEstudiante) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    return deletedEstudiante;
  }
}
