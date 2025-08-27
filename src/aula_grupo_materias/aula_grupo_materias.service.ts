import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
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
    const createdAulaGrupoMateria =
      await this.prismaService.aulaGrupoMateria.create({
        data: createAulaGrupoMateriaDto,
      });
    if (!createdAulaGrupoMateria)
      throw new NotAcceptableException('Error creando aula-grupo-materia');
    return createdAulaGrupoMateria;
  }

  async findAll(): Promise<AulaGrupoMateria[]> {
    return this.prismaService.aulaGrupoMateria.findMany({
      where: { estaActivo: true },
      include: {
        grupoMateria: {
          select: {
            id: true,
            nombre: true,
            materia: { select: { nombre: true } },
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
    const updatedAulaGrupoMateria =
      await this.prismaService.aulaGrupoMateria.update({
        where: { id },
        data: updateAulaGrupoMateriaDto,
      });
    if (!updatedAulaGrupoMateria)
      throw new NotFoundException('Aula grupo materia no encontrada');
    return updatedAulaGrupoMateria;
  }

  async remove(id: string): Promise<AulaGrupoMateria> {
    const deletedAulaGrupoMateria =
      await this.prismaService.aulaGrupoMateria.update({
        where: { id },
        data: { estaActivo: false },
      });
    if (!deletedAulaGrupoMateria)
      throw new NotFoundException('Aula grupo materia no encontrada');
    return deletedAulaGrupoMateria;
  }
}
