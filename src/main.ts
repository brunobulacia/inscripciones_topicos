import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { BullMQDashboardService } from './bullmq-dashboard/bullmq-dashboard.service';
import { FileLogger } from './logger/file-logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Register file logger so that Nest logs are also persisted to logs/app.log
  app.useLogger(new FileLogger());
  app.enableCors();
  app.setGlobalPrefix('api');

  // Configuración del Dashboard de BullMQ
  const dashboardService = app.get(BullMQDashboardService);

  // Aplicar middleware de autenticación (opcional)
  const authMiddleware = dashboardService.createAuthMiddleware();

  // Montar el dashboard en la ruta /admin/queues
  app.use('/admin/queues', authMiddleware, dashboardService.getRouter());

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
    .addTag('colas', 'Gestión de Colas Dinámicas')
    .addTag('workers', 'Gestión de Workers')
    .addTag('endpoints', 'Gestión de Endpoints y Encolado Automático')
    .addTag('queue-dashboard', 'Dashboard de Colas')
    .build();

  const host = process.env.HOST || '0.0.0.0';
  const port = process.env.PORT || 3000;

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // await app.listen(port, host);
  await app.listen(port);
}
bootstrap();
