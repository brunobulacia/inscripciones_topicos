# Sistema de Encolado Automático Global 🌍

## 🎯 Interceptor Global Activado

El sistema ahora cuenta con un **interceptor global** que captura automáticamente todas las requests HTTP y las encola si están asignadas a colas específicas.

## 🔄 Flujo de Funcionamiento

```
Incoming Request → QueueInterceptor → ¿Endpoint asignado? → [SÍ] → Crear Job → Encolar → Continuar procesamiento normal
                                                         → [NO] → Continuar procesamiento normal
```

## ⚡ Características del Interceptor

### ✅ Funcionalidades Implementadas

- **Intercepción Transparente**: No modifica el comportamiento original de los endpoints
- **Encolado Automático**: Crea jobs automáticamente para endpoints asignados
- **Filtrado Inteligente**: Excluye rutas del sistema (`/api/docs`, `/admin/queues`, etc.)
- **Headers Informativos**: Agrega metadata a las respuestas
- **Sanitización**: Protege headers sensibles (authorization, cookies)
- **Logging Detallado**: Registra todas las operaciones para debugging
- **Manejo de Errores**: Continúa funcionando aunque falle la creación del job

### 🛡️ Rutas Excluidas

El interceptor automáticamente excluye estas rutas del sistema:

- `/api/docs` - Documentación Swagger
- `/api/colas` - API de gestión de colas
- `/api/workers` - API de gestión de workers
- `/api/endpoints` - API de gestión de endpoints
- `/admin/queues` - Dashboard de BullMQ
- `/health` - Health checks
- `/metrics` - Métricas
- `/_next` - Next.js assets
- `/favicon.ico` - Favicon

## 📊 Información Agregada a las Respuestas

Cuando una request es encolada, se agregan estos headers:

```http
X-Queue-Processed: true
X-Queue-Name: nombre-de-la-cola
X-Job-Id: job-uuid
```

En caso de error:

```http
X-Queue-Error: job-creation-failed
```

## 🔧 Configuración

### Activación Global

El interceptor está configurado como global en `app.module.ts`:

```typescript
providers: [
  {
    provide: APP_INTERCEPTOR,
    useClass: QueueInterceptor,
  },
],
```

### Dependencias

El interceptor requiere:

- `EndpointsService` - Para verificar asignaciones
- `ColasService` - Para crear jobs

## 📝 Data del Job Creado

Cada job contiene la siguiente información:

```json
{
  "method": "GET",
  "path": "/api/carreras",
  "query": {
    /* query parameters */
  },
  "params": {
    /* route parameters */
  },
  "body": {
    /* request body */
  },
  "headers": {
    /* sanitized headers */
  },
  "timestamp": "2025-09-17T23:51:36.000Z",
  "endpointId": "endpoint-uuid",
  "userAgent": "Mozilla/5.0...",
  "ip": "127.0.0.1"
}
```

## 🚀 Ejemplo de Uso

### 1. Asignar Endpoint a Cola

```bash
# Crear cola
POST /api/colas
{
  "nombre": "cola-carreras",
  "descripcion": "Cola para procesar carreras"
}

# Asignar endpoint
POST /api/endpoints
{
  "ruta": "/api/carreras",
  "metodo": "GET",
  "colaId": "cola-uuid"
}
```

### 2. Request Automática

```bash
# Esta request será interceptada y encolada automáticamente
GET /api/carreras
```

### 3. Resultado

- ✅ Se crea un job automáticamente en `cola-carreras`
- ✅ El endpoint `/api/carreras` funciona normalmente
- ✅ Headers informativos agregados a la respuesta
- ✅ Job visible en el dashboard de BullMQ

## 📋 Logs del Sistema

El interceptor genera logs detallados:

```
[QueueInterceptor] 🎯 Interceptando GET /api/carreras -> Cola asignada
[QueueInterceptor] 📋 Job creado: job-123 en cola "cola-carreras" para GET /api/carreras
[QueueInterceptor] ✅ Request GET /api/carreras procesada exitosamente
```

## 🔍 Debugging

### Verificar si una ruta está asignada

```bash
GET /api/endpoints/check-route?path=/api/carreras&method=GET
```

### Ver estadísticas del interceptor

```bash
GET /api/endpoints/queue-stats
```

### Monitorear jobs en tiempo real

```bash
# Dashboard visual
http://localhost:3000/admin/queues

# API estadísticas
GET /api/colas/{nombre}/stats
```

## ⚠️ Consideraciones Importantes

### Performance

- El interceptor agrega una consulta a la base de datos por request
- Cache futuro recomendado para endpoints asignados
- Minimal overhead para rutas no asignadas

### Seguridad

- Headers sensibles son sanitizados automáticamente
- Logs no contienen información confidencial
- IPs y User-Agents son registrados para análisis

### Escalabilidad

- Cada job incluye toda la información de la request
- Jobs se configuran con TTL automático (removeOnComplete/removeOnFail)
- Sistema diseñado para alta concurrencia

## 🎛️ Scripts de Prueba

### Demo Completo

```bash
./scripts/demo-global-interceptor.sh
```

### Pruebas de Endpoints

```bash
./scripts/test-auto-queue-endpoints.sh
```

## 🔮 Próximas Mejoras

- [ ] Cache de endpoints asignados para mejor performance
- [ ] Métricas de interceptación en tiempo real
- [ ] Configuración de exclusión de rutas por patrón
- [ ] Rate limiting por cola
- [ ] Retry policies personalizables por endpoint
