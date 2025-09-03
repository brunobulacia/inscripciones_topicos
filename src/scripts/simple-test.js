import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5s', target: 10 },   
    { duration: '10s', target: 30 },  
    { duration: '20s', target: 50 },  
    { duration: '10s', target: 20 },  
    { duration: '5s', target: 0 },    
  ],
};

export default function () {
  // Crear multiples tipos de jobs
  const jobTypes = [
    () => createCarrera(),
    () => getAllCarreras(),
    () => createCarrera(), 
    () => createCarrera(),
  ];

  const randomJob = jobTypes[Math.floor(Math.random() * jobTypes.length)];
  randomJob();


  sleep(Math.random() * 0.3); 
}

function createCarrera() {
  const carreraData = {
    codigo: Math.floor(Math.random() * 10000) + 4000,
    nombre: `Heavy Load ${Math.random().toString(36).substr(2, 6)}`,
  };

  const response = http.post(
    'http://localhost:3000/api/carreras',
    JSON.stringify(carreraData),
    { headers: { 'Content-Type': 'application/json' } }
  );

  check(response, {
    'create status is 200': (r) => r.status === 200,
  });

  logStats();
}

function getAllCarreras() {
  const response = http.get('http://localhost:3000/api/carreras');
  
  check(response, {
    'findAll status is 200': (r) => r.status === 200,
  });
}

function logStats() {

  if (Math.random() < 0.1) {
    const statsResponse = http.get('http://localhost:3000/api/carreras/queue/stats');
    
    if (statsResponse.status === 200) {
      const stats = JSON.parse(statsResponse.body);
      console.log(`🔥 waiting=${stats.stats.waiting}, active=${stats.stats.active}, completed=${stats.stats.completed}, failed=${stats.stats.failed}`);
    }
  }
}