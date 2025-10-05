import { Body, Controller, Post } from '@nestjs/common';
import { InscripcionService } from './inscripcion.service';
import type { CreateInscripcionDto } from './dto/create-inscripcion.dto';

@Controller('inscripcion')
export class InscripcionController {
  constructor(private readonly inscripcionService: InscripcionService) {}

  @Post()
  inscripcion(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.inscripcion(createInscripcionDto);
  }

  @Post('/async/')
  inscripcionAsync(@Body() createInscripcionDto: CreateInscripcionDto) {
    return this.inscripcionService.inscripcion(createInscripcionDto);
  }
}
