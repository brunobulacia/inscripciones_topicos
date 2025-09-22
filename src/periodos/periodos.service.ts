import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Periodo } from '@prisma/client';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';

@Injectable()
export class PeriodosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPeriodoDto: CreatePeriodoDto): Promise<Periodo> {
    try {
      const createdPeriodo = await this.prismaService.periodo.create({
        data: createPeriodoDto,
      });

      if (!createdPeriodo) {
        throw new NotAcceptableException('Error al crear periodo');
      }

      return createdPeriodo;
    } catch (error: any) {
      // Prisma unique constraint error code P2002
      if (error?.code === 'P2002') {
        // Determine which field caused the conflict if available
        const target = error?.meta?.target ?? [];
        const field =
          Array.isArray(target) && target.length > 0
            ? target[0]
            : 'campo único';
        throw new ConflictException(`Ya existe un periodo con el ${field}`);
      }

      // Re-throw other unexpected errors
      throw error;
    }
  }

  async findAll(): Promise<Periodo[]> {
    return this.prismaService.periodo.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<Periodo> {
    const foundPeriodo = await this.prismaService.periodo.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundPeriodo) {
      throw new NotFoundException(`Periodo con id ${id} no encontrado`);
    }

    return foundPeriodo;
  }

  async update(
    id: string,
    updatePeriodoDto: UpdatePeriodoDto,
  ): Promise<Periodo> {
    const updatedPeriodo = await this.prismaService.periodo.update({
      where: { id },
      data: updatePeriodoDto,
    });

    if (!updatedPeriodo) {
      throw new NotFoundException('Error al actualizar periodo');
    }

    return updatedPeriodo;
  }

  async remove(id: string): Promise<Periodo> {
    const deletedPeriodo = await this.prismaService.periodo.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedPeriodo) {
      throw new NotFoundException('Error al borrar periodo');
    }

    return deletedPeriodo;
  }
}
