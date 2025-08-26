import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { GestionesService } from './gestiones.service';
import type { CreateGestionDto } from './dto/create-gestion.dto';
import type { UpdateGestionDto } from './dto/update-gestion.dto';

@Controller('gestiones')
export class GestionesController {
  constructor(private readonly gestionService: GestionesService) {}

  @Post()
  create(@Body() createGestionDto: CreateGestionDto) {
    return this.gestionService.create(createGestionDto);
  }

  @Get()
  findAll() {
    return this.gestionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gestionService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGestionDto: UpdateGestionDto) {
    return this.gestionService.update(id, updateGestionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.gestionService.remove(id);
  }
}
