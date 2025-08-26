import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { PeriodosService } from './periodos.service';
import type { CreatePeriodoDto } from './dto/create-periodo.dto';
import type { UpdatePeriodoDto } from './dto/update-periodo.dto';

@Controller('periodos')
export class PeriodosController {
  constructor(private readonly periodoService: PeriodosService) {}

  @Post()
  create(@Body() createPeriodoDto: CreatePeriodoDto) {
    return this.periodoService.create(createPeriodoDto);
  }

  @Get()
  findAll() {
    return this.periodoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.periodoService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePeriodoDto: UpdatePeriodoDto) {
    return this.periodoService.update(id, updatePeriodoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.periodoService.remove(id);
  }
}
