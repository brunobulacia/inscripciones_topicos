import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

// Template para añadir a todos los controladores restantes
const swaggerTemplate = `
@ApiTags('tag-name')
@ApiBearerAuth()
// Agregar antes de @Controller

// Para POST endpoints:
@ApiOperation({ summary: 'Crear nuevo {entity}' })
@ApiBody({
  description: 'Datos del {entity} a crear',
  schema: {
    type: 'object',
    properties: {
      // Schema properties
    }
  }
})
@ApiResponse({ status: 201, description: '{Entity} creado exitosamente' })
@ApiResponse({ status: 400, description: 'Datos inválidos' })

// Para GET endpoints:
@ApiOperation({ summary: 'Obtener todos los {entities}' })
@ApiResponse({ 
  status: 200, 
  description: 'Lista de {entities}',
  schema: {
    type: 'array',
    items: {
      type: 'object',
      properties: {
        id: { type: 'string' },
        // Other properties
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' }
      }
    }
  }
})

// Para GET by ID endpoints:
@ApiOperation({ summary: 'Obtener {entity} por ID' })
@ApiParam({ name: 'id', description: 'ID del {entity}', example: 'uuid-example' })
@ApiResponse({ 
  status: 200, 
  description: '{Entity} encontrado'
})
@ApiResponse({ status: 404, description: '{Entity} no encontrado' })

// Para PATCH endpoints:
@ApiOperation({ summary: 'Actualizar {entity}' })
@ApiParam({ name: 'id', description: 'ID del {entity}', example: 'uuid-example' })
@ApiBody({
  description: 'Datos a actualizar del {entity}',
  schema: {
    type: 'object',
    properties: {
      // Schema properties
    }
  }
})
@ApiResponse({ status: 200, description: '{Entity} actualizado exitosamente' })
@ApiResponse({ status: 404, description: '{Entity} no encontrado' })
@ApiResponse({ status: 400, description: 'Datos inválidos' })

// Para DELETE endpoints:
@ApiOperation({ summary: 'Eliminar {entity}' })
@ApiParam({ name: 'id', description: 'ID del {entity}', example: 'uuid-example' })
@ApiResponse({ status: 200, description: '{Entity} eliminado exitosamente' })
@ApiResponse({ status: 404, description: '{Entity} no encontrado' })
`;

console.log('Template de documentación Swagger:', swaggerTemplate);
