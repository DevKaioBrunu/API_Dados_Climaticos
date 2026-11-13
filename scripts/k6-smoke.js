import http from 'k6/http';
import { check, sleep } from 'k6';

const baseUrl = (__ENV.BASE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const options = {
  vus: 1,
  iterations: 10,
};

export default function () {
  const response = http.get(`${baseUrl}/api/v1/clima/Fortaleza`, {
    tags: { name: 'GET /api/v1/clima/{nome_cidade}' },
  });

  let body;
  try {
    body = response.json();
  } catch {
    body = null;
  }

  check(response, {
    'status HTTP 200': (res) => res.status === 200,
    'contrato básico de clima presente': () =>
      body !== null &&
      body.nome === 'Fortaleza' &&
      typeof body.estado === 'string' &&
      typeof body.clima?.temperatura_min === 'number' &&
      typeof body.clima?.temperatura_max === 'number',
  });

  sleep(1);
}
