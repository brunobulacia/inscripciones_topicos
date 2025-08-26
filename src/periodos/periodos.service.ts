import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Periodo } from '@prisma/client';
import { CreatePeriodoDto } from './dto/create-periodo.dto';
import { UpdatePeriodoDto } from './dto/update-periodo.dto';

@Injectable()
export class PeriodosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createPeriodoDto: CreatePeriodoDto): Promise<Periodo> {
    const createdPeriodo = await this.prismaService.periodo.create({
      data: createPeriodoDto,
    });
    if (!createdPeriodo)
      throw new NotAcceptableException('Error creando periodo');
    return createdPeriodo;
  }

  async findAll(): Promise<Periodo[]> {
    return this.prismaService.periodo.findMany({ where: { estaActivo: true } });
  }

  async findOne(id: string): Promise<Periodo> {
    const foundPeriodo = await this.prismaService.periodo.findUnique({
      where: { id, estaActivo: true },
    });
    if (!foundPeriodo) throw new NotFoundException('Periodo no encontrado');
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
    if (!updatedPeriodo) throw new NotFoundException('Periodo no encontrado');
    return updatedPeriodo;
  }

  async remove(id: string): Promise<Periodo> {
    const deletedPeriodo = await this.prismaService.periodo.update({
      where: { id },
      data: { estaActivo: false },
    });
    if (!deletedPeriodo) throw new NotFoundException('Periodo no encontrado');
    return deletedPeriodo;
  }
}
