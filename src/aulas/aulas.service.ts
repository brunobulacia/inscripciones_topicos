import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Aula } from '@prisma/client';
import { CreateAulaDto } from './dto/create-aula.dto';
import { UpdateAulaDto } from './dto/update-aula.dto';

//SEEDER
import { Aulas } from './seed/aula.seeder';

@Injectable()
export class AulasService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createAulaDto: CreateAulaDto): Promise<Aula> {
    try {
      const createdAula = await this.prismaService.aula.create({
        data: createAulaDto,
      });
      if (!createdAula) throw new NotAcceptableException('Error creando aula');
      return createdAula;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un aula con estos datos');
      }
      throw error;
    }
  }

  async findAll(): Promise<Aula[]> {
    return this.prismaService.aula.findMany({ where: { estaActivo: true } });
  }

  async findOne(id: string): Promise<Aula> {
    const foundAula = await this.prismaService.aula.findUnique({
      where: { id, estaActivo: true },
    });
    if (!foundAula) throw new NotFoundException('Aula no encontrada');
    return foundAula;
  }

  async update(id: string, dto: UpdateAulaDto): Promise<Aula> {
    try {
      const updatedAula = await this.prismaService.aula.update({
        where: { id },
        data: dto,
      });
      if (!updatedAula) throw new NotFoundException('Aula no encontrada');
      return updatedAula;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe un aula con estos datos');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException('Aula no encontrada');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      const deletedAula = await this.prismaService.aula.update({
        where: { id },
        data: { estaActivo: false },
      });
      if (!deletedAula) throw new NotFoundException('Aula no encontrada');
      return { message: 'Aula eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Aula no encontrada');
      }
      throw error;
    }
  }

  //SEEDER
  async seedAulas() {
    const aulas = await this.prismaService.aula.createMany({
      data: Aulas,
    });
    return aulas;
  }

  async clearAulas() {
    const clearedAulas = await this.prismaService.aula.deleteMany({});
    return clearedAulas;
  }
}
