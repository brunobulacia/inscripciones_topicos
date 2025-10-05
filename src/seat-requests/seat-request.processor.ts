// ⚠️ DEPRECATED: Este processor basado en Cron Jobs ha sido reemplazado por BullMQ
// Ver: seat-requests.worker.ts para la nueva implementación con BullMQ
// Mantenido como referencia histórica

import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SeatRequestsService } from '../seat-requests/seat-requests.service';

// @Injectable() // Comentado para desactivar
export class SeatRequestProcessor {
  private readonly logger = new Logger(SeatRequestProcessor.name);

  constructor(private readonly seatRequestsService: SeatRequestsService) {}

  /**
   * Ejecuta cada 2 minutos para procesar reservas pendientes
   */
  @Cron('0 */2 * * * *') // Cada 2 minutos
  async processSeatsRequestsBatch() {
    this.logger.log('🔄 Ejecutando procesamiento automático de reservas...');

    try {
      const result =
        await this.seatRequestsService.processPendingSeatRequests();

      if (result.processed > 0) {
        this.logger.log(
          `✅ Batch procesado: ${result.confirmed} confirmadas, ${result.rejected} rechazadas`,
        );
      }
    } catch (error) {
      this.logger.error('❌ Error en procesamiento automático:', error.message);
    }
  }

  /**
   * Ejecuta cada 5 minutos para limpiar reservas expiradas
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async cleanupExpiredRequests() {
    this.logger.log('🧹 Ejecutando limpieza de reservas expiradas...');

    try {
      const expiredCount = await this.seatRequestsService.expireOldRequests();

      if (expiredCount > 0) {
        this.logger.log(`🗑️ ${expiredCount} reservas expiradas eliminadas`);
      }
    } catch (error) {
      this.logger.error('❌ Error en limpieza automática:', error.message);
    }
  }

  /**
   * Método manual para testing
   */
  async processNow() {
    this.logger.log('🚀 Procesamiento manual iniciado...');
    return this.seatRequestsService.processPendingSeatRequests();
  }
}
