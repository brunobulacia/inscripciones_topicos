import { Injectable, NotFoundException } from '@nestjs/common';
import type { CreateEstudianteDto } from '../estudiantes/dto/create-estudiante.dto';
import type { loginDto } from './dto/login.dto';
import { Estudiante } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async create(createEstudianteDto: CreateEstudianteDto): Promise<Estudiante> {
    try {
      const hashedPassword = bcrypt.hashSync(createEstudianteDto.password, 10);
      // 1. Crear el estudiante sin avanceAcademicoId
      const user = await this.prismaService.estudiante.create({
        data: { ...createEstudianteDto, password: hashedPassword },
      });

      // 2. Crear el avance academico y asociar el estudiante
      const avanceAcademico = await this.prismaService.avanceAcademico.create({
        data: {
          estudiante: {
            connect: { id: user.id },
          },
        },
      });

      // 3. Actualizar el estudiante con el avanceAcademicoId
      await this.prismaService.estudiante.update({
        where: { id: user.id },
        data: { avanceAcademicoId: avanceAcademico.id },
      });

      // 4. Crear la boleta de inscripcion con el avanceAcademicoId correcto
      await this.prismaService.boletaInscripcion.create({
        data: {
          estudianteId: user.id,
          avanceAcademicoId: avanceAcademico.id,
        },
      });

      // Crear la entrada en maestroDeOferta para el estudiante inscrito en el periodo actual
      await this.prismaService.maestroDeOferta.create({
        data: {
          estudianteId: user.id,
          periodoId: 'e98c933f-d706-4bdc-bdf8-755ea315b0eb',
        },
      });

      // 5. Retornar el estudiante actualizado
      const updatedUser = await this.prismaService.estudiante.findUnique({
        where: { id: user.id },
      });
      if (!updatedUser) {
        throw new Error('Updated user not found');
      }
      return updatedUser;
    } catch (error) {
      throw new Error('Error creating user');
    }
  }

  async login(loginDto: loginDto): Promise<{ access_token: string } | null> {
    try {
      const user = await this.prismaService.estudiante.findUnique({
        where: { email: loginDto.email },
      });
      if (user && bcrypt.compareSync(loginDto.password, user.password)) {
        const payload = { email: user.email, sub: user.id };
        const access_token = this.jwtService.sign(payload);
        return { access_token };
      }
      return null;
    } catch (error) {
      throw new NotFoundException('Error logging in');
    }
  }
}
