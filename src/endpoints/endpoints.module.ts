import { Module, forwardRef } from '@nestjs/common';
import { EndpointsService } from './endpoints.service';
import { EndpointsController } from './endpoints.controller';
import { AutoQueueService } from './services/auto-queue.service';
import { EndpointExecutorService } from './services/endpoint-executor.service';
import { QueueInterceptor } from './interceptors/queue.interceptor';
import { EndpointProcessor } from './processors/endpoint.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { ColasModule } from '../colas/colas.module';
import { CarrerasModule } from '../carreras/carreras.module';
import { PrerequisitosModule } from 'src/prerequisitos/prerequisitos.module';
import { PlanesDeEstudioModule } from 'src/planes_de_estudio/planes_de_estudio.module';
import { PeriodosModule } from 'src/periodos/periodos.module';
import { OfertaGrupoMateriasModule } from 'src/oferta_grupo_materias/oferta_grupo_materias.module';
import { NivelesModule } from 'src/niveles/niveles.module';
import { ModulosModule } from 'src/modulos/modulos.module';
import { MateriasModule } from 'src/materias/materias.module';
import { MaestroDeOfertasModule } from 'src/maestro_de_ofertas/maestro_de_ofertas.module';
import { HorariosModule } from 'src/horarios/horarios.module';
import { GrupoMateriasModule } from 'src/grupo_materias/grupo_materias.module';
import { GestionesModule } from 'src/gestiones/gestiones.module';
import { FichasInscripcionModule } from 'src/fichas_inscripcion/fichas_inscripcion.module';
import { EstudiantesModule } from 'src/estudiantes/estudiantes.module';
import { DetallesInscripcionModule } from 'src/detalles_inscripcion/detalles_inscripcion.module';
import { DocentesModule } from 'src/docentes/docentes.module';
import { DetalleInsOfertasModule } from 'src/detalle_ins_ofertas/detalle_ins_ofertas.module';
import { BoletaInscripcionModule } from 'src/boleta_inscripcion/boleta_inscripcion.module';
import { BoletaGrupoMateriasModule } from 'src/boleta_grupo_materias/boleta_grupo_materias.module';
import { AvanceAcademicoModule } from 'src/avance_academico/avance_academico.module';
import { AulasModule } from 'src/aulas/aulas.module';
import { AulaGrupoMateriasModule } from 'src/aula_grupo_materias/aula_grupo_materias.module';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => ColasModule),
    CarrerasModule,
    PrerequisitosModule,
    PlanesDeEstudioModule,
    PeriodosModule,
    OfertaGrupoMateriasModule,
    NivelesModule,
    ModulosModule,
    MateriasModule,
    MaestroDeOfertasModule,
    HorariosModule,
    GrupoMateriasModule,
    GestionesModule,
    FichasInscripcionModule,
    EstudiantesModule,
    DocentesModule,
    DetallesInscripcionModule,
    DetalleInsOfertasModule,
    BoletaInscripcionModule,
    BoletaGrupoMateriasModule,
    AvanceAcademicoModule,
    AulasModule,
    AulaGrupoMateriasModule,
  ],
  controllers: [EndpointsController],
  providers: [
    EndpointsService,
    AutoQueueService,
    EndpointExecutorService,
    QueueInterceptor,
    EndpointProcessor,
  ],
  exports: [
    EndpointsService,
    AutoQueueService,
    EndpointExecutorService,
    QueueInterceptor,
  ],
})
export class EndpointsModule {}
