import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateNivelDto } from './dto/create-nivele.dto';
import { UpdateNivelDto } from './dto/update-nivele.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nivel } from '@prisma/client';

@Injectable()
export class NivelesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNivelDto: CreateNivelDto): Promise<Nivel> {
    try {
      const createdNivel = await this.prismaService.nivel.create({
        data: createNivelDto,
      });

      if (!createdNivel) {
        throw new NotAcceptableException('Error al crear nivel académico');
      }

      return createdNivel;
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
          `Ya existe un nivel académico con el ${field}`,
        );
      }

      // Re-throw other unexpected errors
      throw error;
    }
  }

  async findAll(): Promise<Nivel[]> {
    return this.prismaService.nivel.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<Nivel | null> {
    const foundNivel = await this.prismaService.nivel.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundNivel) {
      throw new NotFoundException(`Nivel académico con id ${id} no encontrado`);
    }

    return foundNivel;
  }

  async update(id: string, updateNivelDto: UpdateNivelDto): Promise<Nivel> {
    const updatedNivel = await this.prismaService.nivel.update({
      where: { id },
      data: updateNivelDto,
    });

    if (!updatedNivel) {
      throw new NotFoundException('Error al actualizar nivel académico');
    }

    return updatedNivel;
  }

  async remove(id: string): Promise<Nivel> {
    const deletedNivel = await this.prismaService.nivel.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedNivel) {
      throw new NotFoundException('Error al borrar nivel académico');
    }

    return deletedNivel;
  }
}
