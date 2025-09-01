import {
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
    const createdBoletaGrupoMateria =
      await this.prismaService.boletaGrupoMateria.create({
        data: createBoletaGrupoMateriaDto,
      });

    if (!createdBoletaGrupoMateria) {
      throw new NotAcceptableException(
        'No se pudo crear la boleta grupo materia',
      );
    }

    return createdBoletaGrupoMateria;
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
    const updatedBoletaGrupoMateria =
      await this.prismaService.boletaGrupoMateria.update({
        where: { id },
        data: updateBoletaGrupoMateriaDto,
      });

    if (!updatedBoletaGrupoMateria) {
      throw new NotFoundException('Boleta grupo materia no encontrada');
    }

    return updatedBoletaGrupoMateria;
  }

  async remove(id: string): Promise<BoletaGrupoMateria> {
    const deletedBoletaGrupoMateria =
      await this.prismaService.boletaGrupoMateria.update({
        where: { id },
        data: { estaActivo: false },
      });

    if (!deletedBoletaGrupoMateria) {
      throw new NotFoundException('Boleta grupo materia no encontrada');
    }

    return deletedBoletaGrupoMateria;
  }
}
