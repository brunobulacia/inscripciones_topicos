import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Gestion } from '@prisma/client';
import { CreateGestionDto } from './dto/create-gestion.dto';
import { UpdateGestionDto } from './dto/update-gestion.dto';

@Injectable()
export class GestionesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createGestionDto: CreateGestionDto): Promise<Gestion> {
    try {
      const createdGestion = await this.prismaService.gestion.create({
        data: createGestionDto,
      });

      return createdGestion;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una gestión con estos datos');
      }
      throw error;
    }
  }

  async findAll(): Promise<Gestion[]> {
    return this.prismaService.gestion.findMany({ where: { estaActivo: true } });
  }

  async findOne(id: string): Promise<Gestion> {
    const foundGestion = await this.prismaService.gestion.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundGestion) {
      throw new NotFoundException('Gestión no encontrada');
    }

    return foundGestion;
  }

  async update(id: string, dto: UpdateGestionDto): Promise<Gestion> {
    try {
      const updatedGestion = await this.prismaService.gestion.update({
        where: { id },
        data: dto,
      });

      return updatedGestion;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Gestión no encontrada');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('Ya existe una gestión con estos datos');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<{ message: string }> {
    try {
      await this.prismaService.gestion.update({
        where: { id },
        data: { estaActivo: false },
      });

      return { message: 'Gestión eliminada exitosamente' };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Gestión no encontrada');
      }
      throw error;
    }
  }
}
