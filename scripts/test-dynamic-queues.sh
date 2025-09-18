#!/bin/bash

# Script de prueba para el sistema de colas dinámicas
# Este script demuestra cómo usar las nuevas APIs

echo "🚀 Iniciando pruebas del sistema de colas dinámicas"
echo "=================================================="

BASE_URL="http://localhost:3000/api"

# Función para mostrar respuestas JSON de forma legible
print_json() {
  echo "$1" | jq '.' 2>/dev/null || echo "$1"
}

echo ""
echo "1. Creando una nueva cola..."
echo "----------------------------"
COLA_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/colas" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "procesamiento-datos",
    "descripcion": "Cola para procesamiento de datos en lote"
  }')

echo "Respuesta:"
print_json "$COLA_RESPONSE"

# Extraer ID de la cola
COLA_ID=$(echo "$COLA_RESPONSE" | jq -r '.id' 2>/dev/null)

echo ""
echo "2. Creando un worker para la cola..."
echo "-----------------------------------"
WORKER_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/workers" \
  -H "Content-Type: application/json" \
  -d "{
    \"nombre\": \"worker-procesamiento-1\",
    \"concurrencia\": 3,
    \"colaId\": \"$COLA_ID\"
  }")

echo "Respuesta:"
print_json "$WORKER_RESPONSE"

echo ""
echo "3. Listando todas las colas..."
echo "-----------------------------"
COLAS_LIST=$(curl -s -X GET "$BASE_URL/colas")
echo "Respuesta:"
print_json "$COLAS_LIST"

echo ""
echo "4. Listando todos los workers..."
echo "-------------------------------"
WORKERS_LIST=$(curl -s -X GET "$BASE_URL/workers")
echo "Respuesta:"
print_json "$WORKERS_LIST"

echo ""
echo "5. Agregando un job a la cola 'procesamiento-datos'..."
echo "----------------------------------------------------"
JOB_RESPONSE=$(curl -s -X POST \
  "$BASE_URL/colas/procesamiento-datos/jobs" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "procesar-archivo",
    "data": {
      "archivo": "datos.csv",
      "tipo": "batch",
      "prioridad": "alta"
    },
    "opts": {
      "delay": 0,
      "attempts": 3
    }
  }')

echo "Respuesta:"
print_json "$JOB_RESPONSE"

echo ""
echo "6. Obteniendo estadísticas de la cola..."
echo "---------------------------------------"
STATS_RESPONSE=$(curl -s -X GET "$BASE_URL/colas/procesamiento-datos/stats")
echo "Respuesta:"
print_json "$STATS_RESPONSE"

echo ""
echo "7. Obteniendo jobs en espera..."
echo "-----------------------------"
JOBS_RESPONSE=$(curl -s -X GET "$BASE_URL/colas/procesamiento-datos/jobs?status=waiting")
echo "Respuesta:"
print_json "$JOBS_RESPONSE"

echo ""
echo "8. Obteniendo estadísticas de workers..."
echo "--------------------------------------"
WORKER_STATS=$(curl -s -X GET "$BASE_URL/workers/stats")
echo "Respuesta:"
print_json "$WORKER_STATS"

echo ""
echo "✅ Pruebas completadas!"
echo "======================="
echo ""
echo "💡 Endpoints disponibles:"
echo "   - API Documentation: http://localhost:3000/api/docs"
echo "   - BullMQ Dashboard: http://localhost:3000/admin/queues"
echo "   - Colas API: http://localhost:3000/api/colas"
echo "   - Workers API: http://localhost:3000/api/workers"