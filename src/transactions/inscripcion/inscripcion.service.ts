import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateInscripcionDto } from './dto/create-inscripcion.dto';
import { GrupoMateria, Prisma } from '@prisma/client';
@Injectable()
export class InscripcionService {
  constructor(private readonly prismaService: PrismaService) {}

  async inscripcion(createInscripcionDto: CreateInscripcionDto) {
    return await this.prismaService.$transaction(async (prisma) => {
      //VALIDANDO SI EL REGISTRO LE PERTENECE A ALGUN ESTUDIANTE
      const foundStudent = await prisma.estudiante.findUnique({
        where: { matricula: createInscripcionDto.registro },
      });
      if (!foundStudent) {
        throw new NotFoundException('Estudiante no encontrado');
      }

      const createFichaInscripcion = await prisma.fichaInscripcion.create({
        data: {
          estudianteId: foundStudent.id,
        },
      });

      //DELEGAMOS A UNA FUNCION PARA QUE INSCRIBA LAS MATERIAS
      return await this.crearDetallesDeInscripcionEnTransaccion(
        createInscripcionDto,
        createFichaInscripcion.id,
        foundStudent.id,
        prisma,
      );
    });
  }

  async crearDetallesDeInscripcionEnTransaccion(
    createInscripcionDto: CreateInscripcionDto,
    fichaInscripcionId: string,
    foundStudentId: string,
    prisma: Prisma.TransactionClient,
  ) {
    //CREAMOS UN DETALLE DE INSCRIPCION NUEVO SIN IMPORTAR SI EL ALUMNO YA INSCRIBIO ANTES
    const createDetalleInscripcion = await prisma.detalleInscripcion.create({
      data: {
        fichaInscripcionId: fichaInscripcionId,
        tipo: 'INSCRIPCION',
      },
    });

    if (!createDetalleInscripcion) {
      throw new NotAcceptableException(
        'Error al crear el detalle de inscripción',
      );
    }

    // BUSCAMOS LAS MATERIAS QUE QUEREMOS INSCRIBIR
    const materias = await prisma.ofertaGrupoMateria.findMany({
      where: {
        grupoMateriaId: { in: createInscripcionDto.materiasId },
      },
      include: { GrupoMateria: true },
    });

    //VALIDAR SI EL ESTUDIANTE QUIERE INSCRIBIR MAS DE 7 MATERIAS
    if (materias.length !== createInscripcionDto.materiasId.length) {
      throw new NotFoundException(
        'Alguna de las materias seleccionadas no existe',
      );
    }

    if (materias.length > 7) {
      throw new NotAcceptableException(
        'No se pueden inscribir más de 7 materias en una sola ficha de inscripción',
      );
    }

    // VALIDAR SI EL ESTUDIANTE YA TIENE ALGUNA DE ESTAS MATERIAS EN SU BOLETA
    const boletaEstudiante = await prisma.boletaInscripcion.findFirst({
      where: { estudianteId: foundStudentId },
      include: {
        BoletaGrupoMateria: {
          include: {
            grupoMateria: true,
          },
        },
      },
    });

    if (boletaEstudiante && boletaEstudiante.BoletaGrupoMateria.length > 0) {
      const materiasYaInscritas = boletaEstudiante.BoletaGrupoMateria.map(
        (bgm) => bgm.grupoMateriaId,
      );

      console.log('Materias ya inscritas del estudiante:');
      console.log(materiasYaInscritas);

      const materiasConflicto = materias.filter((materia) =>
        materiasYaInscritas.includes(materia.grupoMateriaId),
      );

      console.log('Materias en conflicto:');
      console.log(materiasConflicto);

      if (materiasConflicto.length > 0) {
        const nombresMateriasConflicto = await prisma.materia.findMany({
          where: {
            id: {
              in: materiasConflicto.map((mc) => mc.grupoMateriaId),
            },
          },
          select: {
            nombre: true,
            sigla: true,
          },
        });

        throw new NotAcceptableException(
          `El estudiante ya tiene inscrita(s) la(s) siguiente(s) materia(s): ${nombresMateriasConflicto
            .map((m) => `${m.sigla} - ${m.nombre}`)
            .join(', ')}`,
        );
      }
    }

    // FILTRAMOS LAS MATERIAS CON CUPO DISPONIBLE Y DE UNA CONSTRUIMOS EL PAYLOAD
    const payload = materias
      .filter((materia) => materia.GrupoMateria.cupos > 0)
      .map((materia) => ({
        detalleInscripcionId: createDetalleInscripcion.id,
        ofertaGrupoMateriaId: materia.id,
        estado: 'INSCRITA',
      }));

    if (payload.length === 0) {
      throw new NotAcceptableException('Ninguna materia tiene cupo disponible');
    }

    console.log(payload);

    //INSCRIBIMOS TODAS LAS MATERIAS DE UN SAQUE PERRITO
    const createDetalleInsGrupoMat = await prisma.detalleInsOferta.createMany({
      data: payload,
    });

    if (createDetalleInsGrupoMat.count === 0) {
      throw new NotAcceptableException(
        'No se pudieron inscribir las materias, error de concurrencia en los cupos o similar',
      );
    }

    //SACAMOS LAS MATERIAS QUE PUDO INSCRIBIR PARA DESPUES METERLAS A LA BOLETA
    const materiasInscritas = await prisma.detalleInsOferta.findMany({
      where: { detalleInscripcionId: createDetalleInscripcion.id },
      include: { OfertaGrupoMateria: { include: { GrupoMateria: true } } },
    });

    //AHORA A LAS MATERIAS INSCRITAS HAY QUE DISMINUIRLES UN CUPO
    const materiasConCupo = materiasInscritas.filter(
      (materia) => materia.OfertaGrupoMateria.GrupoMateria.cupos > 0,
    );
    for (const materia of materiasConCupo) {
      await prisma.grupoMateria.update({
        where: { id: materia.OfertaGrupoMateria.GrupoMateria.id },
        data: { cupos: { decrement: 1 } },
      });
    }

    await this.mapearMateriasInscritasABoletaEnTransaccion(
      materiasInscritas.map((mi) => mi.OfertaGrupoMateria.GrupoMateria),
      foundStudentId,
      prisma,
    );

    return {
      message: 'Inscripción completada exitosamente',
      materiasInscritas: materiasInscritas.length,
      fichaInscripcionId,
    };
  }

  async mapearMateriasInscritasABoletaEnTransaccion(
    materiasInscritas: GrupoMateria[],
    foundStudentId: string,
    prisma: Prisma.TransactionClient,
  ) {
    //BUSCAMOS LA BOLETA DEL ALUMNO
    const foundBoleta = await prisma.boletaInscripcion.findFirst({
      where: { estudianteId: foundStudentId },
    });

    if (!foundBoleta) {
      throw new NotFoundException('Boleta no encontrada');
    }

    //MAPEAMOS LAS MATERIAS INSCRITAS A LA BOLETA
    const createBoletaGrupoMateria = await prisma.boletaGrupoMateria.createMany(
      {
        data: materiasInscritas.map((materia) => ({
          boletaInscripcionId: foundBoleta.id,
          grupoMateriaId: materia.id,
        })),
      },
    );

    if (createBoletaGrupoMateria.count === 0) {
      throw new NotAcceptableException(
        'No se pudieron crear las materias en la boleta',
      );
    }
  }
}
