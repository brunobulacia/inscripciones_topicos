import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePrerequisitoDto } from './dto/create-prerequisito.dto';
import { UpdatePrerequisitoDto } from './dto/update-prerequisito.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prerequisito } from '@prisma/client';

@Injectable()
export class PrerequisitosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPrerequisitoDto: CreatePrerequisitoDto,
  ): Promise<Prerequisito> {
    const createdPrerequisito = await this.prismaService.prerequisito.create({
      data: createPrerequisitoDto,
    });

    if (!createdPrerequisito) {
      throw new NotAcceptableException('Error al crear prerequisito');
    }

    return createdPrerequisito;
  }

  async findAll(): Promise<Prerequisito[]> {
    return this.prismaService.prerequisito.findMany({
      where: { esActivo: true },
    });
  }

  async findOne(id: string): Promise<Prerequisito | null> {
    const foundPrerequisito = await this.prismaService.prerequisito.findUnique({
      where: { id, esActivo: true },
    });

    if (!foundPrerequisito) {
      throw new NotFoundException('Prerequisito no encontrado');
    }
    return foundPrerequisito;
  }

  async update(
    id: string,
    updatePrerequisitoDto: UpdatePrerequisitoDto,
  ): Promise<Prerequisito> {
    const updatedPrerequisito = await this.prismaService.prerequisito.update({
      where: { id, esActivo: true },
      data: updatePrerequisitoDto,
    });
    if (!updatedPrerequisito) {
      throw new NotAcceptableException('Error al actualizar prerequisito');
    }
    return updatedPrerequisito;
  }

  async remove(id: string): Promise<Prerequisito> {
    const deletedPrerequisito = await this.prismaService.prerequisito.delete({
      where: { id, esActivo: true },
    });
    if (!deletedPrerequisito) {
      throw new NotAcceptableException('Error al eliminar prerequisito');
    }
    return deletedPrerequisito;
  }
}
