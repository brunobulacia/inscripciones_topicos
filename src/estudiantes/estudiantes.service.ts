import {
  Injectable,
  ConflictException,
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
    try {
      const createdEstudiante = await this.prismaService.estudiante.create({
        data: createEstudianteDto,
      });

      return createdEstudiante;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un estudiante con estos datos');
      }
      throw error;
    }
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
    try {
      const updatedEstudiante = await this.prismaService.estudiante.update({
        where: { id },
        data: updateEstudianteDto,
      });

      return updatedEstudiante;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Estudiante no encontrado');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un estudiante con estos datos');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.estudiante.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Estudiante eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Estudiante no encontrado');
      }
      throw error;
    }
  }
}
