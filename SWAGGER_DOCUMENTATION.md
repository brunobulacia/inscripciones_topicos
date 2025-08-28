# Documentación Swagger - Sistema de Inscripciones

## Resumen de Endpoints Documentados

Este documento resume todos los endpoints de la API del Sistema de Inscripciones Universitarias que han sido documentados con Swagger.

### URL de Documentación

```
http://localhost:3000/api/docs
```

### Controladores Documentados ✅

1. **auth** - Autenticación
   - POST `/api/auth/register` - Registrar nuevo estudiante
   - POST `/api/auth/login` - Iniciar sesión
   - GET `/api/auth/profile` - Obtener perfil del usuario autenticado

2. **carreras** - Gestión de Carreras
   - POST `/api/carreras` - Crear nueva carrera
   - GET `/api/carreras` - Obtener todas las carreras
   - GET `/api/carreras/:id` - Obtener carrera por ID
   - PATCH `/api/carreras/:id` - Actualizar carrera
   - DELETE `/api/carreras/:id` - Eliminar carrera

3. **estudiantes** - Estudiantes
   - POST `/api/estudiantes` - Crear nuevo estudiante
   - GET `/api/estudiantes` - Obtener todos los estudiantes
   - GET `/api/estudiantes/:id` - Obtener estudiante por ID
   - PATCH `/api/estudiantes/:id` - Actualizar estudiante
   - DELETE `/api/estudiantes/:id` - Eliminar estudiante

4. **docentes** - Docentes
   - POST `/api/docentes` - Crear nuevo docente
   - GET `/api/docentes` - Obtener todos los docentes
   - GET `/api/docentes/:id` - Obtener docente por ID
   - PATCH `/api/docentes/:id` - Actualizar docente
   - DELETE `/api/docentes/:id` - Eliminar docente

5. **materias** - Materias
   - POST `/api/materias` - Crear nueva materia
   - GET `/api/materias` - Obtener todas las materias
   - GET `/api/materias/:id` - Obtener materia por ID
   - PATCH `/api/materias/:id` - Actualizar materia
   - DELETE `/api/materias/:id` - Eliminar materia

6. **planes-de-estudio** - Planes de Estudio
   - POST `/api/planes-de-estudio` - Crear nuevo plan de estudio
   - GET `/api/planes-de-estudio` - Obtener todos los planes de estudio
   - GET `/api/planes-de-estudio/:id` - Obtener plan de estudio por ID
   - PATCH `/api/planes-de-estudio/:id` - Actualizar plan de estudio
   - DELETE `/api/planes-de-estudio/:id` - Eliminar plan de estudio

7. **niveles** - Niveles Académicos
   - POST `/api/niveles` - Crear nuevo nivel académico
   - GET `/api/niveles` - Obtener todos los niveles académicos
   - GET `/api/niveles/:id` - Obtener nivel académico por ID
   - PATCH `/api/niveles/:id` - Actualizar nivel académico
   - DELETE `/api/niveles/:id` - Eliminar nivel académico

8. **prerequisitos** - Prerequisites
   - POST `/api/prerequisitos` - Crear nuevo prerequisito
   - GET `/api/prerequisitos` - Obtener todos los prerequisitos
   - GET `/api/prerequisitos/:id` - Obtener prerequisito por ID
   - PATCH `/api/prerequisitos/:id` - Actualizar prerequisito
   - DELETE `/api/prerequisitos/:id` - Eliminar prerequisito

9. **grupo-materias** - Grupos de Materias
   - POST `/api/grupo-materias` - Crear nuevo grupo de materia
   - GET `/api/grupo-materias` - Obtener todos los grupos de materias
   - GET `/api/grupo-materias/:id` - Obtener grupo de materia por ID
   - PATCH `/api/grupo-materias/:id` - Actualizar grupo de materia
   - DELETE `/api/grupo-materias/:id` - Eliminar grupo de materia

10. **fichas-inscripcion** - Fichas de Inscripción
    - POST `/api/fichas-inscripcion` - Crear nueva ficha de inscripción
    - GET `/api/fichas-inscripcion` - Obtener todas las fichas de inscripción
    - GET `/api/fichas-inscripcion/:id` - Obtener ficha de inscripción por ID
    - PATCH `/api/fichas-inscripcion/:id` - Actualizar ficha de inscripción
    - DELETE `/api/fichas-inscripcion/:id` - Eliminar ficha de inscripción

