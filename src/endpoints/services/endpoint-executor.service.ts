import { Injectable, Logger } from '@nestjs/common';
import { CarrerasService } from '../../carreras/carreras.service';
import { PrerequisitosService } from '../../prerequisitos/prerequisitos.service';
import { PlanesDeEstudioService } from 'src/planes_de_estudio/planes_de_estudio.service';
import { NivelesService } from '../../niveles/niveles.service';
import { PeriodosService } from '../../periodos/periodos.service';
import { OfertaGrupoMateriasService } from '../../oferta_grupo_materias/oferta_grupo_materias.service';
import { MateriasService } from '../../materias/materias.service';
import { MaestroDeOfertasService } from '../../maestro_de_ofertas/maestro_de_ofertas.service';
import { HorariosService } from '../../horarios/horarios.service';
import { GrupoMateriasService } from '../../grupo_materias/grupo_materias.service';
import { GestionesService } from '../../gestiones/gestiones.service';
import { FichasInscripcionService } from '../../fichas_inscripcion/fichas_inscripcion.service';
import { DocentesService } from '../../docentes/docentes.service';
import { DetallesInscripcionService } from '../../detalles_inscripcion/detalles_inscripcion.service';
import { DetalleInsOfertasService } from '../../detalle_ins_ofertas/detalle_ins_ofertas.service';
import { BoletaInscripcionService } from '../../boleta_inscripcion/boleta_inscripcion.service';
import { BoletaGrupoMateriasService } from '../../boleta_grupo_materias/boleta_grupo_materias.service';
import { AvanceAcademicoService } from '../../avance_academico/avance_academico.service';
import { EstudiantesService } from '../../estudiantes/estudiantes.service';
import { ModulosService } from '../../modulos/modulos.service';
import { AulasService } from '../../aulas/aulas.service';
import { AulaGrupoMateriasService } from '../../aula_grupo_materias/aula_grupo_materias.service';
import { InscripcionService } from 'src/transactions/inscripcion/inscripcion.service';
@Injectable()
export class EndpointExecutorService {
  private readonly logger = new Logger(EndpointExecutorService.name);

  constructor(
    private readonly carrerasService: CarrerasService,
    private readonly prerequisitosService: PrerequisitosService,
    private readonly planesDeEstudioService: PlanesDeEstudioService,
    private readonly nivelesService: NivelesService,
    private readonly periodosService: PeriodosService,
    private readonly ofertaGrupoMateriasService: OfertaGrupoMateriasService,
    private readonly materiasService: MateriasService,
    private readonly maestroDeOfertasService: MaestroDeOfertasService,
    private readonly horariosService: HorariosService,
    private readonly grupoMateriasService: GrupoMateriasService,
    private readonly gestionesService: GestionesService,
    private readonly fichasInscripcionService: FichasInscripcionService,
    private readonly estudiantesService: EstudiantesService,
    private readonly docentesService: DocentesService,
    private readonly detallesInscripcionService: DetallesInscripcionService,
    private readonly detalleInsOfertasService: DetalleInsOfertasService,
    private readonly boletaInscripcionService: BoletaInscripcionService,
    private readonly boletaGrupoMateriasService: BoletaGrupoMateriasService,
    private readonly avanceAcademicoService: AvanceAcademicoService,
    private readonly modulosService: ModulosService,
    private readonly aulasService: AulasService,
    private readonly aulaGrupoMateriasService: AulaGrupoMateriasService,
    private readonly inscripcionService: InscripcionService,
  ) {}

  async executeEndpoint(method: string, path: string, data: any): Promise<any> {
    try {
      this.logger.log(`🚀 Ejecutando endpoint: ${method} ${path}`);

      // Mapear rutas a servicios y métodos
      const routeMap = this.getRouteMap();
      const routeKey = `${method.toUpperCase()} ${path}`;

      if (routeMap.has(routeKey)) {
        const { service, methodName, params } = routeMap.get(routeKey);

        // Extraer parámetros de la URL si los hay
        const extractedParams = this.extractParams(path, data.params);

        // Ejecutar el método del servicio
        const result = await this.executeServiceMethod(
          service,
          methodName,
          extractedParams,
          data.body,
          data.query,
        );

        this.logger.log(
          `✅ Endpoint ejecutado exitosamente: ${method} ${path}`,
        );
        return result;
      } else {
        this.logger.warn(`⚠️ No se encontró handler para: ${routeKey}`);
        return {
          error: `No handler found for ${routeKey}`,
          availableRoutes: Array.from(routeMap.keys()),
        };
      }
    } catch (error) {
      this.logger.error(
        `❌ Error ejecutando endpoint ${method} ${path}:`,
        error.message,
      );
      throw error;
    }
  }

