const express = require('express');
const request = require('supertest');
const { Writable } = require('node:stream');
const { createLogger } = require('../observability/logger');
const { createRequestMiddleware } = require('../observability/requestMiddleware');
const { httpRequestsTotal, registry } = require('../observability/metrics');
const { startMetricsServer } = require('../observability/metricsServer');

describe('observabilidade HTTP', () => {
  test('emite JSON e mascara URLs, credenciais, query e corpo', async () => {
    let output = '';
    const stream = new Writable({
      write(chunk, encoding, callback) {
        output += chunk.toString();
        callback();
      },
    });
    const logger = createLogger({ stream });

    logger.info(
      {
        event: 'test_event',
        url: 'https://ibge.example/municipios?nome=Fortaleza',
        request: {
          url: '/api/v1/clima/Fortaleza?token=secret',
          headers: { authorization: 'Bearer secret', cookie: 'session=secret' },
          body: { cidade: 'Fortaleza' },
          query: { token: 'secret' },
        },
      },
      'structured log test'
    );
    await new Promise((resolve) => setImmediate(resolve));

    const record = JSON.parse(output.trim());
    expect(record).toMatchObject({
      service: 'api-dados-climaticos',
      event: 'test_event',
      msg: 'structured log test',
    });
    expect(record.url).toBe('[REDACTED]');
    expect(record.request.url).toBe('[REDACTED]');
    expect(record.request.headers.authorization).toBe('[REDACTED]');
    expect(record.request.headers.cookie).toBe('[REDACTED]');
    expect(record.request.body).toBe('[REDACTED]');
    expect(record.request.query).toBe('[REDACTED]');
    expect(output).not.toContain('Fortaleza');
    expect(output).not.toContain('secret');
    logger.flush();
  });

  test('registra template da rota, status, duração e ID sem valores da URL', async () => {
    const requestLogger = {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
    };
    const counter = { inc: jest.fn() };
    const app = express();
    app.use(
      createRequestMiddleware({
        requestLogger,
        counter,
        idFactory: () => 'request-id-test',
      })
    );
    app.get('/api/v1/clima/:nome_cidade', (req, res) => {
      res.locals.observability = { provider: 'OPEN_METEO' };
      return res.sendStatus(503);
    });

    const response = await request(app).get(
      '/api/v1/clima/Fortaleza?token=secret'
    );

    expect(response.status).toBe(503);
    expect(response.headers['x-request-id']).toBe('request-id-test');
    expect(counter.inc).toHaveBeenCalledWith({
      method: 'GET',
      route: '/api/v1/clima/:nome_cidade',
      status_class: '5xx',
    });
    expect(requestLogger.error).toHaveBeenCalledWith(
      expect.objectContaining({
        event: 'http_request_completed',
        request_id: 'request-id-test',
        method: 'GET',
        route: '/api/v1/clima/:nome_cidade',
        status_code: 503,
        duration_ms: expect.any(Number),
        provider: 'OPEN_METEO',
      }),
      'HTTP request completed'
    );
    const logged = JSON.stringify(requestLogger.error.mock.calls);
    expect(logged).not.toContain('Fortaleza');
    expect(logged).not.toContain('token=secret');
  });

  test('expõe o contador no endpoint interno e rejeita outras rotas', async () => {
    registry.resetMetrics();
    httpRequestsTotal.inc({
      method: 'GET',
      route: '/api/v1/cidades/:sigla_uf',
      status_class: '2xx',
    });
    const server = await startMetricsServer({ port: 0, host: '127.0.0.1' });
    const { port } = server.address();

    try {
      const metricsResponse = await fetch(`http://127.0.0.1:${port}/metrics`);
      const metricsBody = await metricsResponse.text();
      expect(metricsResponse.status).toBe(200);
      expect(metricsResponse.headers.get('content-type')).toContain(
        'text/plain'
      );
      expect(metricsBody).toContain('api_http_requests_total');
      expect(metricsBody).toContain('route="/api/v1/cidades/:sigla_uf"');
      expect(metricsBody).toContain('status_class="2xx"} 1');

      const notFoundResponse = await fetch(
        `http://127.0.0.1:${port}/metrics?token=secret`
      );
      expect(notFoundResponse.status).toBe(404);
    } finally {
      await new Promise((resolve, reject) => {
        server.close((error) => (error ? reject(error) : resolve()));
      });
    }
  });
});
