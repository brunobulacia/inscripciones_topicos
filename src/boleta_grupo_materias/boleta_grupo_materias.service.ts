import {
  ConflictException,
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBoletaGrupoMateriaDto } from './dto/create-boleta_grupo_materia.dto';
import { UpdateBoletaGrupoMateriaDto } from './dto/update-boleta_grupo_materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BoletaGrupoMateria } from '@prisma/client';

@Injectable()
export class BoletaGrupoMateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createBoletaGrupoMateriaDto: CreateBoletaGrupoMateriaDto,
  ): Promise<BoletaGrupoMateria> {
    try {
      const createdBoletaGrupoMateria =
        await this.prismaService.boletaGrupoMateria.create({
          data: createBoletaGrupoMateriaDto,
        });
      return createdBoletaGrupoMateria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una boleta grupo materia con esos datos únicos',
        );
      }
      throw new NotAcceptableException(
        'No se pudo crear la boleta grupo materia',
      );
    }
  }

  async findAll(): Promise<BoletaGrupoMateria[]> {
    return this.prismaService.boletaGrupoMateria.findMany({
      where: { estaActivo: true },
      include: {
        boletaInscripcion: { select: { id: true } },
        grupoMateria: { select: { grupo: true } },
      },
    });
  }

  async findOne(id: string): Promise<BoletaGrupoMateria | null> {
    const foundBoletaGrupoMateria =
      await this.prismaService.boletaGrupoMateria.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundBoletaGrupoMateria) {
      throw new NotFoundException('Boleta grupo materia no encontrada');
    }

    return foundBoletaGrupoMateria;
  }

  async update(
    id: string,
    updateBoletaGrupoMateriaDto: UpdateBoletaGrupoMateriaDto,
  ): Promise<BoletaGrupoMateria> {
    try {
      const updatedBoletaGrupoMateria =
        await this.prismaService.boletaGrupoMateria.update({
          where: { id },
          data: updateBoletaGrupoMateriaDto,
        });
      return updatedBoletaGrupoMateria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una boleta grupo materia con esos datos únicos',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Boleta grupo materia no encontrada');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.boletaGrupoMateria.update({
        where: { id },
        data: { estaActivo: false },
      });
      return { message: 'Boleta grupo materia eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Boleta grupo materia no encontrada');
      }
      throw error;
    }
  }
}
