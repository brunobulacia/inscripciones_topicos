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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar nuevo estudiante' })
  @ApiBody({
    description: 'Datos del estudiante a registrar',
    schema: {
      type: 'object',
      properties: {
        nombre: { type: 'string', example: 'Juan' },
        apellido_paterno: { type: 'string', example: 'Pérez' },
        apellido_materno: { type: 'string', example: 'García' },
        telefono: { type: 'string', example: '70123456' },
        ci: { type: 'string', example: '12345678' },
        email: { type: 'string', example: 'juan.perez@email.com' },
        matricula: { type: 'string', example: 'EST001' },
        password: { type: 'string', example: 'miPassword123' },
        ppac: { type: 'number', example: 0 },
        estaActivo: { type: 'boolean', example: true },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Estudiante registrado exitosamente',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 409, description: 'El estudiante ya existe' })
  create(@Body() createEstudianteDto: CreateEstudianteDto) {
    return this.authService.create(createEstudianteDto);
  }

  //AL HACER LOGIN EL USUARIO VA A RECIBIR UN ACCESS TOKEN DE TIPO BEARER PARA POSTMAN
  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiBody({
    description: 'Credenciales de acceso',
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'juan.perez@email.com' },
        password: { type: 'string', example: 'miPassword123' },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login exitoso',
    schema: {
      type: 'object',
      properties: {
        access_token: {
          type: 'string',
          example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        user: { type: 'object' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas' })
  login(@Body() loginDto: loginDto) {
    return this.authService.login(loginDto);
  }

  //ACA EN EL PROFILE NO HACE FALTA MANDARLE NINGUN PARAMETRO EL JWT SE VA A DECODIFICAR Y VA A OBTENER EL USUARIO DE LA BASE DE DATOS
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener perfil del usuario autenticado' })
  @ApiResponse({
    status: 200,
    description: 'Perfil del usuario',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        nombre: { type: 'string' },
        apellido_paterno: { type: 'string' },
        apellido_materno: { type: 'string' },
        email: { type: 'string' },
        matricula: { type: 'string' },
      },
    },
  })
  @ApiResponse({ status: 401, description: 'Token inválido o expirado' })
  userProfile(@Request() req) {
    return req.user;
  }
}