  private getRouteMap(): Map<string, any> {
    const routeMap = new Map();

    // Mapear rutas de carreras
    routeMap.set('GET /api/carreras/async/', {
      service: this.carrerasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/carreras/async/:id', {
      service: this.carrerasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/carreras/async/', {
      service: this.carrerasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/carreras/async/:id', {
      service: this.carrerasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/carreras/async/:id', {
      service: this.carrerasService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/prerequisitos/async/', {
      service: this.prerequisitosService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/prerequisitos/async/:id', {
      service: this.prerequisitosService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/prerequisitos/async/', {
      service: this.prerequisitosService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/prerequisitos/async/:id', {
      service: this.prerequisitosService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/prerequisitos/async/:id', {
      service: this.prerequisitosService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/planes-de-estudio/async/', {
      service: this.planesDeEstudioService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/planes-de-estudio/async/:id', {
      service: this.planesDeEstudioService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/planes-de-estudio/async/', {
      service: this.planesDeEstudioService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/planes-de-estudio/async/:id', {
      service: this.planesDeEstudioService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/planes-de-estudio/async/:id', {
      service: this.planesDeEstudioService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/niveles/async/', {
      service: this.nivelesService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/niveles/async/:id', {
      service: this.nivelesService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/niveles/async/', {
      service: this.nivelesService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/niveles/async/:id', {
      service: this.nivelesService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/niveles/async/:id', {
      service: this.nivelesService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/periodos/async/', {
      service: this.periodosService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/periodos/async/:id', {
      service: this.periodosService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/periodos/async/', {
      service: this.periodosService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/periodos/async/:id', {
      service: this.periodosService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/periodos/async/:id', {
      service: this.periodosService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/oferta-grupo-materias/async/', {
      service: this.ofertaGrupoMateriasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/oferta-grupo-materias/async/:id', {
      service: this.ofertaGrupoMateriasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/oferta-grupo-materias/async/', {
      service: this.ofertaGrupoMateriasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/oferta-grupo-materias/async/:id', {
      service: this.ofertaGrupoMateriasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/oferta-grupo-materias/async/:id', {
      service: this.ofertaGrupoMateriasService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('GET /api/modulos/async/', {
      service: this.modulosService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/modulos/async/:id', {
      service: this.modulosService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/modulos/async/', {
      service: this.modulosService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/modulos/async/:id', {
      service: this.modulosService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/modulos/async/:id', {
      service: this.modulosService,
      methodName: 'remove',
      params: ['id'],
    });

    // Mapear rutas de materias
    routeMap.set('GET /api/materias/async/', {
      service: this.materiasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/materias/async/:id', {
      service: this.materiasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/materias/async/', {
      service: this.materiasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/materias/async/:id', {
      service: this.materiasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/materias/async/:id', {
      service: this.materiasService,
      methodName: 'remove',
      params: ['id'],
    });

    // Mapear rutas de maestro_de_ofertas
    routeMap.set('GET /api/maestro-de-ofertas/async/', {
      service: this.maestroDeOfertasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/maestro-de-ofertas/async/:id', {
      service: this.maestroDeOfertasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/maestro-de-ofertas/async/', {
      service: this.maestroDeOfertasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/maestro-de-ofertas/async/:id', {
      service: this.maestroDeOfertasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/maestro-de-ofertas/async/:id', {
      service: this.maestroDeOfertasService,
      methodName: 'remove',
      params: ['id'],
    });

    // Mapear rutas de horarios
    routeMap.set('GET /api/horarios/async/', {
      service: this.horariosService,
      methodName: 'findAll',
      params: [],
    });
    // Permitir también la ruta sin barra final
    routeMap.set('GET /api/horarios/async', {
      service: this.horariosService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/horarios/async/aula-grupo/:aulaGrupoMateriaId', {
      service: this.horariosService,
      methodName: 'findByAulaGrupoMateria',
      params: ['aulaGrupoMateriaId'],
    });

    routeMap.set('GET /api/horarios/async/:id', {
      service: this.horariosService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/horarios/async/', {
      service: this.horariosService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/horarios/async/:id', {
      service: this.horariosService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/horarios/async/:id', {
      service: this.horariosService,
      methodName: 'remove',
      params: ['id'],
    });

    // GRUPO MATERIAS
    routeMap.set('GET /api/grupo-materias/async/', {
      service: this.grupoMateriasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/grupo-materias/async/:id', {
      service: this.grupoMateriasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/grupo-materias/async/', {
      service: this.grupoMateriasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/grupo-materias/async/:id', {
      service: this.grupoMateriasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/grupo-materias/async/:id', {
      service: this.grupoMateriasService,
      methodName: 'remove',
      params: ['id'],
    });

    // GESTIONES
    routeMap.set('GET /api/gestiones/async/', {
      service: this.gestionesService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/gestiones/async/:id', {
      service: this.gestionesService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/gestiones/async/', {
      service: this.gestionesService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/gestiones/async/:id', {
      service: this.gestionesService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/gestiones/async/:id', {
      service: this.gestionesService,
      methodName: 'remove',
      params: ['id'],
    });

    // FICHAS INSCRIPCION
    routeMap.set('GET /api/fichas-inscripcion/async/', {
      service: this.fichasInscripcionService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/fichas-inscripcion/async/:id', {
      service: this.fichasInscripcionService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/fichas-inscripcion/async/', {
      service: this.fichasInscripcionService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/fichas-inscripcion/async/:id', {
      service: this.fichasInscripcionService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/fichas-inscripcion/async/:id', {
      service: this.fichasInscripcionService,
      methodName: 'remove',
      params: ['id'],
    });

    // ESTUDIANTES
    routeMap.set('GET /api/estudiantes/async/', {
      service: this.estudiantesService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/estudiantes/async/:id', {
      service: this.estudiantesService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/estudiantes/async/', {
      service: this.estudiantesService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/estudiantes/async/:id', {
      service: this.estudiantesService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/estudiantes/async/:id', {
      service: this.estudiantesService,
      methodName: 'remove',
      params: ['id'],
    });

    // DOCENTES
    routeMap.set('GET /api/docentes/async/', {
      service: this.docentesService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/docentes/async/:id', {
      service: this.docentesService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/docentes/async/', {
      service: this.docentesService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/docentes/async/:id', {
      service: this.docentesService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/docentes/async/:id', {
      service: this.docentesService,
      methodName: 'remove',
      params: ['id'],
    });

    // DETALLES INSCRIPCION
    routeMap.set('GET /api/detalles-inscripcion/async/', {
      service: this.detallesInscripcionService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/detalles-inscripcion/async/:id', {
      service: this.detallesInscripcionService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/detalles-inscripcion/async/', {
      service: this.detallesInscripcionService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/detalles-inscripcion/async/:id', {
      service: this.detallesInscripcionService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/detalles-inscripcion/async/:id', {
      service: this.detallesInscripcionService,
      methodName: 'remove',
      params: ['id'],
    });

    // DETALLE INS OFERTAS
    routeMap.set('GET /api/detalle-ins-ofertas/async/', {
      service: this.detalleInsOfertasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/detalle-ins-ofertas/async/:id', {
      service: this.detalleInsOfertasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/detalle-ins-ofertas/async/', {
      service: this.detalleInsOfertasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/detalle-ins-ofertas/async/:id', {
      service: this.detalleInsOfertasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/detalle-ins-ofertas/async/:id', {
      service: this.detalleInsOfertasService,
      methodName: 'remove',
      params: ['id'],
    });

    // BOLETAS INSCRIPCION
    routeMap.set('GET /api/boletas-inscripcion/async/', {
      service: this.boletaInscripcionService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/boletas-inscripcion/async/:id', {
      service: this.boletaInscripcionService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/boletas-inscripcion/async/', {
      service: this.boletaInscripcionService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/boletas-inscripcion/async/:id', {
      service: this.boletaInscripcionService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/boletas-inscripcion/async/:id', {
      service: this.boletaInscripcionService,
      methodName: 'remove',
      params: ['id'],
    });

    // BOLETAS GRUPO MATERIAS
    routeMap.set('GET /api/boleta-grupo-materias/async/', {
      service: this.boletaGrupoMateriasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/boleta-grupo-materias/async/:id', {
      service: this.boletaGrupoMateriasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/boleta-grupo-materias/async/', {
      service: this.boletaGrupoMateriasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/boleta-grupo-materias/async/:id', {
      service: this.boletaGrupoMateriasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/boleta-grupo-materias/async/:id', {
      service: this.boletaGrupoMateriasService,
      methodName: 'remove',
      params: ['id'],
    });

    // AVANCES ACADEMICOS
    routeMap.set('GET /api/avances-academicos/async/', {
      service: this.avanceAcademicoService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/avances-academicos/async/:id', {
      service: this.avanceAcademicoService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/avances-academicos/async/', {
      service: this.avanceAcademicoService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/avances-academicos/async/:id', {
      service: this.avanceAcademicoService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/avances-academicos/async/:id', {
      service: this.avanceAcademicoService,
      methodName: 'remove',
      params: ['id'],
    });

    // AULAS
    routeMap.set('GET /api/aulas/async/', {
      service: this.aulasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/aulas/async/:id', {
      service: this.aulasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/aulas/async/', {
      service: this.aulasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/aulas/async/:id', {
      service: this.aulasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/aulas/async/:id', {
      service: this.aulasService,
      methodName: 'remove',
      params: ['id'],
    });

    // AULA GRUPO MATERIAS
    routeMap.set('GET /api/aula-grupo-materias/async/', {
      service: this.aulaGrupoMateriasService,
      methodName: 'findAll',
      params: [],
    });

    routeMap.set('GET /api/aula-grupo-materias/async/:id', {
      service: this.aulaGrupoMateriasService,
      methodName: 'findOne',
      params: ['id'],
    });

    routeMap.set('POST /api/aula-grupo-materias/async/', {
      service: this.aulaGrupoMateriasService,
      methodName: 'create',
      params: [],
    });

    routeMap.set('PATCH /api/aula-grupo-materias/async/:id', {
      service: this.aulaGrupoMateriasService,
      methodName: 'update',
      params: ['id'],
    });

    routeMap.set('DELETE /api/aula-grupo-materias/async/:id', {
      service: this.aulaGrupoMateriasService,
      methodName: 'remove',
      params: ['id'],
    });

    routeMap.set('POST /api/inscripcion/async/', {
      service: this.inscripcionService,
      methodName: 'inscripcion',
      params: [],
    });

    return routeMap;
  }

  private extractParams(path: string, params: any): any[] {
    // Si hay parámetros en la URL (como /api/carreras/:id)
    if (params && Object.keys(params).length > 0) {
      return Object.values(params);
    }
    return [];
  }

  private async executeServiceMethod(
    service: any,
    methodName: string,
    params: any[],
    body?: any,
    query?: any,
  ): Promise<any> {
    try {
      // Construir argumentos para el método
      const args = [...params];

      // Para métodos que requieren body (POST, PATCH)
      if (
        body &&
        (methodName === 'create' ||
          methodName === 'update' ||
          methodName === 'inscripcion')
      ) {
        if (methodName === 'update') {
          args.push(body);
        } else {
          args.unshift(body);
        }
      }

      if (query && Object.keys(query).length > 0) {
        args.push(query);
      }

      this.logger.debug(
        `Ejecutando ${service.constructor.name}.${methodName} con args:`,
        args,
      );

      const result = await service[methodName](...args);

      return result;
    } catch (error) {
      this.logger.error(
        `Error ejecutando ${service.constructor.name}.${methodName}:`,
        error.message,
      );
      throw error;
    }
  }
}
