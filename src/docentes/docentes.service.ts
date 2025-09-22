import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Docente } from '@prisma/client';

@Injectable()
export class DocentesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDocenteDto: CreateDocenteDto): Promise<Docente> {
    try {
      const createdDocente = await this.prismaService.docente.create({
        data: createDocenteDto,
      });

      return createdDocente;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un docente con el mismo ${error.meta?.target?.[0] || 'campo'}`,
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<Docente[]> {
    return this.prismaService.docente.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<Docente | null> {
    const foundDocente = await this.prismaService.docente.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundDocente) {
      throw new NotFoundException('Docente no encontrado');
    }
    return foundDocente;
  }

  async update(
    id: string,
    updateDocenteDto: UpdateDocenteDto,
  ): Promise<Docente> {
    try {
      const updatedDocente = await this.prismaService.docente.update({
        where: { id },
        data: updateDocenteDto,
      });

      return updatedDocente;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Docente no encontrado');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          `Ya existe un docente con el mismo ${error.meta?.target?.[0] || 'campo'}`,
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.docente.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Docente eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Docente no encontrado');
      }
      throw error;
    }
  }
}
