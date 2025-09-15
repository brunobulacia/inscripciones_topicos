import { ConfigurableModuleBuilder } from '@nestjs/common';

export interface BullQueueConfig {
  host: string;
  port: number;
  password?: string;
  db?: number;
  // Configuraciones para alta concurrencia
  maxRetriesPerRequest?: number;
  retryDelayOnFailover?: number;
  enableReadyCheck?: boolean;
  connectTimeout?: number;
  lazyConnect?: boolean;
  family?: number;
  keepAlive?: number;
  // Pool de conexiones
  maxConnections?: number;
  minConnections?: number;
}

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } =
  new ConfigurableModuleBuilder<BullQueueConfig>()
    .setExtras(
      {
        isGlobal: true,
      },
      (definition, extras) => ({
        ...definition,
        global: extras.isGlobal,
      }),
    )
    .build();

// Configuración optimizada para alta concurrencia
export const HIGH_CONCURRENCY_CONFIG: BullQueueConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD,
  db: parseInt(process.env.REDIS_DB || '0', 10),

  // Optimizaciones para alta concurrencia
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  connectTimeout: 10000,
  lazyConnect: true,
  family: 4,
  keepAlive: 30000,

  // Pool de conexiones
  maxConnections: 50, // Aumentar según necesidad
  minConnections: 5,
};

// Configuración de Queue para alta concurrencia
export const QUEUE_OPTIONS = {
  defaultJobOptions: {
    removeOnComplete: 100, // Mantener solo 100 jobs completados
    removeOnFail: 50, // Mantener solo 50 jobs fallidos
    attempts: 3, // Reintentos
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
  settings: {
    stalledInterval: 30 * 1000, // 30 segundos
    maxStalledCount: 1, // Máximo 1 intento si se atasca
  },
};

// Configuración de Worker para alta concurrencia
export const WORKER_OPTIONS = {
  concurrency: 10, // Procesar hasta 10 jobs simultáneamente
  limiter: {
    max: 100, // Máximo 100 jobs por ventana de tiempo
    duration: 1000, // 1 segundo
  },
};
