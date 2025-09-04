# Sistema de Queue Genérico - Interceptor Pattern

## Descripción

Este sistema implementa un patrón de interceptor genérico para manejar jobs en colas sin hardcodear nombres de operaciones ni entidades. Utiliza el patrón Strategy/Command para serializar y deserializar automáticamente los payloads de los jobs.

## Arquitectura

### 1. Componentes Base

- **`BaseQueueProcessor`**: Clase base abstracta que maneja automáticamente el routing de jobs
- **`QueueJobSerializer`**: Servicio para serializar/deserializar jobs basado en convenciones de nombres
- **`QueueJobHandlerRegistry`**: Registry para registrar handlers específicos por entidad y operación
- **`JobHandler`**: Interface genérica que deben implementar todos los handlers

### 2. Convención de Nombres

Los jobs siguen el patrón: `{OPERATION}_{ENTITY}`

Ejemplos:

- `CREATE_CARRERA`
- `FIND_ALL_NIVELES`
- `UPDATE_MATERIA`
- `DELETE_ESTUDIANTE`

### 3. Flujo de Procesamiento

```
Job Recibido → Serializer → Registry → Handler Específico → Resultado
```

## Implementación por Entidad

### Para cada nueva entidad, necesitas:

1. **Crear Handlers** (`handlers/entity.handlers.ts`):

```typescript
@Injectable()
export class CreateEntityHandler implements JobHandler<CreateEntityJobData> {
  constructor(private readonly entityService: EntityService) {}

  async handle(data: CreateEntityJobData) {
    return await this.entityService.create(data);
  }
}
```

2. **Crear Processor** (`processors/entity.processor.ts`):

```typescript
@Injectable()
@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class EntityProcessor extends BaseQueueProcessor {
  constructor(
    jobSerializer: QueueJobSerializer,
    handlerRegistry: QueueJobHandlerRegistry,
    private readonly createHandler: CreateEntityHandler,
    // ... otros handlers
  ) {
    super(jobSerializer, handlerRegistry);
  }

  registerHandlers(): void {
    this.handlerRegistry.register('entity', 'create', this.createHandler);
    // ... registrar otros handlers
  }
}
```

3. **Actualizar Module**:

```typescript
@Module({
  providers: [
    EntityService,
    EntityProcessor,
    CreateEntityHandler,
    // ... otros handlers
  ],
})
export class EntityModule {}
```

## Beneficios

### Antes (Hardcodeado):

```typescript
async process(job: Job): Promise<JobResult> {
  switch (job.name) {
    case CarreraJobType.CREATE:
      return await this.handleCreateCarrera(job.data);
    case CarreraJobType.FIND_ALL:
      return await this.handleFindAllCarreras();
    // ... más cases hardcodeados
  }
}
```

### Después (Genérico):

```typescript
// No necesitas escribir esto - ya está en BaseQueueProcessor
async process(job: Job): Promise<BaseJobResult> {
  const { entity, operation } = this.jobSerializer.parseJobName(job.name);
  const handler = this.handlerRegistry.getHandler(entity, operation);
  return await handler.handle(job.data);
}
```

## Características

1. **Sin Hardcoding**: No más switch/case statements
2. **Escalable**: Fácil agregar nuevas entidades y operaciones
3. **Mantenible**: Separación clara de responsabilidades
4. **Reutilizable**: Los mismos componentes base para todas las entidades
5. **Type-Safe**: Mantiene la seguridad de tipos con TypeScript

## Debugging

El sistema incluye logging automático:

- Registro de handlers al inicializar
- Logs de procesamiento de jobs
- Manejo de errores centralizado

Para ver handlers registrados:

```typescript
this.handlerRegistry.listHandlers(); // ['carrera.create', 'carrera.find_all', ...]
```

## Estado Actual

✅ Implementado para `Carrera`
✅ Implementado para `Nivel`
🔄 Listo para agregar más entidades siguiendo el mismo patrón

## Próximos Pasos

Para agregar una nueva entidad (ej: `Materia`):

1. Crear `src/materias/handlers/materia.handlers.ts`
2. Actualizar `src/materias/processors/materia.processor.ts`
3. Agregar providers al `src/materias/materias.module.ts`

El sistema automáticamente manejará jobs como `CREATE_MATERIA`, `FIND_ALL_MATERIAS`, etc.
