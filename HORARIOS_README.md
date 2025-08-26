# Sistema de Inscripción Universitaria - Documentación

## Resumen de Cambios Implementados

### 1. Modelo Horario

Se creó un nuevo modelo `Horario` con la siguiente estructura:

- `id`: Identificador único
- `diaSemana`: Día de la semana (Lunes, Martes, etc.)
- `horaInicio`: Hora de inicio en formato HH:MM
- `horaFin`: Hora de fin en formato HH:MM
- `grupoMateriaId`: Relación con GrupoMateria
- `estaActivo`: Flag de borrado lógico
- Timestamps: `createdAt`, `updatedAt`

### 2. Relación con GrupoMateria

- **Relación 1:N**: Un GrupoMateria puede tener muchos Horarios
- **Constraint único**: grupoMateriaId + diaSemana + horaInicio (evita horarios duplicados)

### 3. Datos de Ejemplo

Se implementaron grupos de materias como ejemplo de un sistema real:

#### MAT-101 (Cálculo I) - 4 grupos:

- **SC**: Lunes, Miércoles, Viernes 08:00-10:00
- **SA**: Martes, Jueves 10:00-12:00
- **SX**: Lunes, Miércoles 14:00-16:00
- **NW**: Sábado 08:00-12:00 (Nocturno/Weekend)

#### INF119 (Estructuras Discretas) - 1 grupo:

- **SC**: Martes, Jueves 08:00-10:00

#### INF110 (Introducción a la Informática) - 1 grupo:

- **R1**: Viernes 14:00-18:00

### 4. Infraestructura Actualizada

- **Módulo 236**: Aulas del 11 al 46 (36 aulas)
- **Seeder completo**: Con 11 horarios de ejemplo
- **API REST completa**: CRUD para horarios con endpoints especializados

## Endpoints Disponibles

### Horarios

- `GET /api/horarios` - Listar todos los horarios
- `GET /api/horarios/:id` - Obtener horario específico
- `GET /api/horarios/grupo/:grupoMateriaId` - Horarios de un grupo específico
- `POST /api/horarios` - Crear nuevo horario
- `PATCH /api/horarios/:id` - Actualizar horario
- `DELETE /api/horarios/:id` - Eliminar horario (borrado lógico)

### Ejemplo de datos que retorna:

```json
{
  "id": "h1000000-1111-2222-3333-000000000001",
  "diaSemana": "Lunes",
  "horaInicio": "08:00",
  "horaFin": "10:00",
  "grupoMateria": {
    "nombre": "SC",
    "materia": {
      "nombre": "Calculo I",
      "sigla": "MAT-101"
    },
    "docente": {
      "nombre": "Juan",
      "apellido_paterno": "Pérez"
    }
  }
}
```

## Estructura del Sistema

El sistema permite que:

1. **Una materia** (ej: MAT-101) tenga **múltiples grupos** (SC, SA, SX, NW)
2. **Cada grupo** tenga **múltiples horarios** (diferentes días/horas)
3. **Cada horario** esté asignado a **un aula específica**
4. **Cada grupo** tenga **un docente asignado**

## Próximos Pasos Sugeridos

1. **Validaciones de horarios**: Evitar conflictos de aulas/docentes
2. **Endpoint de consulta avanzada**: Horarios por día, docente, aula
3. **Inscripción de estudiantes**: Conectar con el sistema de inscripciones
4. **Validación de capacidad**: Verificar límites de estudiantes por aula

## Comandos para Probar

```bash
# Obtener todos los horarios
curl -X GET http://localhost:3000/api/horarios

# Obtener horarios de un grupo específico
curl -X GET http://localhost:3000/api/horarios/grupo/g1d44444-5555-6666-7777-000000000001
```

El sistema está listo para manejar inscripciones universitarias con horarios reales y flexibles.
