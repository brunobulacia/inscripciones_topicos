import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { BoletaInscripcionService } from './boleta_inscripcion.service';
import type { CreateBoletaInscripcionDto } from './dto/create-boleta_inscripcion.dto';
import type { UpdateBoletaInscripcionDto } from './dto/update-boleta_inscripcion.dto';

@Controller('boletas-inscripcion')
export class BoletaInscripcionController {
  constructor(
    private readonly boletaInscripcionService: BoletaInscripcionService,
  ) {}

  @Post()
  create(@Body() createBoletaInscripcionDto: CreateBoletaInscripcionDto) {
    return this.boletaInscripcionService.create(createBoletaInscripcionDto);
  }

  @Get()
  findAll() {
    return this.boletaInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.boletaInscripcionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBoletaInscripcionDto: UpdateBoletaInscripcionDto,
  ) {
    return this.boletaInscripcionService.update(id, updateBoletaInscripcionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.boletaInscripcionService.remove(id);
  }
}
