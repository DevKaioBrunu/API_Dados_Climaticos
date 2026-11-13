const express = require('express');
const cors = require('cors');
const axios = require('axios');
const climaRoutes = require('./routes/clima');
const cidadesRoutes = require('./routes/cidades');
const { createLogger } = require('./observability/logger');
const { createRequestMiddleware } = require('./observability/requestMiddleware');
const { startMetricsServer } = require('./observability/metricsServer');

const app = express();
const PORT = 3000;
const logger = createLogger();

app.use(createRequestMiddleware());
app.use(cors());
app.use(express.json());

// Rotas
app.get('/api/v1/health', async (req, res) => {
  try {
    await axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados/CE/municipios', {
      timeout: 3000
    });

    return res.status(200).json({
      status: 'healthy',
      versao: '1.0.0',
      timestamp: new Date().toISOString()
    });
  } catch {
    res.locals.observability = {
      provider: 'IBGE',
      health_status: 'degraded',
    };
    return res.status(200).json({
      status: 'degraded',
      versao: '1.0.0',
      timestamp: new Date().toISOString(),
      motivo: 'Servico externo indisponivel'
    });
  }
});

app.use('/api/v1/clima', climaRoutes);
app.use('/api/v1/cidades', cidadesRoutes);

app.use((req, res) => {
  return res.status(404).json({
    erro: true,
    codigo: 'ROTA_NAO_ENCONTRADA',
    mensagem: 'Rota nao encontrada',
    rota: req.originalUrl,
  });
});

if (require.main === module) {
  const apiServer = app.listen(PORT, () => {
    logger.info({ event: 'api_started', port: PORT }, 'API started');
  });

  startMetricsServer()
    .then(() => {
      logger.info(
        { event: 'metrics_started', port: Number(process.env.METRICS_PORT) || 9100 },
        'Metrics server started'
      );
    })
    .catch((error) => {
      logger.fatal(
        { event: 'metrics_start_failed', error_type: error?.name || 'Error' },
        'Metrics server failed to start'
      );
      apiServer.close(() => process.exit(1));
      setTimeout(() => process.exit(1), 1000).unref();
    });
}

module.exports = app;
