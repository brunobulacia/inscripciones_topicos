import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateDocenteDto } from './dto/create-docente.dto';
import { UpdateDocenteDto } from './dto/update-docente.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Docente } from '@prisma/client';

@Injectable()
export class DocentesService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDocenteDto: CreateDocenteDto): Promise<Docente> {
    const createdDocente = await this.prismaService.docente.create({
      data: createDocenteDto,
    });

    if (!createdDocente) {
      throw new NotAcceptableException('Error creating docente');
    }

    return createdDocente;
  }

  async findAll(): Promise<Docente[]> {
    return this.prismaService.docente.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<Docente | null> {
    const foundDocente = await this.prismaService.docente.findUnique({
      where: { id, estaActivo: true },
    });

    if (!foundDocente) {
      throw new NotFoundException('Docente no encontrado');
    }
    return foundDocente;
  }

  async update(
    id: string,
    updateDocenteDto: UpdateDocenteDto,
  ): Promise<Docente> {
    const updatedDocente = await this.prismaService.docente.update({
      where: { id },
      data: updateDocenteDto,
    });

    if (!updatedDocente) {
      throw new NotFoundException('Docente no encontrado');
    }

    return updatedDocente;
  }

  async remove(id: string): Promise<Docente> {
    const deletedDocente = await this.prismaService.docente.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedDocente) {
      throw new NotFoundException('Docente no encontrado');
    }

    return deletedDocente;
  }
}
