import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Modulo } from '@prisma/client';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
    try {
      const createdModulo = await this.prismaService.modulo.create({
        data: createModuloDto,
      });

      if (!createdModulo) {
        throw new NotAcceptableException('Error al crear módulo');
      }

      return createdModulo;
    } catch (error: any) {
      // Prisma unique constraint error code P2002
      if (error?.code === 'P2002') {
        // Determine which field caused the conflict if available
        const target = error?.meta?.target ?? [];
        const field =
          Array.isArray(target) && target.length > 0
            ? target[0]
            : 'campo único';
        throw new ConflictException(`Ya existe un módulo con el ${field}`);
      }

      // Re-throw other unexpected errors
      throw error;
    }
  }

  async findAll(): Promise<Modulo[]> {
    return this.prismaService.modulo.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<Modulo> {
    const foundModulo = await this.prismaService.modulo.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundModulo) {
      throw new NotFoundException(`Módulo con id ${id} no encontrado`);
    }

    return foundModulo;
  }

  async update(id: string, updateModuloDto: UpdateModuloDto): Promise<Modulo> {
    const updatedModulo = await this.prismaService.modulo.update({
      where: { id },
      data: updateModuloDto,
    });

    if (!updatedModulo) {
      throw new NotFoundException('Error al actualizar módulo');
    }

    return updatedModulo;
  }

  async remove(id: string): Promise<Modulo> {
    const deletedModulo = await this.prismaService.modulo.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedModulo) {
      throw new NotFoundException('Error al borrar módulo');
    }

    return deletedModulo;
  }
}
