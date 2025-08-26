import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateNivelDto } from './dto/create-nivele.dto';
import { UpdateNivelDto } from './dto/update-nivele.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Nivel } from '@prisma/client';

@Injectable()
export class NivelesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createNivelDto: CreateNivelDto): Promise<Nivel> {
    const createdNivel = await this.prismaService.nivel.create({
      data: createNivelDto,
    });

    if (!createdNivel) {
      throw new NotAcceptableException('No se pudo crear el nivel');
    }

    return createdNivel;
  }

  async findAll(): Promise<Nivel[]> {
    return this.prismaService.nivel.findMany({});
  }

  async findOne(id: string): Promise<Nivel | null> {
    const foundNivel = await this.prismaService.nivel.findUnique({
      where: { id },
    });

    if (!foundNivel) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }

    return foundNivel;
  }

  async update(
    id: string,
    updateNivelDto: UpdateNivelDto,
  ): Promise<Nivel | null> {
    const updatedNivel = await this.prismaService.nivel.update({
      where: { id },
      data: updateNivelDto,
    });

    if (!updatedNivel) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }

    return updatedNivel;
  }

  async remove(id: string): Promise<Nivel | null> {
    const deletedNivel = await this.prismaService.nivel.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedNivel) {
      throw new NotFoundException(`Nivel con ID ${id} no encontrado`);
    }

    return deletedNivel;
  }
}
