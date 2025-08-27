import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import type { CreateEstudianteDto } from '../estudiantes/dto/create-estudiante.dto';
import type { loginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.authService.create(createEstudianteDto);
  }

  //AL HACER LOGIN EL USUARIO VA A RECIBIR UN ACCESS TOKEN DE TIPO BEARER PARA POSTMAN
  @Public()
  @Post('login')
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  //ACA EN EL PROFILE NO HACE FALTA MANDARLE NINGUN PARAMETRO EL JWT SE VA A DECODIFICAR Y VA A OBTENER EL USUARIO DE LA BASE DE DATOS
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  userProfile(@Request() req) {
    return req.user;
  }
}
