import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Métricas personalizadas
export const errorRate = new Rate('errors');
export const carrerasCreadas = new Rate('carreras_creadas_exitosamente');
export const carrerasCreadas_counter = new Counter('total_carreras_creadas');

// Configuración del test
export const options = {
  scenarios: {
    constant_load: {
      executor: 'constant-vus',
      vus: 10, // 1 usuario concurrente
      duration: '5s', // Test de 5 segundos
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'], // Más tiempo para operaciones async
    http_req_failed: ['rate<0.15'], // Permitir 15% de fallos por códigos duplicados
    errors: ['rate<0.15'], // 15% máximo de errores
    carreras_creadas_exitosamente: ['rate>0.7'], // 70% éxito mínimo
  },
  // Configuración para better connection handling
  batch: 1, // Procesar requests de a una
  batchPerHost: 1, // Una por host
};

// URL base del API
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const API_BASE = `${BASE_URL}/api`;

// Generadores de datos aleatorios
const prefijos = ['Ingeniería', 'Licenciatura', 'Técnico', 'Maestría', 'Doctorado'];
const areas = ['Sistemas', 'Industrial', 'Civil', 'Química', 'Mecánica', 'Eléctrica', 'Comercial', 'Social', 'Biomédica', 'Ambiental'];
const sufijos = ['Aplicada', 'Avanzada', 'Moderna', 'Digital', 'Sostenible', 'Integral', 'Especializada', 'Internacional'];

// Función para generar nombres aleatorios ÚNICOS
function generarNombreAleatorio() {
  const prefijo = prefijos[Math.floor(Math.random() * prefijos.length)];
  const area = areas[Math.floor(Math.random() * areas.length)];
  const sufijo = Math.random() > 0.5 ? ` ${sufijos[Math.floor(Math.random() * sufijos.length)]}` : '';
  
  // Agregar timestamp y VU para garantizar unicidad
  const timestamp = Date.now() % 100000; // Últimos 5 dígitos del timestamp
  const vu = __VU || 1;
  const random = Math.floor(Math.random() * 1000);
  const uniqueId = `${timestamp}${vu}${random}`;
  
  return `${prefijo} en ${area}${sufijo} #${uniqueId}`;
}

// Función para generar código aleatorio ÚNICO pero dentro del rango INT4
function generarCodigoAleatorio() {
  // Usar timestamp reducido + VU + número aleatorio
  const timestamp = Date.now() % 1000000; // Últimos 6 dígitos del timestamp
  const vu = __VU || 1;
  const random = Math.floor(Math.random() * 1000);
  
  // Combinar para crear código único pero < 2.1 billones
  const codigo = parseInt(`${timestamp}${vu}${random}`);
  
  // Asegurar que esté dentro del rango INT4 (máximo 2,147,483,647)
  return codigo % 2000000000; // Límite seguro
}

// Headers comunes
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};

export default function () {
  const userId = __VU; // ID del usuario virtual (1-5)
  
  // Test 2: POST /api/carreras/async - Crear nueva carrera
  const carreraData = {
    nombre: generarNombreAleatorio(),
    codigo: generarCodigoAleatorio() // Asegurar unicidad
  };
  
  console.log(`[Usuario ${userId}] Creando carrera:`, carreraData.nombre);
  
  let response = http.post(
    `${API_BASE}/carreras/sync`,
    JSON.stringify(carreraData),
    { headers }
  );
  
  const postSuccess = check(response, {
    'POST carrera: status 201 or 200': (r) => r.status === 201 || r.status === 200,
    'POST carrera: response time < 5000ms': (r) => r.timings.duration < 5000, // Más tiempo para async
    'POST carrera: has response body': (r) => r.body && r.body.length > 0,
    'POST carrera: no server error': (r) => r.status < 500, // Verificar que no sea error de servidor
  });
  
  if (!postSuccess) {
    errorRate.add(1);
    console.error(`[Usuario ${userId}] Error en POST carrera:`, response.status, response.body);
  } else {
    console.log(`[Usuario ${userId}] POST carrera exitoso - Status: ${response.status}`);
    // Registrar carrera creada exitosamente
    carrerasCreadas.add(1);
    carrerasCreadas_counter.add(1);
  }
  
  sleep(1);
  
  // Test 3: Verificar que la carrera fue creada (GET nuevamente)
  console.log(`[Usuario ${userId}] Verificando carrera creada...`);
  
  response = http.get(`${API_BASE}/carreras/sync`, { headers });
  
  const verifySuccess = check(response, {
    'Verify carreras: status 200': (r) => r.status === 200,
    'Verify carreras: response time < 1000ms': (r) => r.timings.duration < 1000,
  });
  
  if (!verifySuccess) {
    errorRate.add(1);
    console.error(`[Usuario ${userId}] Error en verificación:`, response.status);
  } else {
    console.log(`[Usuario ${userId}] Verificación exitosa`);
  }
  
  // Pausa aleatoria entre 1-3 segundos para simular comportamiento real
  sleep(Math.random() * 2 + 1);
}

