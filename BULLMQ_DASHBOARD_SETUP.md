# Dashboard de BullMQ - Sistema de Inscripciones

## 📊 Descripción

El dashboard de BullMQ proporciona una interfaz web visual para monitorear y gestionar las colas de trabajos en tiempo real. Permite ver estadísticas, gestionar trabajos, y diagnosticar problemas en el sistema de colas.

## 🚀 Acceso al Dashboard

### Interfaz Web Principal

- **URL**: `http://localhost:3000/admin/queues`
- **Descripción**: Interfaz visual completa para gestionar colas
- **Características**:
  - Vista en tiempo real de trabajos
  - Gestión de trabajos (retry, delete, etc.)
  - Gráficos de estadísticas
  - Filtros y búsqueda

### API de Estadísticas

- **URL**: `http://localhost:3000/api/admin/queues/stats`
- **Método**: GET
- **Descripción**: Endpoint JSON con estadísticas de todas las colas
- **Respuesta**:

```json
[
  {
    "name": "inscripciones",
    "waiting": 5,
    "active": 2,
    "completed": 100,
    "failed": 3,
    "delayed": 1
  }
]
```

## 🔧 Configuración

### Autenticación (Desarrollo vs Producción)

Por defecto, el dashboard está configurado para:

- **Desarrollo**: Acceso libre sin autenticación
- **Producción**: Requiere token Bearer en el header `Authorization`

### Variables de Entorno

```bash
# Configuración de Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_password  # opcional

# Configuración del dashboard
NODE_ENV=development  # o 'production'
DASHBOARD_AUTH_REQUIRED=false  # para desarrollo
```

## 📋 Colas Registradas

El sistema actualmente registra las siguientes colas:

1. **inscripciones**: Procesa inscripciones de estudiantes
   - Trabajos de validación
   - Generación de boletas
   - Notificaciones

## 🔍 Funcionalidades del Dashboard

### Vista General

- Estado actual de todas las colas
- Cantidad de trabajos por estado
- Métricas de rendimiento

### Gestión de Trabajos

- **Retry**: Reintentar trabajos fallidos
- **Delete**: Eliminar trabajos específicos
- **Bulk Actions**: Acciones masivas
- **Job Details**: Detalles completos de cada trabajo

### Filtros y Búsqueda

- Filtrar por estado del trabajo
- Buscar por ID de trabajo
- Filtrar por rango de fechas

### Estadísticas en Tiempo Real

- Gráficos de throughput
- Historial de trabajos
- Métricas de latencia

## 🛠️ Uso Programático

### Agregar Nuevas Colas al Dashboard

```typescript
// En tu servicio
@Injectable()
export class MiServicio {
  constructor(
    @InjectQueue('mi-nueva-cola') private miCola: Queue,
    private dashboardService: BullMQDashboardService,
  ) {
    // Registrar la cola en el dashboard
    this.dashboardService.addQueue(this.miCola);
  }
}
```

### Obtener Estadísticas Programáticamente

```typescript
// Desde cualquier servicio
const stats = await this.dashboardService.getQueuesStats();
console.log('Estadísticas de colas:', stats);
```

## 🔒 Seguridad

### Configuración de Autenticación Personalizada

Para agregar autenticación personalizada, modifica el método `createAuthMiddleware` en `BullMQDashboardService`:

```typescript
createAuthMiddleware() {
  return (req: Request, res: Response, next: Function) => {
    // Tu lógica de autenticación personalizada
    const token = req.headers.authorization?.substring(7);

    if (!this.isValidToken(token)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    next();
  };
}
```

### Restricción por IP

```typescript
createAuthMiddleware() {
  const allowedIPs = ['127.0.0.1', '::1']; // Solo localhost

  return (req: Request, res: Response, next: Function) => {
    const clientIP = req.ip || req.connection.remoteAddress;

    if (!allowedIPs.includes(clientIP)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
}
```

## 📈 Monitoreo y Alertas

### Configurar Alertas

Puedes usar las estadísticas para configurar alertas:

```typescript
// Ejemplo de servicio de monitoreo
@Injectable()
@Cron('*/5 * * * *') // Cada 5 minutos
export class MonitoringService {
  async checkQueueHealth() {
    const stats = await this.dashboardService.getQueuesStats();

    for (const queue of stats) {
      if (queue.failed > 10) {
        // Enviar alerta por muchos trabajos fallidos
        this.alertService.sendAlert(
          `Cola ${queue.name} tiene ${queue.failed} trabajos fallidos`,
        );
      }

      if (queue.waiting > 100) {
        // Enviar alerta por cola saturada
        this.alertService.sendAlert(
          `Cola ${queue.name} tiene ${queue.waiting} trabajos en espera`,
        );
      }
    }
  }
}
```

## 🐛 Troubleshooting

### Problemas Comunes

1. **Dashboard no carga**: Verificar que Redis esté ejecutándose
2. **Colas no aparecen**: Verificar que estén registradas en `QueueRegistrationService`
3. **Error 401**: Verificar configuración de autenticación
4. **Error de conexión**: Verificar configuración de Redis

### Logs Útiles

```bash
# Ver logs de la aplicación
npm run start:dev

# Verificar conexión a Redis
redis-cli ping

# Ver trabajos en Redis directamente
redis-cli
> LLEN bull:inscripciones:waiting
```

## 🔄 Actualización y Mantenimiento

### Agregar Nuevas Colas

1. Crear la cola en tu módulo
2. Inyectar en `QueueRegistrationService`
3. Llamar a `dashboardService.addQueue(nuevaCola)`

### Actualizar Configuración

Las configuraciones se pueden actualizar sin reiniciar la aplicación modificando las variables de entorno y reiniciando solo el dashboard service.

---

## 📞 Soporte

Para más información sobre BullMQ y Bull Board:

- [Documentación de BullMQ](https://docs.bullmq.io/)
- [Documentación de Bull Board](https://github.com/felixmosh/bull-board)
