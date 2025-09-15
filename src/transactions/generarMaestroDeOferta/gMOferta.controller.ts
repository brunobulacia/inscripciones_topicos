import { Controller, Get } from '@nestjs/common';
import { GMOfertaService } from './gMOferta.service';

@Controller('generar-maestro-de-oferta')
export class GMOfertaController {
  constructor(private readonly gMOfertaService: GMOfertaService) {}

  @Get()
  generarMaestroDeOferta() {
    return this.gMOfertaService.generarMaestroDeOferta(1, 1);
  }
}
