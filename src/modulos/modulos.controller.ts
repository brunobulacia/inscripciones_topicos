import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { ModulosService } from './modulos.service';
import type { CreateModuloDto } from './dto/create-modulo.dto';
import type { UpdateModuloDto } from './dto/update-modulo.dto';

@Controller('modulos')
export class ModulosController {
  constructor(private readonly moduloService: ModulosService) {}

  @Post()
  create(@Body() createModuloDto: CreateModuloDto) {
    return this.moduloService.create(createModuloDto);
  }

  @Get()
  findAll() {
    return this.moduloService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.moduloService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateModuloDto: UpdateModuloDto) {
    return this.moduloService.update(id, updateModuloDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduloService.remove(id);
  }
}
