import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvanceAcademico } from '@prisma/client';
import { CreateAvanceAcademicoDto } from './dto/create-avance_academico.dto';
import { UpdateAvanceAcademicoDto } from './dto/update-avance_academico.dto';

@Injectable()
export class AvanceAcademicoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createAvanceAcademicoDto: CreateAvanceAcademicoDto,
  ): Promise<AvanceAcademico> {
    try {
      const createdAvanceAcademico =
        await this.prismaService.avanceAcademico.create({
          data: createAvanceAcademicoDto,
        });
      return createdAvanceAcademico;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un avance académico con esos datos únicos',
        );
      }
      throw new NotAcceptableException('Error creando avance académico');
    }
  }

  async findAll(): Promise<AvanceAcademico[]> {
    return this.prismaService.avanceAcademico.findMany({
      where: { estaActivo: true },
      include: { estudiante: true, boletaInscripcion: true },
    });
  }

  async findOne(id: string): Promise<AvanceAcademico> {
    const foundAvanceAcademico =
      await this.prismaService.avanceAcademico.findUnique({
        where: { id, estaActivo: true },
        include: { estudiante: true, boletaInscripcion: true },
      });
    if (!foundAvanceAcademico)
      throw new NotFoundException('Avance académico no encontrado');
    return foundAvanceAcademico;
  }

  async update(
    id: string,
    updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ): Promise<AvanceAcademico> {
    try {
      const updatedAvanceAcademico =
        await this.prismaService.avanceAcademico.update({
          where: { id },
          data: updateAvanceAcademicoDto,
        });
      return updatedAvanceAcademico;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un avance académico con esos datos únicos',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Avance académico no encontrado');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.avanceAcademico.update({
        where: { id },
        data: { estaActivo: false },
      });
      return { message: 'Avance académico eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Avance académico no encontrado');
      }
      throw error;
    }
  }
}
