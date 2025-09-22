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
  constructor(private readonly prerequisitosService: PrerequisitosService) {}

  //METODOS SINCRONOS
  @Get('')
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

  @Get('/:id')
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

  @Post('')
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

  @Patch('/:id')
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

  @Delete('/:id')
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
  @Get('/async/')
  findAllAsync() {
    return this.prerequisitosService.findAll();
  }

  @Get('/async/:id')
  findOneAsync(@Param('id') id: string) {
    return this.prerequisitosService.findOne(id);
  }

  @Post('/async/')
  createAsync(@Body() createPrerequisitoDto: CreatePrerequisitoDto) {
    return this.prerequisitosService.create(createPrerequisitoDto);
  }

  @Patch('/async/:id')
  updateAsync(
    @Param('id') id: string,
    @Body() updatePrerequisitoDto: UpdatePrerequisitoDto,
  ) {
    return this.prerequisitosService.update(id, updatePrerequisitoDto);
  }

  @Delete('/async/:id')
  removeAsync(@Param('id') id: string) {
    return this.prerequisitosService.remove(id);
  }
}
