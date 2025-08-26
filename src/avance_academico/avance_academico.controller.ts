import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AvanceAcademicoService } from './avance_academico.service';
import type { CreateAvanceAcademicoDto } from './dto/create-avance_academico.dto';
import type { UpdateAvanceAcademicoDto } from './dto/update-avance_academico.dto';

@Controller('avances-academicos')
export class AvanceAcademicoController {
  constructor(
    private readonly avanceAcademicoService: AvanceAcademicoService,
  ) {}

  @Post()
  create(@Body() createAvanceAcademicoDto: CreateAvanceAcademicoDto) {
    return this.avanceAcademicoService.create(createAvanceAcademicoDto);
  }

  @Get()
  findAll() {
    return this.avanceAcademicoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.avanceAcademicoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAvanceAcademicoDto: UpdateAvanceAcademicoDto,
  ) {
    return this.avanceAcademicoService.update(id, updateAvanceAcademicoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.avanceAcademicoService.remove(id);
  }
}