// Función que se ejecuta al inicio del test
export function setup() {
  console.log('🚀 Iniciando test de carga con K6');
  console.log(`📊 Configuración: 5 usuarios concurrentes`);
  console.log(`🎯 URL base: ${BASE_URL}`);
  console.log('⏱️  Duración: 10s constant load');
  
  // Verificar que el servidor esté disponible
  const response = http.get(`${BASE_URL}/api/carreras/sync`);
  if (response.status !== 200) {
    console.error('❌ El servidor no está disponible. Verifica que esté ejecutándose.');
    throw new Error('Servidor no disponible');
  }
  
  console.log('✅ Servidor disponible, iniciando test...');
}

// Función que se ejecuta al final del test
export function teardown(data) {
  console.log('🏁 Test completado');
  console.log('📈 Revisa las métricas para ver los resultados');
  console.log('📊 Para ver el total de carreras creadas, revisa la métrica: total_carreras_creadas');
}

// Función para manejar errores HTTP y generar reporte detallado
export function handleSummary(data) {
  const totalCarrerasCreadas = data.metrics.total_carreras_creadas ? data.metrics.total_carreras_creadas.values.count : 0;
  const tasaExito = data.metrics.carreras_creadas_exitosamente ? data.metrics.carreras_creadas_exitosamente.values.rate : 0;
  
  console.log(`\n📊 RESUMEN DE MÉTRICAS:`);
  console.log(`✅ Total de carreras creadas exitosamente: ${totalCarrerasCreadas}`);
  console.log(`📈 Tasa de éxito en creación: ${(tasaExito * 100).toFixed(2)}%`);
  console.log(`⏱️  Tiempo promedio de respuesta: ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`);
  
  const detailedReport = {
    summary: {
      total_carreras_creadas: totalCarrerasCreadas,
      tasa_exito_creacion: `${(tasaExito * 100).toFixed(2)}%`,
      tiempo_promedio_respuesta: `${data.metrics.http_req_duration.values.avg.toFixed(2)}ms`,
      requests_totales: data.metrics.http_reqs.values.count,
      requests_fallidas: data.metrics.http_req_failed.values.rate,
      fecha_test: new Date().toISOString(),
    },
    metricas_completas: data
  };
  
  return {
    'summary.json': JSON.stringify(detailedReport, null, 2),
    'stdout': `
╔════════════════════════════════════════════════════════╗
║                  REPORTE DE TESTING K6                 ║
╠════════════════════════════════════════════════════════╣
║ 📊 Carreras creadas exitosamente: ${totalCarrerasCreadas.toString().padStart(17)} ║
║ 📈 Tasa de éxito:                ${(tasaExito * 100).toFixed(2)}%           ║
║ ⏱️  Tiempo promedio:              ${data.metrics.http_req_duration.values.avg.toFixed(2)}ms         ║
║ 🔄 Total requests:               ${data.metrics.http_reqs.values.count.toString().padStart(18)} ║
╚════════════════════════════════════════════════════════╝

💡 Para comparar con tu base de datos:
   - Consulta tu DB y cuenta las carreras creadas después del test
   - Debería coincidir con: ${totalCarrerasCreadas} registros
   - Archivo detallado guardado en: summary.json
    `
  };
}