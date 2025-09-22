import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGrupoMateriaDto } from './dto/create-grupo_materia.dto';
import { UpdateGrupoMateriaDto } from './dto/update-grupo_materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GrupoMateria } from '@prisma/client';

@Injectable()
export class GrupoMateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createGrupoMateriaDto: CreateGrupoMateriaDto,
  ): Promise<GrupoMateria> {
    try {
      const createdGrupoMateria = await this.prismaService.grupoMateria.create({
        data: createGrupoMateriaDto,
      });

      return createdGrupoMateria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un grupo de materia con estos datos',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<GrupoMateria[]> {
    return this.prismaService.grupoMateria.findMany({
      where: { estaActivo: true },
      include: {
        materia: { select: { nombre: true } },
        docente: { select: { nombre: true, apellido_paterno: true } },
      },
    });
  }

  async findOne(id: string): Promise<GrupoMateria | null> {
    const foundGrupoMateria = await this.prismaService.grupoMateria.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundGrupoMateria) {
      throw new NotFoundException('Grupo de materia no encontrado');
    }

    return foundGrupoMateria;
  }

  async update(
    id: string,
    updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ): Promise<GrupoMateria> {
    try {
      const updatedGrupoMateria = await this.prismaService.grupoMateria.update({
        where: { id },
        data: updateGrupoMateriaDto,
      });

      return updatedGrupoMateria;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Grupo de materia no encontrado');
      }
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe un grupo de materia con estos datos',
        );
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.grupoMateria.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Grupo de materia eliminado exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Grupo de materia no encontrado');
      }
      throw error;
    }
  }
}
