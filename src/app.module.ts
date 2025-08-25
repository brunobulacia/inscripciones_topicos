import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { CarrerasModule } from './carreras/carreras.module';
import { PlanesDeEstudioModule } from './planes_de_estudio/planes_de_estudio.module';
import { NivelesModule } from './niveles/niveles.module';
import { MateriasModule } from './materias/materias.module';
import { PrerequisitosModule } from './prerequisitos/prerequisitos.module';

@Module({
  imports: [UsersModule, AuthModule, CarrerasModule, PlanesDeEstudioModule, NivelesModule, MateriasModule, PrerequisitosModule],
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
