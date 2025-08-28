import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.setGlobalPrefix('api');

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('Sistema de Inscripciones API')
    .setDescription('API para el sistema de inscripciones universitarias')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticación')
    .addTag('carreras', 'Gestión de Carreras')
    .addTag('planes-de-estudio', 'Planes de Estudio')
    .addTag('niveles', 'Niveles Académicos')
    .addTag('materias', 'Materias')
    .addTag('prerequisitos', 'Prerequisites')
    .addTag('grupo-materias', 'Grupos de Materias')
    .addTag('docentes', 'Docentes')
    .addTag('estudiantes', 'Estudiantes')
    .addTag('fichas-inscripcion', 'Fichas de Inscripción')
    .addTag('detalles-inscripcion', 'Detalles de Inscripción')
    .addTag('modulos', 'Módulos')
    .addTag('aulas', 'Aulas')
    .addTag('gestiones', 'Gestiones')
    .addTag('periodos', 'Periodos')
    .addTag('boleta-inscripcion', 'Boletas de Inscripción')
    .addTag('avance-academico', 'Avance Académico')
    .addTag('horarios', 'Horarios')
    .addTag('aula-grupo-materias', 'Aula Grupo Materias')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
