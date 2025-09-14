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
import { PrerequisitosService } from './prerequisitos.service';
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
    private readonly prerequisitosService: PrerequisitosService,
    private readonly prerequisitQueueService: PrerequisitQueueService,
  ) {}

  //METODOS SINCRONOS
  @Get('/sync')
  @ApiOperation({ summary: 'Obtener todos los prerequisitos (sincrónico)' })
  @ApiResponse({
    status: 200,
    description: 'Prerequisitos obtenidos exitosamente',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'uuid-example' },
          siglaMateria: { type: 'string', example: 'uuid-materia' },
          siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
          esActivo: { type: 'boolean', example: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.prerequisitosService.findAll();
  }

  @Get('/sync/:id')
  @ApiOperation({ summary: 'Obtener prerequisito por ID (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Prerequisito obtenido exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
        esActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  findOne(@Param('id') id: string) {
    return this.prerequisitosService.findOne(id);
  }

  @Post('/sync')
  @ApiOperation({ summary: 'Crear nuevo prerequisito (sincrónico)' })
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
    description: 'Prerequisito creado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
        esActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createPrerequisitoDto: CreatePrerequisitoDto) {
    return this.prerequisitosService.create(createPrerequisitoDto);
  }

  @Patch('/sync/:id')
  @ApiOperation({ summary: 'Actualizar prerequisito (sincrónico)' })
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
    description: 'Prerequisito actualizado exitosamente',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string', example: 'uuid-example' },
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
        esActivo: { type: 'boolean', example: true },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePrerequisitoDto: UpdatePrerequisitoDto,
  ) {
    return this.prerequisitosService.update(id, updatePrerequisitoDto);
  }

  @Delete('/sync/:id')
  @ApiOperation({ summary: 'Eliminar prerequisito (sincrónico)' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 200,
    description: 'Prerequisito eliminado exitosamente',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Prerequisito eliminado exitosamente',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  remove(@Param('id') id: string) {
    return this.prerequisitosService.remove(id);
  }

  //METODOS ASINCRONOS
  @Post('/async')
  @ApiOperation({ summary: 'Crear nuevo prerequisito (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para crear prerequisito',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para crear prerequisito',
        },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async createQueue(@Body() createPrerequisitoDto: CreatePrerequisitoDto) {
    const result = await this.prerequisitQueueService.create(
      createPrerequisitoDto,
    );
    return {
      ...result,
      message: 'Job encolado para crear prerequisito',
    };
  }

  @Get('/async')
  @ApiOperation({ summary: 'Obtener todos los prerequisitos (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para obtener prerequisitos',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener prerequisitos',
        },
      },
    },
  })
  async findAllQueue(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const result = await this.prerequisitQueueService.findAll({ page, limit });
    return {
      ...result,
      message: 'Job encolado para obtener prerequisitos',
    };
  }

  @Get('/async/:id')
  @ApiOperation({ summary: 'Obtener prerequisito por ID (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener prerequisito',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para obtener prerequisito',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  async findOneQueue(@Param('id') id: string) {
    const result = await this.prerequisitQueueService.findOne({ id });
    return {
      ...result,
      message: 'Job encolado para obtener prerequisito',
    };
  }

  @Patch('/async/:id')
  @ApiOperation({ summary: 'Actualizar prerequisito (asíncrono)' })
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
    status: 202,
    description: 'Job encolado para actualizar prerequisito',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para actualizar prerequisito',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  async updateQueue(
    @Param('id') id: string,
    @Body() updatePrerequisitoDto: UpdatePrerequisitoDto,
  ) {
    const result = await this.prerequisitQueueService.update({
      id,
      ...updatePrerequisitoDto,
    });
    return {
      ...result,
      message: 'Job encolado para actualizar prerequisito',
    };
  }

  @Delete('/async/:id')
  @ApiOperation({ summary: 'Eliminar prerequisito (asíncrono)' })
  @ApiParam({
    name: 'id',
    description: 'ID del prerequisito',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar prerequisito',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string', example: 'job-uuid' },
        message: {
          type: 'string',
          example: 'Job encolado para eliminar prerequisito',
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  async removeQueue(@Param('id') id: string) {
    const result = await this.prerequisitQueueService.delete({ id });
    return {
      ...result,
      message: 'Job encolado para eliminar prerequisito',
    };
  }
}
