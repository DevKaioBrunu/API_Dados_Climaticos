const prometheus = require('@prometheus-io/client');

const registry = new prometheus.Registry();

const httpRequestsTotal = new prometheus.Counter({
  name: 'api_http_requests_total',
  help: 'Total de requisições HTTP concluídas pela API.',
  labelNames: ['method', 'route', 'status_class'],
  registers: [registry],
});

module.exports = { httpRequestsTotal, registry };
