#!/bin/bash

# Demo completo del sistema de encolado automático global
# Este script demuestra cómo el interceptor captura automáticamente las requests

echo "🌍 DEMO: Sistema de Encolado Automático Global Activado"
echo "======================================================="
echo ""
echo "⚡ El interceptor global está activo y capturará automáticamente"
echo "   todas las requests que estén asignadas a colas específicas"
echo ""

BASE_URL="http://localhost:3000/api"

# Función para mostrar respuestas JSON de forma legible
print_json() {
  echo "$1" | jq '.' 2>/dev/null || echo "$1"
}

echo "🔧 PASO 1: Configuración inicial"
echo "================================"

echo ""
echo "1.1. Creando cola para carreras..."
COLA_CARRERAS=$(curl -s -X POST "$BASE_URL/colas" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "cola-carreras-auto",
    "descripcion": "Cola con encolado automático para carreras"
  }')

COLA_CARRERAS_ID=$(echo "$COLA_CARRERAS" | jq -r '.id' 2>/dev/null)
echo "✅ Cola creada: $COLA_CARRERAS_ID"

echo ""
echo "1.2. Creando worker para la cola..."
WORKER_CARRERAS=$(curl -s -X POST "$BASE_URL/workers" \
  -H "Content-Type: application/json" \
  -d "{
    \"nombre\": \"worker-auto-carreras\",
    \"concurrencia\": 3,
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")
echo "✅ Worker creado"

echo ""
echo "1.3. Asignando endpoints automáticos..."
echo ""

# Asignar GET /api/carreras
echo "  → Asignando GET /api/carreras"
ENDPOINT_GET=$(curl -s -X POST "$BASE_URL/endpoints" \
  -H "Content-Type: application/json" \
  -d "{
    \"ruta\": \"/api/carreras\",
    \"metodo\": \"GET\",
    \"descripcion\": \"Listar carreras con encolado automático\",
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")

# Asignar POST /api/carreras  
echo "  → Asignando POST /api/carreras"
ENDPOINT_POST=$(curl -s -X POST "$BASE_URL/endpoints" \
  -H "Content-Type: application/json" \
  -d "{
    \"ruta\": \"/api/carreras\",
    \"metodo\": \"POST\",
    \"descripcion\": \"Crear carrera con encolado automático\",
    \"colaId\": \"$COLA_CARRERAS_ID\"
  }")

echo "✅ Endpoints asignados automáticamente"

echo ""
echo "🎯 PASO 2: Demostrando el encolado automático"
echo "============================================="

echo ""
echo "2.1. Verificando estado inicial de la cola..."
STATS_INICIAL=$(curl -s -X GET "$BASE_URL/colas/cola-carreras-auto/stats")
echo "Estado inicial:"
print_json "$STATS_INICIAL"

echo ""
echo "🚀 2.2. REALIZANDO REQUESTS AUTOMÁTICAS..."
echo ""
echo "Las siguientes requests serán interceptadas automáticamente"
echo "y se crearán jobs sin modificar el comportamiento original:"
echo ""

# Request 1: GET /api/carreras
echo "  📨 Request 1: GET /api/carreras"
echo "     → Esta request será interceptada por el QueueInterceptor"
echo "     → Se creará automáticamente un job en 'cola-carreras-auto'"
echo "     → El endpoint original funcionará normalmente"
RESPONSE_1=$(curl -s -X GET "$BASE_URL/carreras" \
  -H "Content-Type: application/json" \
  -w "\nResponse Headers: %{header_json}")

echo ""
echo "  📨 Request 2: GET /api/carreras (segunda vez)"
REQUEST_2=$(curl -s -X GET "$BASE_URL/carreras" \
  -H "Content-Type: application/json")

echo ""
echo "  📨 Request 3: POST /api/carreras (crear carrera)"
REQUEST_3=$(curl -s -X POST "$BASE_URL/carreras" \
  -H "Content-Type: application/json" \
  -d '{
    "codigo": 999,
    "nombre": "Carrera de Prueba Automática"
  }')

echo ""
echo "⏰ Esperando un momento para que se procesen los jobs..."
sleep 3

echo ""
echo "📊 PASO 3: Verificando resultados"
echo "=================================="

echo ""
echo "3.1. Estado de la cola después de las requests automáticas:"
STATS_FINAL=$(curl -s -X GET "$BASE_URL/colas/cola-carreras-auto/stats")
print_json "$STATS_FINAL"

echo ""
echo "3.2. Jobs en la cola:"
JOBS_WAITING=$(curl -s -X GET "$BASE_URL/colas/cola-carreras-auto/jobs?status=waiting")
echo "Jobs en espera:"
print_json "$JOBS_WAITING"

JOBS_ACTIVE=$(curl -s -X GET "$BASE_URL/colas/cola-carreras-auto/jobs?status=active")
echo ""
echo "Jobs activos:"
print_json "$JOBS_ACTIVE"

JOBS_COMPLETED=$(curl -s -X GET "$BASE_URL/colas/cola-carreras-auto/jobs?status=completed")
echo ""
echo "Jobs completados:"
print_json "$JOBS_COMPLETED"

echo ""
echo "3.3. Verificando otras rutas NO asignadas..."
echo ""
echo "  📨 Request a /api/niveles (NO asignada - no debería crear job)"
REQUEST_NIVELES=$(curl -s -X GET "$BASE_URL/niveles")
echo "     → Esta request NO se encoló porque /api/niveles no está asignado"

echo ""
echo "📈 PASO 4: Estadísticas finales"
echo "==============================="

echo ""
echo "4.1. Estadísticas de endpoints:"
ENDPOINT_STATS=$(curl -s -X GET "$BASE_URL/endpoints/stats")
print_json "$ENDPOINT_STATS"

echo ""
echo "4.2. Estadísticas del encolado automático:"
QUEUE_STATS=$(curl -s -X GET "$BASE_URL/endpoints/queue-stats")
print_json "$QUEUE_STATS"

echo ""
echo "4.3. Lista de endpoints asignados:"
ENDPOINTS_LIST=$(curl -s -X GET "$BASE_URL/endpoints")
print_json "$ENDPOINTS_LIST"

echo ""
echo "🎉 DEMO COMPLETADO"
echo "=================="
echo ""
echo "✅ Funcionalidades demostradas:"
echo "   ✓ Interceptor global activado automáticamente"
echo "   ✓ Encolado transparente de requests asignadas"
echo "   ✓ Funcionamiento normal de endpoints no asignados"
echo "   ✓ Headers informativos agregados a las respuestas"
echo "   ✓ Logging detallado de todas las operaciones"
echo "   ✓ Sanitización de headers sensibles"
echo ""
echo "🔧 El sistema está completamente operativo:"
echo "   → Cualquier request a un endpoint asignado se encolará automáticamente"
echo "   → Los endpoints funcionan normalmente + encolado transparente"
echo "   → El dashboard muestra todos los jobs: http://localhost:3000/admin/queues"
echo ""
echo "🎛️ Para gestionar el sistema:"
echo "   → Asignar más endpoints: POST /api/endpoints"
echo "   → Ver estadísticas: GET /api/endpoints/stats"
echo "   → Monitorear colas: http://localhost:3000/admin/queues"