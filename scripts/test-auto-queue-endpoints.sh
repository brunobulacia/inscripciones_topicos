#!/bin/bash

# Script de prueba para el sistema de endpoints y encolado automático
# Este script demuestra cómo asignar endpoints a colas y el encolado automático

echo "🚀 Iniciando pruebas del sistema de endpoints automáticos"
echo "========================================================="

BASE_URL="http://localhost:3000/api"

# Función para mostrar respuestas JSON de forma legible
print_json() {
  echo "$1" | jq '.' 2>/dev/null || echo "$1"
}

echo ""
echo "1. Creando una cola para procesamiento de carreras..."
echo "---------------------------------------------------"
COLA_CARRERAS_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/colas" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "cola-carreras",
    "descripcion": "Cola para procesar endpoints de carreras"
  }')

echo "Respuesta:"
print_json "$COLA_CARRERAS_RESPONSE"

# Extraer ID de la cola
COLA_CARRERAS_ID=$(echo "$COLA_CARRERAS_RESPONSE" | jq -r '.id' 2>/dev/null)

echo ""
echo "2. Creando un worker para la cola de carreras..."
echo "-----------------------------------------------"
WORKER_CARRERAS_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/workers" \
  -H "Content-Type: application/json" \
  -d "{
    \"nombre\": \"worker-carreras-1\",
    \"concurrencia\": 2,
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")

echo "Respuesta:"
print_json "$WORKER_CARRERAS_RESPONSE"

echo ""
echo "3. Asignando endpoint GET /api/carreras a la cola..."
echo "--------------------------------------------------"
ENDPOINT_GET_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/endpoints" \
  -H "Content-Type: application/json" \
  -d "{
    \"ruta\": \"/api/carreras\",
    \"metodo\": \"GET\",
    \"descripcion\": \"Listar todas las carreras\",
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")

echo "Respuesta:"
print_json "$ENDPOINT_GET_RESPONSE"

echo ""
echo "4. Asignando endpoint POST /api/carreras a la cola..."
echo "---------------------------------------------------"
ENDPOINT_POST_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/endpoints" \
  -H "Content-Type: application/json" \
  -d "{
    \"ruta\": \"/api/carreras\",
    \"metodo\": \"POST\",
    \"descripcion\": \"Crear nueva carrera\",
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")

echo "Respuesta:"
print_json "$ENDPOINT_POST_RESPONSE"

echo ""
echo "5. Creando una segunda cola para niveles..."
echo "------------------------------------------"
COLA_NIVELES_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/colas" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "cola-niveles",
    "descripcion": "Cola para procesar endpoints de niveles"
  }')

echo "Respuesta:"
print_json "$COLA_NIVELES_RESPONSE"

COLA_NIVELES_ID=$(echo "$COLA_NIVELES_RESPONSE" | jq -r '.id' 2>/dev/null)

echo ""
echo "6. Asignando endpoint GET /api/niveles a la segunda cola..."
echo "---------------------------------------------------------"
ENDPOINT_NIVELES_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/endpoints" \
  -H "Content-Type: application/json" \
  -d "{
    \"ruta\": \"/api/niveles\",
    \"metodo\": \"GET\",
    \"descripcion\": \"Listar todos los niveles\",
    \"colaId\": \"$COLA_NIVELES_ID\"
  }")

echo "Respuesta:"
print_json "$ENDPOINT_NIVELES_RESPONSE"

echo ""
echo "7. Listando todos los endpoints asignados..."
echo "-------------------------------------------"
ENDPOINTS_LIST=$(curl -s -X GET "$BASE_URL/endpoints")
echo "Respuesta:"
print_json "$ENDPOINTS_LIST"

echo ""
echo "8. Verificando endpoints asignados a cola-carreras..."
echo "----------------------------------------------------"
ENDPOINTS_CARRERAS=$(curl -s -X GET "$BASE_URL/endpoints/by-cola-name/cola-carreras")
echo "Respuesta:"
print_json "$ENDPOINTS_CARRERAS"

echo ""
echo "9. Verificando si /api/carreras está asignado..."
echo "-----------------------------------------------"
CHECK_ROUTE_RESPONSE=$(curl -s -X GET "$BASE_URL/endpoints/check-route?path=/api/carreras&method=GET")
echo "Respuesta:"
print_json "$CHECK_ROUTE_RESPONSE"

echo ""
echo "10. Obteniendo estadísticas de endpoints..."
echo "------------------------------------------"
ENDPOINT_STATS=$(curl -s -X GET "$BASE_URL/endpoints/stats")
echo "Respuesta:"
print_json "$ENDPOINT_STATS"

echo ""
echo "11. Simulando una request a /api/carreras (esto debería crear un job automáticamente)..."
echo "--------------------------------------------------------------------------------------"
echo "⚠️  NOTA: Para que esto funcione, el interceptor debe estar activo en la aplicación"
echo "    Cuando hagas una request real a GET /api/carreras, se creará automáticamente un job"

echo ""
echo "12. Verificando estadísticas de la cola-carreras..."
echo "--------------------------------------------------"
COLA_STATS=$(curl -s -X GET "$BASE_URL/colas/cola-carreras/stats")
echo "Respuesta:"
print_json "$COLA_STATS"

echo ""
echo "13. Desasignando un endpoint de la cola..."
echo "----------------------------------------"
UNASSIGN_RESPONSE=$(curl -s -X DELETE \
  "$BASE_URL/endpoints/colas/$COLA_CARRERAS_ID/unassign" \
  -H "Content-Type: application/json" \
  -d '{
    "ruta": "/api/carreras",
    "metodo": "POST"
  }')

echo "Respuesta: $UNASSIGN_RESPONSE"

echo ""
echo "14. Verificando endpoints restantes en cola-carreras..."
echo "------------------------------------------------------"
ENDPOINTS_REMAINING=$(curl -s -X GET "$BASE_URL/endpoints/by-cola-name/cola-carreras")
echo "Respuesta:"
print_json "$ENDPOINTS_REMAINING"

echo ""
echo "✅ Pruebas completadas!"
echo "======================="
echo ""
echo "💡 Funcionalidades implementadas:"
echo "   ✓ Gestión completa de endpoints"
echo "   ✓ Asignación de endpoints a colas específicas"
echo "   ✓ Verificación de rutas asignadas"
echo "   ✓ Estadísticas detalladas"
echo "   ✓ Encolado automático (requiere interceptor activo)"
echo ""
echo "🎛️ Endpoints disponibles:"
echo "   - API Documentation: http://localhost:3000/api/docs"
echo "   - BullMQ Dashboard: http://localhost:3000/admin/queues"
echo "   - Endpoints API: http://localhost:3000/api/endpoints"
echo ""
echo "🔄 Flujo de encolado automático:"
echo "   Request → Interceptor → Verificar asignación → Crear job → Encolar → Procesar"