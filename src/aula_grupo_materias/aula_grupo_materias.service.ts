import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AulaGrupoMateria } from '@prisma/client';
import { CreateAulaGrupoMateriaDto } from './dto/create-aula_grupo_materia.dto';
import { UpdateAulaGrupoMateriaDto } from './dto/update-aula_grupo_materia.dto';

@Injectable()
export class AulaGrupoMateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto,
  ): Promise<AulaGrupoMateria> {
    try {
      const createdAulaGrupoMateria =
        await this.prismaService.aulaGrupoMateria.create({
          data: createAulaGrupoMateriaDto,
        });
      if (!createdAulaGrupoMateria)
        throw new NotAcceptableException('Error creando aula-grupo-materia');
      return createdAulaGrupoMateria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una relación aula-grupo-materia con estos datos',
        );
      }
      throw error;
    }
  }

  async findAll(): Promise<AulaGrupoMateria[]> {
    return this.prismaService.aulaGrupoMateria.findMany({
      where: { estaActivo: true },
      include: {
        grupoMateria: {
          select: {
            id: true,
            grupo: true,
            materia: { select: { nombre: true } },
            docente: { select: { nombre: true, apellido_paterno: true } },
          },
        },
      },
    });
  }

  async findOne(id: string): Promise<AulaGrupoMateria> {
    const foundAulaGrupoMateria =
      await this.prismaService.aulaGrupoMateria.findUnique({
        where: { id, estaActivo: true },
      });
    if (!foundAulaGrupoMateria)
      throw new NotFoundException('Aula grupo materia no encontrada');
    return foundAulaGrupoMateria;
  }

  async update(
    id: string,
    updateAulaGrupoMateriaDto: UpdateAulaGrupoMateriaDto,
  ): Promise<AulaGrupoMateria> {
    try {
      const updatedAulaGrupoMateria =
        await this.prismaService.aulaGrupoMateria.update({
          where: { id },
          data: updateAulaGrupoMateriaDto,
        });
      if (!updatedAulaGrupoMateria)
        throw new NotFoundException('Aula grupo materia no encontrada');
      return updatedAulaGrupoMateria;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'Ya existe una relación aula-grupo-materia con estos datos',
        );
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Aula grupo materia no encontrada');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedAulaGrupoMateria =
        await this.prismaService.aulaGrupoMateria.update({
          where: { id },
          data: { estaActivo: false },
        });
      if (!deletedAulaGrupoMateria)
        throw new NotFoundException('Aula grupo materia no encontrada');
      return { message: 'Relación aula-grupo-materia eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Aula grupo materia no encontrada');
      }
      throw error;
    }
  }
}
