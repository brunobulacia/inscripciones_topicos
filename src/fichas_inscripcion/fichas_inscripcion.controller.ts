import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FichasInscripcionService } from './fichas_inscripcion.service';
import type { CreateFichaInscripcionDto } from './dto/create-ficha_inscripcion.dto';
import type { UpdateFichaInscripcionDto } from './dto/update-ficha_inscripcion.dto';

@Controller('fichas-inscripcion')
export class FichasInscripcionController {
  constructor(
    private readonly fichaInscripcionService: FichasInscripcionService,
  ) {}

  @Post()
  create(@Body() createFichaInscripcionDto: CreateFichaInscripcionDto) {
    return this.fichaInscripcionService.create(createFichaInscripcionDto);
  }

  @Get()
  findAll() {
    return this.fichaInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fichaInscripcionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFichaInscripcionDto: UpdateFichaInscripcionDto,
  ) {
    return this.fichaInscripcionService.update(id, updateFichaInscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fichaInscripcionService.remove(id);
  }
}
