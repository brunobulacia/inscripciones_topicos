import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateOfertaGrupoMateriaDto } from './dto/create-oferta_grupo_materia.dto';
import { UpdateOfertaGrupoMateriaDto } from './dto/update-oferta_grupo_materia.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { OfertaGrupoMateria } from '@prisma/client';

@Injectable()
export class OfertaGrupoMateriasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createOfertaGrupoMateriaDto: CreateOfertaGrupoMateriaDto,
  ): Promise<OfertaGrupoMateria> {
    try {
      const createdOfertaGrupoMateria =
        await this.prismaService.ofertaGrupoMateria.create({
          data: createOfertaGrupoMateriaDto,
        });

      if (!createdOfertaGrupoMateria) {
        throw new NotAcceptableException('Error al crear oferta grupo materia');
      }

      return createdOfertaGrupoMateria;
    } catch (error: any) {
      // Prisma unique constraint error code P2002
      if (error?.code === 'P2002') {
        // Determine which field caused the conflict if available
        const target = error?.meta?.target ?? [];
        const field =
          Array.isArray(target) && target.length > 0
            ? target[0]
            : 'campo único';
        throw new ConflictException(
          `Ya existe una oferta grupo materia con el ${field}`,
        );
      }

      // Re-throw other unexpected errors
      throw error;
    }
  }

  async findAll(): Promise<OfertaGrupoMateria[]> {
    return this.prismaService.ofertaGrupoMateria.findMany({
      where: { estaActivo: true },
      include: {
        GrupoMateria: { select: { grupo: true } },
        MaestroDeOferta: { select: { id: true } },
      },
    });
  }

  async findOne(id: string): Promise<OfertaGrupoMateria | null> {
    const foundOfertaGrupoMateria =
      await this.prismaService.ofertaGrupoMateria.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundOfertaGrupoMateria) {
      throw new NotFoundException(
        `Oferta grupo materia con id ${id} no encontrada`,
      );
    }

    return foundOfertaGrupoMateria;
  }

  async update(
    id: string,
    updateOfertaGrupoMateriaDto: UpdateOfertaGrupoMateriaDto,
  ): Promise<OfertaGrupoMateria> {
    const updatedOfertaGrupoMateria =
      await this.prismaService.ofertaGrupoMateria.update({
        where: { id },
        data: updateOfertaGrupoMateriaDto,
      });

    if (!updatedOfertaGrupoMateria) {
      throw new NotFoundException('Error al actualizar oferta grupo materia');
    }

    return updatedOfertaGrupoMateria;
  }

  async remove(id: string): Promise<OfertaGrupoMateria> {
    const deletedOfertaGrupoMateria =
      await this.prismaService.ofertaGrupoMateria.update({
        where: { id },
        data: { estaActivo: false },
      });

    if (!deletedOfertaGrupoMateria) {
      throw new NotFoundException('Error al borrar oferta grupo materia');
    }

    return deletedOfertaGrupoMateria;
  }
}