11. **detalles-inscripcion** - Detalles de Inscripción
    - POST `/api/detalles-inscripcion` - Crear nuevo detalle de inscripción
    - GET `/api/detalles-inscripcion` - Obtener todos los detalles de inscripción
    - GET `/api/detalles-inscripcion/:id` - Obtener detalle de inscripción por ID
    - PATCH `/api/detalles-inscripcion/:id` - Actualizar detalle de inscripción
    - DELETE `/api/detalles-inscripcion/:id` - Eliminar detalle de inscripción

12. **modulos** - Módulos
    - POST `/api/modulos` - Crear nuevo módulo
    - GET `/api/modulos` - Obtener todos los módulos
    - GET `/api/modulos/:id` - Obtener módulo por ID
    - PATCH `/api/modulos/:id` - Actualizar módulo
    - DELETE `/api/modulos/:id` - Eliminar módulo

13. **aulas** - Aulas
    - POST `/api/aulas` - Crear nueva aula
    - GET `/api/aulas` - Obtener todas las aulas
    - GET `/api/aulas/:id` - Obtener aula por ID
    - PATCH `/api/aulas/:id` - Actualizar aula
    - DELETE `/api/aulas/:id` - Eliminar aula

14. **gestiones** - Gestiones
    - POST `/api/gestiones` - Crear nueva gestión
    - GET `/api/gestiones` - Obtener todas las gestiones
    - GET `/api/gestiones/:id` - Obtener gestión por ID
    - PATCH `/api/gestiones/:id` - Actualizar gestión
    - DELETE `/api/gestiones/:id` - Eliminar gestión

15. **periodos** - Periodos
    - POST `/api/periodos` - Crear nuevo periodo
    - GET `/api/periodos` - Obtener todos los periodos
    - GET `/api/periodos/:id` - Obtener periodo por ID
    - PATCH `/api/periodos/:id` - Actualizar periodo
    - DELETE `/api/periodos/:id` - Eliminar periodo

16. **boleta-inscripcion** - Boletas de Inscripción
    - POST `/api/boletas-inscripcion` - Crear nueva boleta de inscripción
    - GET `/api/boletas-inscripcion` - Obtener todas las boletas de inscripción
    - GET `/api/boletas-inscripcion/:id` - Obtener boleta de inscripción por ID
    - PATCH `/api/boletas-inscripcion/:id` - Actualizar boleta de inscripción
    - DELETE `/api/boletas-inscripcion/:id` - Eliminar boleta de inscripción

17. **avance-academico** - Avance Académico
    - POST `/api/avances-academicos` - Crear nuevo avance académico
    - GET `/api/avances-academicos` - Obtener todos los avances académicos
    - GET `/api/avances-academicos/:id` - Obtener avance académico por ID
    - PATCH `/api/avances-academicos/:id` - Actualizar avance académico
    - DELETE `/api/avances-academicos/:id` - Eliminar avance académico

18. **horarios** - Horarios
    - POST `/api/horarios` - Crear nuevo horario
    - GET `/api/horarios` - Obtener todos los horarios
    - GET `/api/horarios/aula-grupo/:aulaGrupoMateriaId` - Obtener horarios por aula grupo materia
    - GET `/api/horarios/:id` - Obtener horario por ID
    - PATCH `/api/horarios/:id` - Actualizar horario
    - DELETE `/api/horarios/:id` - Eliminar horario

19. **aula-grupo-materias** - Aula Grupo Materias
    - POST `/api/aula-grupo-materias` - Crear nueva relación aula-grupo-materia
    - GET `/api/aula-grupo-materias` - Obtener todas las relaciones aula-grupo-materias
    - GET `/api/aula-grupo-materias/:id` - Obtener relación aula-grupo-materia por ID
    - PATCH `/api/aula-grupo-materias/:id` - Actualizar relación aula-grupo-materia
    - DELETE `/api/aula-grupo-materias/:id` - Eliminar relación aula-grupo-materia

## Características de la Documentación

### Autenticación

- Todos los endpoints (excepto register y login) requieren autenticación Bearer Token
- Se incluye documentación sobre cómo obtener el token a través del endpoint de login

### Estructura de Respuestas

- Código 200/201: Operación exitosa
- Código 400: Datos inválidos
- Código 401: Token inválido o expirado
- Código 404: Recurso no encontrado
- Código 409: Conflicto (duplicados)

### Ejemplos de Datos

- Cada endpoint incluye ejemplos de request y response
- Esquemas detallados para todos los DTOs
- Parámetros claramente documentados

### Total de Endpoints Documentados: 95+ endpoints

Todos los controladores del sistema han sido completamente documentados con Swagger, proporcionando una interfaz interactiva para probar y entender la API.
