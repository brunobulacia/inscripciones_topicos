import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { CreateHorarioDto } from './dto/create-horario.dto';
import { UpdateHorarioDto } from './dto/update-horario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Horario } from '@prisma/client';

@Injectable()
export class HorariosService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createHorarioDto: CreateHorarioDto): Promise<Horario> {
    const createdHorario = await this.prismaService.horario.create({
      data: createHorarioDto,
      include: {
        grupoMateria: {
          include: {
            materia: { select: { nombre: true, sigla: true } },
            docente: { select: { nombre: true, apellido_paterno: true } },
          },
        },
      },
    });

    if (!createdHorario) {
      throw new NotAcceptableException('Error al crear horario');
    }

    return createdHorario;
  }

  async findAll(): Promise<any[]> {
    return this.prismaService.horario.findMany({
      where: { estaActivo: true },
      include: {
        grupoMateria: {
          include: {
            materia: { select: { nombre: true, sigla: true } },
            docente: { select: { nombre: true, apellido_paterno: true } },
          },
        },
      },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async findByGrupoMateria(grupoMateriaId: string): Promise<Horario[]> {
    return this.prismaService.horario.findMany({
      where: {
        grupoMateriaId,
        estaActivo: true,
      },
      orderBy: [{ diaSemana: 'asc' }, { horaInicio: 'asc' }],
    });
  }

  async findOne(id: string): Promise<Horario | null> {
    const foundHorario = await this.prismaService.horario.findUnique({
      where: { id, estaActivo: true },
      include: {
        grupoMateria: {
          include: {
            materia: { select: { nombre: true, sigla: true } },
            docente: { select: { nombre: true, apellido_paterno: true } },
          },
        },
      },
    });

    if (!foundHorario) {
      throw new NotFoundException('Horario no encontrado');
    }
    return foundHorario;
  }

  async update(
    id: string,
    updateHorarioDto: UpdateHorarioDto,
  ): Promise<Horario> {
    const updatedHorario = await this.prismaService.horario.update({
      where: { id, estaActivo: true },
      data: updateHorarioDto,
      include: {
        grupoMateria: {
          include: {
            materia: { select: { nombre: true, sigla: true } },
            docente: { select: { nombre: true, apellido_paterno: true } },
          },
        },
      },
    });
    if (!updatedHorario) {
      throw new NotAcceptableException('Error al actualizar horario');
    }
    return updatedHorario;
  }

  async remove(id: string): Promise<Horario> {
    const deletedHorario = await this.prismaService.horario.update({
      where: { id, estaActivo: true },
      data: { estaActivo: false },
    });
    if (!deletedHorario) {
      throw new NotAcceptableException('Error al eliminar horario');
    }
    return deletedHorario;
  }
}
