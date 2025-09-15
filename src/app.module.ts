import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CarrerasModule } from './carreras/carreras.module';
import { PlanesDeEstudioModule } from './planes_de_estudio/planes_de_estudio.module';
import { NivelesModule } from './niveles/niveles.module';
import { MateriasModule } from './materias/materias.module';
import { PrerequisitosModule } from './prerequisitos/prerequisitos.module';
import { GrupoMateriasModule } from './grupo_materias/grupo_materias.module';
import { DocentesModule } from './docentes/docentes.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { FichasInscripcionModule } from './fichas_inscripcion/fichas_inscripcion.module';
import { DetallesInscripcionModule } from './detalles_inscripcion/detalles_inscripcion.module';
import { ModulosModule } from './modulos/modulos.module';
import { AulasModule } from './aulas/aulas.module';
import { GestionesModule } from './gestiones/gestiones.module';
import { PeriodosModule } from './periodos/periodos.module';
import { BoletaInscripcionModule } from './boleta_inscripcion/boleta_inscripcion.module';
import { AvanceAcademicoModule } from './avance_academico/avance_academico.module';
import { HorariosModule } from './horarios/horarios.module';
import { AulaGrupoMateriasModule } from './aula_grupo_materias/aula_grupo_materias.module';

//PARA MANEJAR REDIS Y BULLMQ PARA LAS COLAS
import { BullModule } from '@nestjs/bullmq';
import { InscripcionModule } from './transactions/inscripcion/inscripcion.module';
import { BoletaGrupoMateriasModule } from './boleta_grupo_materias/boleta_grupo_materias.module';
import { DetalleInsOfertasModule } from './detalle_ins_ofertas/detalle_ins_ofertas.module';
import { MaestroDeOfertasModule } from './maestro_de_ofertas/maestro_de_ofertas.module';
import { OfertaGrupoMateriasModule } from './oferta_grupo_materias/oferta_grupo_materias.module';
import { QUEUE_NAMES } from './common/types/queue.types';
import { QueueCommonModule } from './common/queue-common.module';
import { BullMQDashboardModule } from './bullmq-dashboard/bullmq-dashboard.module';
import { GMOfertaModule } from './transactions/generarMaestroDeOferta/gMOferta.module';

@Module({
  imports: [
    QueueCommonModule, // Módulo global para los servicios de queue
    BullMQDashboardModule, // Dashboard de BullMQ
    AuthModule,
    CarrerasModule,
    PlanesDeEstudioModule,
    NivelesModule,
    MateriasModule,
    PrerequisitosModule,
    GrupoMateriasModule,
    DocentesModule,
    EstudiantesModule,
    FichasInscripcionModule,
    DetallesInscripcionModule,
    ModulosModule,
    AulasModule,
    GestionesModule,
    PeriodosModule,
    BoletaInscripcionModule,
    AvanceAcademicoModule,
    HorariosModule,
    AulaGrupoMateriasModule,

    //TRANSACCIONES
    InscripcionModule,
    GMOfertaModule,

    //ABRIR UN PUERTO PARA BULLMQ Y REDIS
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),

    // Cola centralizada para todos los servicios
    BullModule.registerQueue({
      name: QUEUE_NAMES.INSCRIPCIONES,
    }),

    BoletaGrupoMateriasModule,

    DetalleInsOfertasModule,

    MaestroDeOfertasModule,

    OfertaGrupoMateriasModule,
  ],
  controllers: [],
  /* providers: [
    {
      //PARA PONER EL GUARD DE JWT EN TODOS LOS ENDPOINTS PERRITOUUUU
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ], */
})
export class AppModule {}
