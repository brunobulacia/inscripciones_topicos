import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AulasService } from './aulas.service';
import type { CreateAulaDto } from './dto/create-aula.dto';
import type { UpdateAulaDto } from './dto/update-aula.dto';

@Controller('aulas')
export class AulasController {
  constructor(private readonly aulaService: AulasService) {}

  @Post()
  create(@Body() createAulaDto: CreateAulaDto) {
    return this.aulaService.create(createAulaDto);
  }

  @Get()
  findAll() {
    return this.aulaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aulaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAulaDto: UpdateAulaDto) {
    return this.aulaService.update(id, updateAulaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aulaService.remove(id);
  }
}
