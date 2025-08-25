import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import type { CreatePlanDeEstudioDto } from './dto/create-planes_de_estudio.dto';
import type { UpdatePlanDeEstudioDto } from './dto/update-planes_de_estudio.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PlanDeEstudio } from '@prisma/client';

@Injectable()
export class PlanesDeEstudioService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPlanDeEstudioDto: CreatePlanDeEstudioDto,
  ): Promise<PlanDeEstudio> {
    const createdPlanDeEstudio = await this.prismaService.planDeEstudio.create({
      data: createPlanDeEstudioDto,
    });

    if (!createdPlanDeEstudio) {
      throw new NotAcceptableException('Error creating PlanDeEstudio');
    }

    return createdPlanDeEstudio;
  }

  async findAll(): Promise<PlanDeEstudio[]> {
    return this.prismaService.planDeEstudio.findMany({
      where: { estaActivo: true },
    });
  }

  async findOne(id: string): Promise<PlanDeEstudio | null> {
    const foundPlanDeEstudio =
      await this.prismaService.planDeEstudio.findUnique({
        where: { id, estaActivo: true },
      });

    if (!foundPlanDeEstudio) {
      throw new NotFoundException(`PlanDeEstudio with id ${id} not found`);
    }

    return foundPlanDeEstudio;
  }

  async update(
    id: string,
    updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ): Promise<PlanDeEstudio | null> {
    const updatedPlanDeEstudio = await this.prismaService.planDeEstudio.update({
      where: { id },
      data: updatePlanDeEstudioDto,
    });

    if (!updatedPlanDeEstudio) {
      throw new NotFoundException(`PlanDeEstudio with id ${id} not found`);
    }

    return updatedPlanDeEstudio;
  }

  async remove(id: string): Promise<PlanDeEstudio | null> {
    const deletedPlanDeEstudio = await this.prismaService.planDeEstudio.update({
      where: { id },
      data: { estaActivo: false },
    });

    if (!deletedPlanDeEstudio) {
      throw new NotFoundException(`PlanDeEstudio with id ${id} not found`);
    }

    return deletedPlanDeEstudio;
  }
}
