const pino = require('pino');

const REDACT_PATHS = [
  'authorization',
  'cookie',
  'url',
  'request.url',
  'request.headers.authorization',
  'request.headers.cookie',
  'request.body',
  'request.query',
];

function createLogger({ level = process.env.LOG_LEVEL || 'info', stream } = {}) {
  return pino(
    {
      level,
      base: { service: 'api-dados-climaticos' },
      timestamp: pino.stdTimeFunctions.isoTime,
      redact: { paths: REDACT_PATHS, censor: '[REDACTED]' },
    },
    stream
  );
}

module.exports = { createLogger };
