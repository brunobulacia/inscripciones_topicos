import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreatePrerequisitJobData,
  FindAllPrerequisitJobData,
  FindOnePrerequisitJobData,
  UpdatePrerequisitJobData,
  DeletePrerequisitJobData,
} from '../../types/prerequisito-job.types';

@Injectable()
export class CreatePrerequisitHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: CreatePrerequisitJobData) {
    try {
      const prerequisito = await this.prisma.prerequisito.create({
        data: {
          siglaMateria: data.siglaMateria,
          siglaPrerequisito: data.siglaPrerequisito,
        },
        include: {
          materia: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
          prerequisito: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: prerequisito,
        message: 'Prerequisito creado exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2002') {
        return {
          success: false,
          error:
            'Ya existe un prerequisito con esta combinación de materia y prerequisito',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'La materia o prerequisito especificado no existe',
          details: error.message,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class FindAllPrerequisitHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindAllPrerequisitJobData = {}) {
    try {
      const { page = 1, limit = 10 } = data;
      const prerequisitos = await this.prisma.prerequisito.findMany({
        skip: page * limit,
        take: limit,
        where: {
          esActivo: true,
        },
        include: {
          materia: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
          prerequisito: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return {
        success: true,
        data: prerequisitos,
        message: 'Prerequisitos obtenidos exitosamente',
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class FindOnePrerequisitHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: FindOnePrerequisitJobData) {
    try {
      const prerequisito = await this.prisma.prerequisito.findUnique({
        where: { id: data.id },
        include: {
          materia: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
          prerequisito: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
        },
      });

      if (!prerequisito) {
        return {
          success: false,
          error: `Prerequisito con ID ${data.id} no encontrado`,
          data: null,
        };
      }

      return {
        success: true,
        data: prerequisito,
        message: 'Prerequisito obtenido exitosamente',
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class UpdatePrerequisitHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: UpdatePrerequisitJobData) {
    try {
      const { id, ...updateData } = data;
      const prerequisito = await this.prisma.prerequisito.update({
        where: { id },
        data: updateData,
        include: {
          materia: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
          prerequisito: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: prerequisito,
        message: 'Prerequisito actualizado exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: `Prerequisito con ID ${data.id} no encontrado`,
          data: null,
        };
      }
      if (error.code === 'P2002') {
        return {
          success: false,
          error:
            'Ya existe un prerequisito con esta combinación de materia y prerequisito',
          details: error.message,
        };
      }
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'La materia o prerequisito especificado no existe',
          details: error.message,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}

@Injectable()
export class DeletePrerequisitHandler {
  constructor(private readonly prisma: PrismaService) {}

  async handle(data: DeletePrerequisitJobData) {
    try {
      const prerequisito = await this.prisma.prerequisito.update({
        where: { id: data.id },
        data: { esActivo: false },
        include: {
          materia: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
          prerequisito: {
            include: {
              nivel: true,
              planDeEstudio: {
                include: {
                  carrera: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: prerequisito,
        message: 'Prerequisito eliminado exitosamente',
      };
    } catch (error: any) {
      if (error.code === 'P2025') {
        return {
          success: false,
          error: `Prerequisito con ID ${data.id} no encontrado`,
          data: null,
        };
      }
      return {
        success: false,
        error: 'Error interno del servidor',
        details: error.message,
      };
    }
  }
}
