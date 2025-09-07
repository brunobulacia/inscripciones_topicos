import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BullMQDashboardService } from './bullmq-dashboard.service';

@ApiTags('queue-dashboard')
@Controller('admin')
export class BullMQDashboardController {
  constructor(private readonly dashboardService: BullMQDashboardService) {}

  @Get('queues/stats')
  @ApiOperation({ summary: 'Obtener estadísticas de todas las colas' })
  @ApiResponse({
    status: 200,
    description: 'Estadísticas de las colas obtenidas exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nombre de la cola' },
          waiting: { type: 'number', description: 'Trabajos en espera' },
          active: { type: 'number', description: 'Trabajos activos' },
          completed: { type: 'number', description: 'Trabajos completados' },
          failed: { type: 'number', description: 'Trabajos fallidos' },
          delayed: { type: 'number', description: 'Trabajos retrasados' },
        },
      },
    },
  })
  async getQueuesStats() {
    return await this.dashboardService.getQueuesStats();
  }
}
