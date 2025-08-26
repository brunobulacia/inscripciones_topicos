import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AulaGrupoMateriasService } from './aula_grupo_materias.service';
import type { CreateAulaGrupoMateriaDto } from './dto/create-aula_grupo_materia.dto';
import type { UpdateAulaGrupoMateriaDto } from './dto/update-aula_grupo_materia.dto';

@Controller('aula-grupo-materias')
export class AulaGrupoMateriasController {
  constructor(
    private readonly aulaGrupoMateriaService: AulaGrupoMateriasService,
  ) {}

  @Post()
  create(@Body() createAulaGrupoMateriaDto: CreateAulaGrupoMateriaDto) {
    return this.aulaGrupoMateriaService.create(createAulaGrupoMateriaDto);
  }

  @Get()
  findAll() {
    return this.aulaGrupoMateriaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulaGrupoMateriaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAulaGrupoMateriaDto: UpdateAulaGrupoMateriaDto,
  ) {
    return this.aulaGrupoMateriaService.update(id, updateAulaGrupoMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulaGrupoMateriaService.remove(id);
  }
}
