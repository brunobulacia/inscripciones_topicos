import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { DetallesInscripcionService } from './detalles_inscripcion.service';
import type { CreateDetalleInscripcionDto } from './dto/create-detalle_inscripcion.dto';
import type { UpdateDetalleInscripcionDto } from './dto/update-detalle_inscripcion.dto';

@Controller('detalles-inscripcion')
export class DetallesInscripcionController {
  constructor(
    private readonly detalleInscripcionService: DetallesInscripcionService,
  ) {}

  @Post()
  create(@Body() createDetalleInscripcionDto: CreateDetalleInscripcionDto) {
    return this.detalleInscripcionService.create(createDetalleInscripcionDto);
  }

  @Get()
  findAll() {
    return this.detalleInscripcionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.detalleInscripcionService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDetalleInscripcionDto: UpdateDetalleInscripcionDto,
  ) {
    return this.detalleInscripcionService.update(
      id,
      updateDetalleInscripcionDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.detalleInscripcionService.remove(id);
  }
}
