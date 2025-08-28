import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
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
} from '@nestjs/swagger';

@ApiTags('prerequisitos')
@ApiBearerAuth()
@Controller('prerequisitos')
export class PrerequisitosController {
  constructor(private readonly prerequisitosService: PrerequisitosService) {}

  @Post()
  @ApiOperation({ summary: 'Crear nuevo prerequisito' })
  @ApiBody({
    description: 'Datos del prerequisito a crear',
    schema: {
      type: 'object',
      properties: {
        siglaMateria: { type: 'string', example: 'uuid-materia' },
        siglaPrerequisito: { type: 'string', example: 'uuid-prerequisito' },
        esActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Prerequisito creado exitosamente' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El prerequisito ya existe' })
  create(@Body() createPrerequisitoDto: CreatePrerequisitoDto) {
    return this.prerequisitosService.create(createPrerequisitoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los prerequisitos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de prerequisitos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          siglaMateria: { type: 'string' },
          siglaPrerequisito: { type: 'string' },
          esActivo: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    },
  })
  findAll() {
    return this.prerequisitosService.findAll();
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
    description: 'Prerequisito encontrado',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        siglaMateria: { type: 'string' },
        siglaPrerequisito: { type: 'string' },
        esActivo: { type: 'boolean' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  findOne(@Param('id') id: string) {
    return this.prerequisitosService.findOne(id);
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
    description: 'Prerequisito actualizado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updatePrerequisitoDto: UpdatePrerequisitoDto,
  ) {
    return this.prerequisitosService.update(id, updatePrerequisitoDto);
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
    description: 'Prerequisito eliminado exitosamente',
  })
  @ApiResponse({ status: 404, description: 'Prerequisito no encontrado' })
  remove(@Param('id') id: string) {
    return this.prerequisitosService.remove(id);
  }
}
