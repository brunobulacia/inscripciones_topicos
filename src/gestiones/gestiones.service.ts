import {
  Injectable,
  NotAcceptableException,
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
    const createdGestion = await this.prismaService.gestion.create({
      data: createGestionDto,
    });
    if (!createdGestion)
      throw new NotAcceptableException('Error creando gestión');
    return createdGestion;
  }

  async findAll(): Promise<Gestion[]> {
    return this.prismaService.gestion.findMany({ where: { estaActivo: true } });
  }

  async findOne(id: string): Promise<Gestion> {
    const foundGestion = await this.prismaService.gestion.findUnique({
      where: { id, estaActivo: true },
    });
    if (!foundGestion) throw new NotFoundException('Gestión no encontrada');
    return foundGestion;
  }

  async update(id: string, dto: UpdateGestionDto): Promise<Gestion> {
    const updatedGestion = await this.prismaService.gestion.update({
      where: { id },
      data: dto,
    });
    if (!updatedGestion) throw new NotFoundException('Gestión no encontrada');
    return updatedGestion;
  }

  async remove(id: string): Promise<Gestion> {
    const deletedGestion = await this.prismaService.gestion.update({
      where: { id },
      data: { estaActivo: false },
    });
    if (!deletedGestion) throw new NotFoundException('Gestión no encontrada');
    return deletedGestion;
  }
}
