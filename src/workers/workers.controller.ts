import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto, WorkerResponseDto } from './dto';

@ApiTags('workers')
@ApiBearerAuth()
@Controller('workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo worker' })
  @ApiResponse({
    status: 201,
    description: 'Worker creado exitosamente',
    type: WorkerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Cola no encontrada' })
  @ApiResponse({ status: 409, description: 'Worker con ese nombre ya existe para la cola' })
  async create(@Body() createWorkerDto: CreateWorkerDto): Promise<WorkerResponseDto> {
    return this.workersService.create(createWorkerDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los workers activos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de workers',
    type: [WorkerResponseDto],
  })
  async findAll(): Promise<WorkerResponseDto[]> {
    return this.workersService.findAll();
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de workers' })
  @ApiResponse({ status: 200, description: 'Estadísticas de workers' })
  async getWorkerStats(): Promise<any> {
    return this.workersService.getWorkerStats();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un worker por ID' })
  @ApiParam({ name: 'id', description: 'ID del worker' })
  @ApiResponse({
    status: 200,
    description: 'Worker encontrado',
    type: WorkerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Worker no encontrado' })
  async findOne(@Param('id') id: string): Promise<WorkerResponseDto> {
    return this.workersService.findOne(id);
  }

  @Get('by-cola/:colaId')
  @ApiOperation({ summary: 'Obtener workers por ID de cola' })
  @ApiParam({ name: 'colaId', description: 'ID de la cola' })
  @ApiResponse({
    status: 200,
    description: 'Lista de workers para la cola',
    type: [WorkerResponseDto],
  })
  async findByColaId(@Param('colaId') colaId: string): Promise<WorkerResponseDto[]> {
    return this.workersService.findByColaId(colaId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un worker' })
  @ApiParam({ name: 'id', description: 'ID del worker' })
  @ApiResponse({
    status: 200,
    description: 'Worker actualizado exitosamente',
    type: WorkerResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Worker no encontrado' })
  @ApiResponse({ status: 409, description: 'Worker con ese nombre ya existe para la cola' })
  async update(
    @Param('id') id: string,
    @Body() updateWorkerDto: UpdateWorkerDto,
  ): Promise<WorkerResponseDto> {
    return this.workersService.update(id, updateWorkerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Desactivar un worker' })
  @ApiParam({ name: 'id', description: 'ID del worker' })
  @ApiResponse({ status: 204, description: 'Worker desactivado exitosamente' })
  @ApiResponse({ status: 404, description: 'Worker no encontrado' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workersService.remove(id);
  }
}