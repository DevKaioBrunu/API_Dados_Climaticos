const http = require('node:http');
const { registry } = require('./metrics');

const DEFAULT_METRICS_PORT = 9100;

function startMetricsServer({
  port = Number(process.env.METRICS_PORT) || DEFAULT_METRICS_PORT,
  host = process.env.METRICS_HOST || '127.0.0.1',
} = {}) {
  const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET' || req.url !== '/metrics') {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Not found\n');
      return;
    }

    try {
      const body = await registry.metrics();
      res.writeHead(200, {
        'Content-Type': registry.contentType,
        'Cache-Control': 'no-store',
      });
      res.end(body);
    } catch {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('Metrics unavailable\n');
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, host, () => resolve(server));
  });
}

module.exports = { startMetricsServer };
