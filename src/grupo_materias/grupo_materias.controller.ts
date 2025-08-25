import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { GrupoMateriasService } from './grupo_materias.service';
import type { CreateGrupoMateriaDto } from './dto/create-grupo_materia.dto';
import type { UpdateGrupoMateriaDto } from './dto/update-grupo_materia.dto';

@Controller('grupo-materias')
export class GrupoMateriasController {
  constructor(private readonly grupoMateriasService: GrupoMateriasService) {}

  @Post()
  create(@Body() createGrupoMateriaDto: CreateGrupoMateriaDto) {
    return this.grupoMateriasService.create(createGrupoMateriaDto);
  }

  @Get()
  findAll() {
    return this.grupoMateriasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.grupoMateriasService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateGrupoMateriaDto: UpdateGrupoMateriaDto,
  ) {
    return this.grupoMateriasService.update(id, updateGrupoMateriaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.grupoMateriasService.remove(id);
  }
}
