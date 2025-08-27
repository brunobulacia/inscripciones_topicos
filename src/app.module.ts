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

@Module({
  imports: [
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
  ],
  controllers: [],
  providers: [
    {
      //PARA PONER EL GUARD DE JWT EN TODOS LOS ENDPOINTS PERRITOUUUU
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
