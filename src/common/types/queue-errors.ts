/**
 * Error de negocio que debería reportarse como job exitoso pero con error
 * Estos no fallan el job en BullMQ, solo se reportan en el resultado
 */
export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'BusinessError';
  }
}

/**
 * Error del sistema que debe fallar el job en BullMQ
 * Estos aparecerán en la lista de jobs fallados
 */
export class SystemError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SystemError';
  }
}
