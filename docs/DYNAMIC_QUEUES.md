# Sistema de Colas Dinámicas con BullMQ y Encolado Automático

Este documento describe la implementación del sistema avanzado de colas dinámicas que permite crear y gestionar múltiples colas de procesamiento de forma dinámica, incluyendo la asignación automática de endpoints a colas específicas.

## 🚀 Características Principales

- **Colas Dinámicas**: Crear, actualizar y eliminar colas en tiempo de ejecución
- **Workers Configurables**: Asignar workers con diferentes niveles de concurrencia a cada cola
- **Endpoints Automáticos**: Asignar endpoints específicos a colas para encolado automático
- **Interceptor Transparente**: Captura requests automáticamente y las encola sin modificar el código existente
- **Persistencia**: Todas las colas, workers y endpoints se almacenan en la base de datos
- **Dashboard Integrado**: Visualización en tiempo real del estado de todas las colas
- **API RESTful**: Endpoints completos para gestionar colas, workers, endpoints y jobs

## 📊 Arquitectura

### Modelos de Base de Datos

#### Cola

```prisma
model Cola {
  id          String    @id @default(uuid())
  nombre      String    @unique
  descripcion String?
  workers     Worker[]
  estaActiva  Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}
```

#### Worker

```prisma
model Worker {
  id           String  @id @default(uuid())
  nombre       String
  concurrencia Int     @default(1)
  colaId       String
  cola         Cola    @relation(fields: [colaId], references: [id])
  estaActivo   Boolean @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@unique([nombre, colaId])
}
```

#### Endpoint

```prisma
model Endpoint {
  id          String   @id @default(uuid())
  ruta        String   // ej: "/api/carreras"
  metodo      String   // ej: "GET", "POST", "PUT", "DELETE"
  descripcion String?
  colaId      String
  cola        Cola     @relation(fields: [colaId], references: [id])
  estaActivo  Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@unique([ruta, metodo])
}
```

## 🔄 Flujo de Encolado Automático

```
Request → QueueInterceptor → Verificar Asignación → Crear Job → Encolar → Worker → Procesar
```

**Ejemplo:**

1. Se asigna `GET /api/carreras` a `Cola1`
2. Cuando llega una request a `GET /api/carreras`
3. El interceptor captura la request automáticamente
4. Se crea un job con los datos de la request
5. El job se encola en `Cola1`
6. Los workers de `Cola1` procesan el job
7. El endpoint original continúa su procesamiento normal

## 🔧 APIs Disponibles

### Gestión de Colas

#### Crear Cola

```bash
POST /api/colas
Content-Type: application/json

{
  "nombre": "procesamiento-datos",
  "descripcion": "Cola para procesamiento de datos en lote"
}
```

#### Listar Colas

```bash
GET /api/colas
```

#### Obtener Cola por ID

```bash
GET /api/colas/{id}
```

#### Obtener Cola por Nombre

```bash
GET /api/colas/by-name/{nombre}
```

#### Actualizar Cola

```bash
PATCH /api/colas/{id}
Content-Type: application/json

{
  "descripcion": "Nueva descripción",
  "estaActiva": true
}
```

#### Desactivar Cola

```bash
DELETE /api/colas/{id}
```

### Gestión de Jobs por Cola

#### Agregar Job a Cola Específica

```bash
POST /api/colas/{nombre}/jobs
Content-Type: application/json

{
  "name": "procesar-archivo",
  "data": {
    "archivo": "datos.csv",
    "tipo": "batch"
  },
  "opts": {
    "delay": 0,
    "attempts": 3
  }
}
```

#### Obtener Estadísticas de Cola

```bash
GET /api/colas/{nombre}/stats
```

#### Obtener Jobs de Cola

```bash
GET /api/colas/{nombre}/jobs?status=waiting
# status: waiting | active | completed | failed
```

### Gestión de Workers

#### Crear Worker

```bash
POST /api/workers
Content-Type: application/json

{
  "nombre": "worker-procesamiento-1",
  "concurrencia": 3,
  "colaId": "uuid-de-la-cola"
}
```

#### Listar Workers

```bash
GET /api/workers
```

#### Obtener Workers por Cola

```bash
GET /api/workers/by-cola/{colaId}
```

#### Obtener Estadísticas de Workers

```bash
GET /api/workers/stats
```

#### Actualizar Worker

```bash
PATCH /api/workers/{id}
Content-Type: application/json

{
  "concurrencia": 5,
  "estaActivo": true
}
```

#### Desactivar Worker

```bash
DELETE /api/workers/{id}
```

### Gestión de Endpoints

#### Crear Endpoint (Asignar ruta a cola)

