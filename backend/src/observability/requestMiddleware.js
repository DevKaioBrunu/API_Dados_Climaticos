const { randomUUID } = require('node:crypto');
const { createLogger } = require('./logger');
const { httpRequestsTotal } = require('./metrics');

const logger = createLogger();
const ALLOWED_METHODS = new Set(['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']);
const ALLOWED_PROVIDERS = new Set([
  'IBGE',
  'OPEN_METEO',
  'OPEN_METEO_GEOCODING',
  'CPTEC',
]);

function getRouteTemplate(req) {
  const routePath = req.route?.path;
  if (typeof routePath !== 'string') {
    return 'unmatched';
  }

  return `${req.baseUrl || ''}${routePath}` || '/';
}

function getMethod(method) {
  return ALLOWED_METHODS.has(method) ? method : 'OTHER';
}

function createRequestMiddleware({
  requestLogger = logger,
  counter = httpRequestsTotal,
  idFactory = randomUUID,
} = {}) {
  return function requestObservability(req, res, next) {
    const requestId = idFactory();
    const startedAt = process.hrtime.bigint();
    res.setHeader('x-request-id', requestId);

    res.once('finish', () => {
      const route = getRouteTemplate(req);
      const method = getMethod(req.method);
      const statusClass = `${Math.floor(res.statusCode / 100)}xx`;
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;

      counter.inc({ method, route, status_class: statusClass });

      const fields = {
        event: 'http_request_completed',
        request_id: requestId,
        method,
        route,
        status_code: res.statusCode,
        duration_ms: Number(durationMs.toFixed(3)),
      };
      const observability = res.locals.observability;

      if (ALLOWED_PROVIDERS.has(observability?.provider)) {
        fields.provider = observability.provider;
      }
      if (observability?.health_status === 'degraded') {
        fields.health_status = 'degraded';
      }

      if (res.statusCode >= 500 || observability?.health_status === 'degraded') {
        requestLogger.error(fields, 'HTTP request completed');
      } else if (res.statusCode >= 400) {
        requestLogger.warn(fields, 'HTTP request completed');
      } else {
        requestLogger.info(fields, 'HTTP request completed');
      }
    });

    next();
  };
}

module.exports = { createRequestMiddleware, getRouteTemplate };
