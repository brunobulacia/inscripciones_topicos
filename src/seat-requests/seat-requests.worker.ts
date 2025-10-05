import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { SeatRequestsService } from './seat-requests.service';

@Processor('seat-processing')
export class SeatRequestsWorker extends WorkerHost {
  private readonly logger = new Logger(SeatRequestsWorker.name);

  constructor(private readonly seatRequestsService: SeatRequestsService) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`🔄 [${job.name}] Procesando job: ${job.id}`);

    try {
      switch (job.name) {
        case 'process-seat-requests':
          return await this.handleProcessSeatRequests(job);

        case 'expire-seat-requests':
          return await this.handleExpireSeatRequests(job);

        default:
          this.logger.warn(`⚠️ Tipo de job desconocido: ${job.name}`);
          throw new Error(`Tipo de job no soportado: ${job.name}`);
      }
    } catch (error) {
      this.logger.error(`❌ Error procesando job ${job.id}:`, error.message);
      throw error;
    }
  }

  /**
   * Procesar reservas de asientos pendientes
   */
  private async handleProcessSeatRequests(job: Job) {
    const { triggerType, seatRequestId } = job.data;

    this.logger.log(`🎯 Procesando reservas (trigger: ${triggerType})`);

    if (triggerType === 'immediate' && seatRequestId) {
      // Procesamiento específico para una reserva
      this.logger.log(
        `⚡ Procesamiento inmediato para reserva: ${seatRequestId}`,
      );
    }

    // Procesar todas las reservas pendientes en batch
    const result = await this.seatRequestsService.processSeatsRequestsBatch();

    this.logger.log(
      `✅ Batch procesado: ${result.confirmed} confirmadas, ${result.rejected} rechazadas`,
    );

    return {
      success: true,
      message: `Procesadas ${result.processed} reservas`,
      details: result,
      processedAt: new Date().toISOString(),
      triggerType,
      jobId: job.id,
    };
  }

  /**
   * Expirar reservas antiguas
   */
  private async handleExpireSeatRequests(job: Job) {
    const { seatRequestId } = job.data;

    this.logger.log(`⏰ Verificando expiración de reservas`);

    const expiredCount =
      await this.seatRequestsService.expireSeatsRequestsBatch();

    if (expiredCount > 0) {
      this.logger.log(`🗑️ ${expiredCount} reservas marcadas como expiradas`);
    }

    return {
      success: true,
      message: `${expiredCount} reservas expiradas`,
      expiredCount,
      processedAt: new Date().toISOString(),
      jobId: job.id,
    };
  }
}
