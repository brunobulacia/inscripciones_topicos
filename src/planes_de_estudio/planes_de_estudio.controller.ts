import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PlanesDeEstudioService } from './planes_de_estudio.service';
import type { CreatePlanDeEstudioDto } from './dto/create-planes_de_estudio.dto';
import type { UpdatePlanDeEstudioDto } from './dto/update-planes_de_estudio.dto';

@Controller('planes-de-estudio')
export class PlanesDeEstudioController {
  constructor(
    private readonly planesDeEstudioService: PlanesDeEstudioService,
  ) {}

  @Post()
  create(@Body() createPlanDeEstudioDto: CreatePlanDeEstudioDto) {
    return this.planesDeEstudioService.create(createPlanDeEstudioDto);
  }

  @Get()
  findAll() {
    return this.planesDeEstudioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planesDeEstudioService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePlanDeEstudioDto: UpdatePlanDeEstudioDto,
  ) {
    return this.planesDeEstudioService.update(id, updatePlanDeEstudioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.planesDeEstudioService.remove(id);
  }
}
