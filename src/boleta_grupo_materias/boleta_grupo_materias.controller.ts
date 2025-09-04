import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BoletaGrupoMateriasService } from './boleta_grupo_materias.service';
import { BoletaGrupoMateriaQueueService } from './services/boleta-grupo-materia-queue.service';
import type { CreateBoletaGrupoMateriaDto } from './dto/create-boleta_grupo_materia.dto';
import type { UpdateBoletaGrupoMateriaDto } from './dto/update-boleta_grupo_materia.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('boleta-grupo-materias')
@ApiBearerAuth()
@Controller('boleta-grupo-materias')
export class BoletaGrupoMateriasController {
  constructor(
    private readonly boletaGrupoMateriaQueueService: BoletaGrupoMateriaQueueService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Crear nueva boleta grupo materia' })
  @ApiBody({
    description: 'Datos de la boleta grupo materia a crear',
    schema: {
      type: 'object',
      properties: {
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para crear boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  create(@Body() createBoletaGrupoMateriaDto: CreateBoletaGrupoMateriaDto) {
    return this.boletaGrupoMateriaQueueService.createBoletaGrupoMateria(
      createBoletaGrupoMateriaDto,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todas las boletas grupo materias' })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener boletas grupo materias',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  findAll() {
    return this.boletaGrupoMateriaQueueService.findAllBoletaGrupoMaterias();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener boleta grupo materia por ID' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para obtener boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  findOne(@Param('id') id: string) {
    return this.boletaGrupoMateriaQueueService.findOneBoletaGrupoMateria(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar boleta grupo materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiBody({
    description: 'Datos a actualizar de la boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        boletaInscripcionId: { type: 'string', example: 'uuid-boleta' },
        grupoMateriaId: { type: 'string', example: 'uuid-grupo-materia' },
        nota: { type: 'number', example: 85.5 },
      },
    },
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para actualizar boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  update(
    @Param('id') id: string,
    @Body() updateBoletaGrupoMateriaDto: UpdateBoletaGrupoMateriaDto,
  ) {
    return this.boletaGrupoMateriaQueueService.updateBoletaGrupoMateria(
      id,
      updateBoletaGrupoMateriaDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar boleta grupo materia' })
  @ApiParam({
    name: 'id',
    description: 'ID de la boleta grupo materia',
    example: 'uuid-example',
  })
  @ApiResponse({
    status: 202,
    description: 'Job encolado para eliminar boleta grupo materia',
    schema: {
      type: 'object',
      properties: {
        jobId: { type: 'string' },
        message: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Boleta grupo materia no encontrada',
  })
  remove(@Param('id') id: string) {
    return this.boletaGrupoMateriaQueueService.deleteBoletaGrupoMateria(id);
  }
}
