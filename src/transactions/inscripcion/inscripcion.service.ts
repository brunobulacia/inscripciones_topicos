import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  BadRequestException,
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
    console.log(
      '🔍 Buscando materias con IDs:',
      createInscripcionDto.materiasId,
    );
    const todasLasMaterias = await prisma.ofertaGrupoMateria.findMany({
      where: {
        grupoMateriaId: { in: createInscripcionDto.materiasId },
      },
      include: { GrupoMateria: true },
    });

    // Para cada grupoMateriaId solicitado, tomar solo la primera oferta disponible
    const materias: typeof todasLasMaterias = [];

    if (
      !createInscripcionDto.materiasId ||
      !Array.isArray(createInscripcionDto.materiasId)
    ) {
      throw new BadRequestException(
        'materiasId es requerido y debe ser un array',
      );
    }

    for (const grupoMateriaId of createInscripcionDto.materiasId) {
      const primeraOferta = todasLasMaterias.find(
        (m) => m.grupoMateriaId === grupoMateriaId,
      );
      if (primeraOferta) {
        materias.push(primeraOferta);
      }
    }

    console.log('📚 Materias encontradas:', materias.length);
    console.log('📝 IDs solicitados:', createInscripcionDto.materiasId!.length);

    //VALIDAR SI EL ESTUDIANTE QUIERE INSCRIBIR MAS DE 7 MATERIAS
    if (materias.length !== createInscripcionDto.materiasId!.length) {
      console.log('❌ ERROR: No se encontraron todas las materias');
      console.log(
        'IDs buscados (grupoMateriaId):',
        createInscripcionDto.materiasId!,
      );
      console.log(
        'Materias encontradas:',
        materias.map((m) => ({
          ofertaId: m.id,
          grupoMateriaId: m.grupoMateriaId,
        })),
      );
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

    // VERIFICAR CUPOS DISPONIBLES ANTES DE PROCEDER
    const materiasDisponibles = materias.filter(
      (materia) => materia.GrupoMateria.cupos > 0,
    );

    if (materiasDisponibles.length === 0) {
      throw new NotAcceptableException(
        'Ninguna de las materias seleccionadas tiene cupo disponible',
      );
    }

    // Si no todas las materias tienen cupo, informar cuáles no están disponibles
    if (materiasDisponibles.length !== materias.length) {
      const materiasSinCupo = materias.filter(
        (materia) => materia.GrupoMateria.cupos <= 0,
      );
      const nombresSinCupo = await prisma.materia.findMany({
        where: {
          id: {
            in: materiasSinCupo.map((m) => m.GrupoMateria.materiaId),
          },
        },
        select: {
          nombre: true,
          sigla: true,
        },
      });

      throw new NotAcceptableException(
        `Las siguientes materias no tienen cupo disponible: ${nombresSinCupo
          .map((m) => `${m.sigla} - ${m.nombre}`)
          .join(', ')}`,
      );
    }

    // CONSTRUIR EL PAYLOAD SOLO CON MATERIAS QUE TIENEN CUPO
    const payload = materiasDisponibles.map((materia) => ({
      detalleInscripcionId: createDetalleInscripcion.id,
      ofertaGrupoMateriaId: materia.id,
      estado: 'INSCRITA',
    }));

    console.log(payload);

    // ANTES DE INSCRIBIR, VERIFICAR NUEVAMENTE LOS CUPOS (doble validación por concurrencia)
    const materiasActualizadas = await prisma.ofertaGrupoMateria.findMany({
      where: {
        id: { in: payload.map((p) => p.ofertaGrupoMateriaId) },
      },
      include: { GrupoMateria: true },
    });

    const materiasSinCupoActual = materiasActualizadas.filter(
      (m) => m.GrupoMateria.cupos <= 0,
    );
    if (materiasSinCupoActual.length > 0) {
      const nombresSinCupo = await prisma.materia.findMany({
        where: {
          id: {
            in: materiasSinCupoActual.map((m) => m.GrupoMateria.materiaId),
          },
        },
        select: {
          nombre: true,
          sigla: true,
        },
      });

      throw new NotAcceptableException(
        `Las siguientes materias ya no tienen cupo disponible debido a concurrencia: ${nombresSinCupo
          .map((m) => `${m.sigla} - ${m.nombre}`)
          .join(', ')}`,
      );
    }

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

    //AHORA A LAS MATERIAS INSCRITAS HAY QUE DISMINUIRLES UN CUPO CON VALIDACIÓN
    for (const materiaInscrita of materiasInscritas) {
      // Usar un update condicional que solo decrementa si hay cupos disponibles
      const updateResult = await prisma.grupoMateria.updateMany({
        where: {
          id: materiaInscrita.OfertaGrupoMateria.GrupoMateria.id,
          cupos: { gt: 0 }, // Solo actualizar si cupos > 0
        },
        data: { cupos: { decrement: 1 }, inscritos: { increment: 1 } },
      });

      // Si no se pudo actualizar, significa que ya no hay cupos
      if (updateResult.count === 0) {
        throw new NotAcceptableException(
          `La materia ${materiaInscrita.OfertaGrupoMateria.GrupoMateria.grupo} ya no tiene cupos disponibles debido a concurrencia`,
        );
      }
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
