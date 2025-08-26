import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Modulo } from '@prisma/client';
import { CreateModuloDto } from './dto/create-modulo.dto';
import { UpdateModuloDto } from './dto/update-modulo.dto';

@Injectable()
export class ModulosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createModuloDto: CreateModuloDto): Promise<Modulo> {
    const createdModulo = await this.prismaService.modulo.create({
      data: createModuloDto,
    });
    if (!createdModulo)
      throw new NotAcceptableException('Error creando módulo');
    return createdModulo;
  }

  async findAll(): Promise<Modulo[]> {
    return this.prismaService.modulo.findMany({ where: { estaActivo: true } });
  }

  async findOne(id: string): Promise<Modulo> {
    const foundModulo = await this.prismaService.modulo.findUnique({
      where: { id, estaActivo: true },
    });
    if (!foundModulo) throw new NotFoundException('Módulo no encontrado');
    return foundModulo;
  }

  async update(id: string, dto: UpdateModuloDto): Promise<Modulo> {
    const updatedModulo = await this.prismaService.modulo.update({
      where: { id },
      data: dto,
    });
    if (!updatedModulo) throw new NotFoundException('Módulo no encontrado');
    return updatedModulo;
  }

  async remove(id: string): Promise<Modulo> {
    const deletedModulo = await this.prismaService.modulo.update({
      where: { id },
      data: { estaActivo: false },
    });
    if (!deletedModulo) throw new NotFoundException('Módulo no encontrado');
    return deletedModulo;
  }
}
