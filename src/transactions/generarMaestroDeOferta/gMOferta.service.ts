import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GMOfertaService {
  constructor(private prisma: PrismaService) {}

  async generarMaestroDeOferta(gestionId: number, periodoId: number) {
    return 'Hola';
  }
}
