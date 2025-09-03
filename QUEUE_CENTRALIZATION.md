# Centralización de Colas - InscripcionesQueue

## Resumen

Todos los servicios de la aplicación ahora utilizan una sola cola centralizada llamada `InscripcionesQueue` en lugar de colas específicas para cada módulo.

## Beneficios de la Centralización

1. **Gestión simplificada**: Una sola cola para administrar
2. **Reducción de recursos**: Menos conexiones a Redis
3. **Monitoreo centralizado**: Todas las tareas en un solo lugar
4. **Configuración unificada**: Una sola configuración de cola
5. **Escalabilidad**: Más fácil de escalar horizontalmente

## Cambios Realizados

### 1. Archivo de Tipos de Colas (`src/common/types/queue.types.ts`)

```typescript
export const QUEUE_NAMES = {
  INSCRIPCIONES: 'InscripcionesQueue',
  // Cola centralizada para todos los servicios
} as const;
```

### 2. Configuración Principal (`src/app.module.ts`)

- Registra únicamente la cola `InscripcionesQueue`
- Configuración global de BullMQ con Redis

### 3. Módulos Individuales

- Removidas las registraciones de colas específicas
- Los servicios y processors ahora usan `QUEUE_NAMES.INSCRIPCIONES`

## Estructura de Jobs

Todos los jobs siguen el patrón:

```typescript
{
  type: 'CREATE_CARRERA' | 'UPDATE_CARRERA' | 'DELETE_CARRERA' | ...,
  data: { /* datos específicos del job */ }
}
```

Los tipos de jobs se distinguen por el campo `type`, permitiendo que diferentes servicios compartan la misma cola.

## Uso en Nuevos Módulos

Para agregar un nuevo módulo que use colas:

1. **En el servicio**:

```typescript
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../common/types/queue.types';

constructor(@InjectQueue(QUEUE_NAMES.INSCRIPCIONES) private queue: Queue) {}
```

2. **En el processor**:

```typescript
import { Processor } from '@nestjs/bullmq';
import { QUEUE_NAMES } from '../common/types/queue.types';

@Processor(QUEUE_NAMES.INSCRIPCIONES)
export class MiProcessor extends WorkerHost {
  // Implementación del processor
}
```

3. **En el módulo**:

```typescript
// NO es necesario importar BullModule.registerQueue()
// La cola ya está registrada globalmente en app.module.ts
```

## Monitoreo

Todas las tareas pueden monitorearse desde:

- La cola única `InscripcionesQueue` en Redis
- Tools de administración como Bull Board
- Logs centralizados por tipo de job

## Migración de Módulos Existentes

Para migrar módulos existentes:

1. Remover `BullModule.registerQueue()` del módulo
2. Cambiar la referencia de cola específica a `QUEUE_NAMES.INSCRIPCIONES`
3. Actualizar processors para usar la cola centralizada
4. Asegurar que los tipos de jobs sean únicos
