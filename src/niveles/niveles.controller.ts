import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NivelesService } from './niveles.service';
import type { CreateNivelDto } from './dto/create-nivele.dto';
import type { UpdateNivelDto } from './dto/update-nivele.dto';

@Controller('niveles')
export class NivelesController {
  constructor(private readonly nivelesService: NivelesService) {}

  @Post()
  create(@Body() createNivelDto: CreateNivelDto) {
    return this.nivelesService.create(createNivelDto);
  }

  @Get()
  findAll() {
    return this.nivelesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.nivelesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateNivelDto: UpdateNivelDto) {
    return this.nivelesService.update(id, updateNivelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.nivelesService.remove(id);
  }
}
