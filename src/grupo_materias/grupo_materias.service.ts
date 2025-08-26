import {
  Injectable,
  NotAcceptableException,
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
    const createdGrupoMateria = await this.prismaService.grupoMateria.create({
      data: createGrupoMateriaDto,
    });

    if (!createdGrupoMateria) {
      throw new NotAcceptableException('No se pudo crear el grupo materia');
    }

    return createdGrupoMateria;
  }

  async findAll(): Promise<GrupoMateria[]> {
    return this.prismaService.grupoMateria.findMany({
      where: { estaActivo: true },
      include: { horarios: true },
    });
  }

  async findOne(id: string): Promise<GrupoMateria | null> {
    const foundGrupoMateria = await this.prismaService.grupoMateria.findUnique({
      where: { id, estaActivo: true },
      include: { horarios: true },
    });

    if (!foundGrupoMateria) {
      throw new NotFoundException('Grupo materia no encontrado');
    }

    return foundGrupoMateria;
  }

  async update(
    id: string,
    updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ): Promise<GrupoMateria> {
    const updatedGrupoMateria = await this.prismaService.grupoMateria.update({
      where: { id },
      data: updateGrupoMateriaDto,
    });

    if (!updatedGrupoMateria) {
      throw new NotFoundException('Grupo materia no encontrado');
    }

    return updatedGrupoMateria;
  }

  async remove(id: string): Promise<GrupoMateria> {
    const deletedGrupoMateria = await this.prismaService.grupoMateria.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedGrupoMateria) {
      throw new NotFoundException('Grupo materia no encontrado');
    }

    return deletedGrupoMateria;
  }
}
