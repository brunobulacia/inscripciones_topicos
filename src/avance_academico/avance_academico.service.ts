import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AvanceAcademico } from '@prisma/client';
import { CreateAvanceAcademicoDto } from './dto/create-avance_academico.dto';
import { UpdateAvanceAcademicoDto } from './dto/update-avance_academico.dto';

@Injectable()
export class AvanceAcademicoService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createAvanceAcademicoDto: CreateAvanceAcademicoDto,
  ): Promise<AvanceAcademico> {
    const createdAvanceAcademico =
      await this.prismaService.avanceAcademico.create({
        data: createAvanceAcademicoDto,
      });
    if (!createdAvanceAcademico)
      throw new NotAcceptableException('Error creando avance académico');
    return createdAvanceAcademico;
  }

  async findAll(): Promise<AvanceAcademico[]> {
    return this.prismaService.avanceAcademico.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<AvanceAcademico> {
    const foundAvanceAcademico =
      await this.prismaService.avanceAcademico.findUnique({
        where: { id, estaActivo: true },
      });
    if (!foundAvanceAcademico)
      throw new NotFoundException('Avance académico no encontrado');
    return foundAvanceAcademico;
  }

  async update(
    id: string,
    updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ): Promise<AvanceAcademico> {
    const updatedAvanceAcademico =
      await this.prismaService.avanceAcademico.update({
        where: { id },
        data: updateAvanceAcademicoDto,
      });
    if (!updatedAvanceAcademico)
      throw new NotFoundException('Avance académico no encontrado');
    return updatedAvanceAcademico;
  }

  async remove(id: string): Promise<AvanceAcademico> {
    const deletedAvanceAcademico =
      await this.prismaService.avanceAcademico.update({
        where: { id },
        data: { estaActivo: false },
      });
    if (!deletedAvanceAcademico)
      throw new NotFoundException('Avance académico no encontrado');
    return deletedAvanceAcademico;
  }
}
