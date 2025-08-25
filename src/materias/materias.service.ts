import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateMateriaDto } from './dto/create-materia.dto';
import { UpdateMateriaDto } from './dto/update-materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Materia } from '@prisma/client';

@Injectable()
export class MateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createMateriaDto: CreateMateriaDto): Promise<Materia> {
    const createdMateria = await this.prismaService.materia.create({
      data: createMateriaDto,
    });

    if (!createdMateria) {
      throw new NotAcceptableException('Materia not created');
    }

    return createdMateria;
  }

  async findAll(): Promise<Materia[]> {
    return this.prismaService.materia.findMany({
      where: { estaActiva: true },
      include: {
        grupoMateria: { select: { id: true, nombre: true } },
      },
    });
  }

  //NOS QUEDAMOS AQUI EN ARMAR LA MALLA DE INFORMATICA
  //HAY QUE HACER PAGINACION

  async findOne(id: string): Promise<Materia | null> {
    const foundMateria = await this.prismaService.materia.findUnique({
      where: { id, estaActiva: true },
      include: {
        siglaMateria: {},
        siglaPrerequisito: { select: { siglaPrerequisito: true } },
      },
    });

    if (!foundMateria) {
      throw new NotFoundException('Materia no encontrada');
    }

    return foundMateria;
  }

  async update(
    id: string,
    updateMateriaDto: UpdateMateriaDto,
  ): Promise<Materia | null> {
    const updatedMateria = await this.prismaService.materia.update({
      where: { id },
      data: updateMateriaDto,
    });

    if (!updatedMateria) {
      throw new NotFoundException('Materia no encontrada');
    }

    return updatedMateria;
  }

  async remove(id: string): Promise<Materia | null> {
    const deletedMateria = await this.prismaService.materia.update({
      where: { id },
      data: { estaActiva: false },
    });

    if (!deletedMateria) {
      throw new NotAcceptableException('Materia no eliminada');
    }

    return deletedMateria;
  }
}
