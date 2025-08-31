import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { GrupoMateria } from '@prisma/client';
@Injectable()
export class InscripcionService {
  constructor(private readonly prismaService: PrismaService) {}

  async inscripcion(createInscripcionDto: CreateInscripcionDto) {
    //VALIDANDO SI EL REGISTRO LE PERTENECE A ALGUN ESTUDIANTE
    const foundStudent = await this.prismaService.estudiante.findUnique({
      where: { matricula: createInscripcionDto.registro },
    });
    if (!foundStudent) {
      throw new NotFoundException('Estudiante no encontrado');
    }

    //VIENDO SI EL ESTUDIANTE TIENE ALGUNA FICHA YA CREADA
    const foundInscripcionId =
      await this.prismaService.fichaInscripcion.findFirst({
        where: { estudianteId: foundStudent.id },
      });

    //SI EL ESTUDIANTE NO TIENE FICHA DE INSCRIPCION, LE CREAMOS UNA
    if (!foundInscripcionId) {
      const createFichaInscripcion =
        await this.prismaService.fichaInscripcion.create({
          data: {
            estudianteId: foundStudent.id,
          },
        });

      if (!createFichaInscripcion) {
        throw new NotAcceptableException('Error al crear la ficha');
      }

      //DELEGAMOS A UNA FUNCION PARA QUE INSCRIBA LA MAS MATERIAS CON LA FICHA RECIEN CREADA
      await this.crearDetallesDeInscripcion(
        createInscripcionDto,
        createFichaInscripcion.id,
        foundStudent.id,
      );
    } else {
      //DELEGAMOS A UNA FUNCION PARA QUE INSCRIBA LAS MAS MATERIAS CON LA FICHA ENCONTRADA
      await this.crearDetallesDeInscripcion(
        createInscripcionDto,
        foundInscripcionId.id,
        foundStudent.id,
      );
    }
  }

  async crearDetallesDeInscripcion(
    createInscripcionDto: CreateInscripcionDto,
    fichaInscripcionId: string,
    foundStudentId: string,
  ) {
    //CREAMOS UN DETALLE DE INSCRIPCION NUEVO SIN IMPORTAR SI EL ALUMNO YA INSCRIBIO ANTES
    const createDetalleInscripcion =
      await this.prismaService.detalleInscripcion.create({
        data: {
          fichaInscripcionId: fichaInscripcionId,
          tipo: 'INSCRIPCION',
        },
      });

    if (!createDetalleInscripcion) {
      throw new NotAcceptableException('Error al crear la ficha');
    }

    // BUSCAMOS LAS MATERIAS QUE QUEREMOS INSCRIBIR
    const materias = await this.prismaService.grupoMateria.findMany({
      where: {
        id: { in: createInscripcionDto.materiasId },
      },
    });

    console.log(materias.length);

    if (materias.length !== createInscripcionDto.materiasId.length) {
      throw new NotFoundException(
        'Alguna de las materias seleccionadas no existe',
      );
    }

    // FILTRAMOS LAS MATERIAS CON CUPO DISPONIBLE Y DE UNA CONSTRUIMOS EL PAYLOAD
    const payload = materias
      .filter((materia) => materia.cupos > 0)
      .map((materia) => ({
        detalleInscripcionId: createDetalleInscripcion.id,
        grupoMateriaId: materia.id,
        estado: 'INSCRITA',
      }));

    if (payload.length === 0) {
      throw new NotAcceptableException('Ninguna materia tiene cupo disponible');
    }

    console.log(payload);

    //INSCRIBIMOS TODAS LAS MATERIAS DE UN SAQUE
    const createDetalleInsGrupoMat =
      await this.prismaService.detalleInsGrupoMat.createMany({
        data: payload,
      });

    if (createDetalleInsGrupoMat.count === 0) {
      throw new NotAcceptableException(
        'No se pudieron inscribir las materias, error de concurrencia en los cupos o similar',
      );
    }

    //SACAMOS LAS MATERIAS QUE PUDO INSCRIBIR PARA DESPUES METERLAS A LA BOLETA
    const materiasInscritas =
      await this.prismaService.detalleInsGrupoMat.findMany({
        where: { detalleInscripcionId: createDetalleInscripcion.id },
        include: { grupoMateria: true },
      });

    //AHORA A LAS MATERIAS INSCRITAS HAY QUE DISMINUIRLES UN CUPO
    const materiasConCupo = materiasInscritas.filter(
      (materia) => materia.grupoMateria.cupos > 0,
    );
    for (const materia of materiasConCupo) {
      await this.prismaService.grupoMateria.update({
        where: { id: materia.grupoMateria.id },
        data: { cupos: { decrement: 1 } },
      });
    }

    await this.mapearMateriasInscritasABoleta(
      materiasInscritas.map((mi) => mi.grupoMateria),
      foundStudentId,
    );
  }

  async mapearMateriasInscritasABoleta(
    materiasInscritas: GrupoMateria[],
    foundStudentId: string,
  ) {
    //BUSCAMOS LA BOLETA DEL ALUMNO
    const foundBoleta = await this.prismaService.boletaInscripcion.findFirst({
      where: { estudianteId: foundStudentId },
    });

    if (!foundBoleta) {
      throw new NotFoundException('Boleta no encontrada');
    }

    //MAPEAMOS LAS MATERIAS INSCRITAS A LA BOLETA
    const createBoletaGrupoMateria =
      await this.prismaService.boletaGrupoMateria.createMany({
        data: materiasInscritas.map((materia) => ({
          boletaInscripcionId: foundBoleta.id,
          grupoMateriaId: materia.id,
        })),
      });

    if (createBoletaGrupoMateria.count === 0) {
      throw new NotAcceptableException(
        'No se pudieron crear las materias en la boleta',
      );
    }
  }
}
