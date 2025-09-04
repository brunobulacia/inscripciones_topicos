import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PrerequisitQueueService } from './services/prerequisito-queue.service';
import type { CreatePrerequisitoDto } from './dto/create-prerequisito.dto';
import type { UpdatePrerequisitoDto } from './dto/update-prerequisito.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('prerequisitos')
@ApiBearerAuth()
@Controller('prerequisitos')
export class PrerequisitosController {
  constructor(
    private readonly prerequisitQueueService: PrerequisitQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo prerequisito' })
  @ApiBody({
    description: 'Datos del prerequisito a crear',
    schema: {
      type: 'object',
      properties: {
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Trabajo de creación de prerequisito encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid-job-id' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createPrerequisitoDto: CreatePrerequisitoDto) {
    return this.prerequisitQueueService.create(createPrerequisitoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los prerequisitos' })
  @ApiQuery({
    name: 'skip',
    required: false,
    type: Number,
    description: 'Número de registros a omitir',
  })
  @ApiQuery({
    name: 'take',
    required: false,
    type: Number,
    description: 'Número de registros a tomar',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajo de consulta de prerequisitos encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid-job-id' },
      },
    },
  })
  async findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.prerequisitQueueService.findAll({ page, limit });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener prerequisito por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajo de consulta de prerequisito encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid-job-id' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  findOne(@Param('id') id: string) {
    return this.prerequisitQueueService.findOne({ id });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar prerequisito' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar del prerequisito',
    schema: {
      type: 'object',
      properties: {
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
        esActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description:
      'Trabajo de actualización de prerequisito encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid-job-id' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePrerequisitoDto: UpdatePrerequisitoDto,
  ) {
    return this.prerequisitQueueService.update({
      id,
      ...updatePrerequisitoDto,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar prerequisito' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Trabajo de eliminación de prerequisito encolado exitosamente',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'uuid-job-id' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  remove(@Param('id') id: string) {
    return this.prerequisitQueueService.delete({ id });
  }
}