```bash
POST /api/endpoints
Content-Type: application/json

{
  "ruta": "/api/carreras",
  "metodo": "GET",
  "descripcion": "Listar todas las carreras",
  "colaId": "uuid-de-la-cola"
}
```

#### Listar Endpoints

```bash
GET /api/endpoints
```

#### Obtener Endpoints por Cola

```bash
GET /api/endpoints/by-cola/{colaId}
GET /api/endpoints/by-cola-name/{nombreCola}
```

#### Verificar si una ruta está asignada

```bash
GET /api/endpoints/check-route?path=/api/carreras&method=GET
```

#### Asignar endpoint a cola específica

```bash
POST /api/endpoints/colas/{colaId}/assign
Content-Type: application/json

{
  "ruta": "/api/carreras",
  "metodo": "POST",
  "descripcion": "Crear nueva carrera"
}
```

#### Desasignar endpoint de cola

```bash
DELETE /api/endpoints/colas/{colaId}/unassign
Content-Type: application/json

{
  "ruta": "/api/carreras",
  "metodo": "POST"
}
```

#### Obtener Estadísticas de Endpoints

```bash
GET /api/endpoints/stats
GET /api/endpoints/queue-stats
```

#### Actualizar Endpoint

```bash
PATCH /api/endpoints/{id}
Content-Type: application/json

{
  "descripcion": "Nueva descripción",
  "estaActivo": true
}
```

#### Desactivar Endpoint

```bash
DELETE /api/endpoints/{id}
```

## 🎛️ Dashboard

El dashboard de BullMQ está disponible en:

- **URL**: `http://localhost:3000/admin/queues`
- **Funcionalidades**:
  - Visualizar estado de todas las colas
  - Monitorear jobs en tiempo real
  - Ver métricas de rendimiento
  - Gestionar jobs (retry, remove, etc.)

## 🧪 Pruebas

### Script de Prueba Automatizada

```bash
# Ejecutar el script de prueba completo
./scripts/test-dynamic-queues.sh
```

### Pruebas Manuales con curl

1. **Crear una cola de prueba:**

```bash
curl -X POST http://localhost:3000/api/colas \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "test-queue",
    "descripcion": "Cola de prueba"
  }'
```

2. **Crear un worker para la cola:**

```bash
curl -X POST http://localhost:3000/api/workers \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "test-worker",
    "concurrencia": 2,
    "colaId": "ID_DE_LA_COLA"
  }'
```

3. **Agregar un job:**

```bash
curl -X POST http://localhost:3000/api/colas/test-queue/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "name": "test-job",
    "data": {"message": "Hello World"}
  }'
```

## 🔄 Migración desde Sistema Anterior

La nueva arquitectura coexiste con el sistema anterior. Para migrar:

1. **Crear nuevas colas** usando la API
2. **Asignar workers** según necesidades
3. **Migrar jobs gradualmente** de la cola centralizada a las nuevas colas
4. **Desactivar la cola antigua** cuando no se necesite

## 📈 Beneficios

- **Escalabilidad**: Cada cola puede tener configuración independiente
- **Aislamiento**: Errores en una cola no afectan otras
- **Flexibilidad**: Diferentes tipos de procesamiento en colas separadas
- **Monitoreo**: Métricas específicas por cola
- **Mantenimiento**: Gestión granular de workers y jobs

## 🛠️ Configuración Avanzada

### Variables de Entorno

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=optional
REDIS_DB=0
```

### Opciones de Queue (configurables por cola)

- `removeOnComplete`: Número de jobs completados a mantener
- `removeOnFail`: Número de jobs fallidos a mantener
- `attempts`: Número de reintentos por job
- `backoff`: Estrategia de backoff

### Opciones de Worker (configurables por worker)

- `concurrency`: Número de jobs simultáneos
- `limiter`: Limitación de tasa de procesamiento

## 🔍 Troubleshooting

### Problemas Comunes

1. **Cola no se crea en BullMQ**
   - Verificar conexión a Redis
   - Revisar logs del servicio

2. **Worker no procesa jobs**
   - Verificar que el worker esté activo
   - Comprobar la cola asociada

3. **Jobs se quedan en pending**
   - Verificar que hay workers activos
   - Revisar configuración de concurrencia

### Logs

Los logs del sistema incluyen información detallada sobre:

- Creación/eliminación de colas
- Inicio/parada de workers
- Procesamiento de jobs
- Errores de conexión

## 🔮 Próximas Mejoras

- [ ] Procesadores personalizados por cola
- [ ] Métricas avanzadas y alertas
- [ ] Interfaz web para gestión
- [ ] Schedulers automáticos
- [ ] Load balancing entre workers
