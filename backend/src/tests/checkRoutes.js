const axios = require('axios');
const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3000';
const postmanFile = path.join(__dirname, '..', 'docs', 'postman_collection.json');
const testsFolder = path.join(__dirname);

function printResult(ok, message) {
  const icon = ok ? '✅' : '❌';
  console.log(`${icon} ${message}`);
}

async function checkEndpoint(description, url, expectedStatus, validator) {
  try {
    const response = await axios.get(url, { timeout: 5000 });
    const statusOk = response.status === expectedStatus;
    const bodyOk = validator ? validator(response.data) : true;

    if (!statusOk) {
      printResult(false, `${description}: expected status ${expectedStatus}, got ${response.status}`);
      return false;
    }
    if (!bodyOk) {
      printResult(false, `${description}: resposta JSON não segue o formato esperado`);
      return false;
    }

    printResult(true, `${description}: status ${expectedStatus} e formato válido`);
    return true;
  } catch (error) {
    const status = error.response?.status;
    if (status === expectedStatus) {
      printResult(true, `${description}: status ${expectedStatus} (resposta de erro esperada)`);
      return true;
    }

    const message = error.code === 'ECONNREFUSED'
      ? `Não foi possível conectar em ${baseUrl}. Verifique se o servidor está rodando.`
      : error.message;

    printResult(false, `${description}: falhou (${message})`);
    return false;
  }
}

async function main() {
  console.log('Iniciando verificação de rotas em http://localhost:3000');

  const results = [];

  results.push(await checkEndpoint(
    '/api/v1/health retorna 200',
    `${baseUrl}/api/v1/health`,
    200,
    (body) => body && typeof body.status === 'string' && typeof body.versao === 'string'
  ));

  results.push(await checkEndpoint(
    '/api/v1/clima/Fortaleza retorna dados climáticos',
    `${baseUrl}/api/v1/clima/Fortaleza`,
    200,
    (body) => body && body.nome === 'Fortaleza' && typeof body.estado === 'string' && body.clima && typeof body.clima.temperatura_min === 'number'
  ));

  const cidades = [
    { nome: 'São Paulo', uf: 'SP' },
    { nome: 'Rio de Janeiro', uf: 'RJ' },
    { nome: 'Brasília', uf: 'DF' },
    { nome: 'Salvador', uf: 'BA' },
    { nome: 'Belo Horizonte', uf: 'MG' },
    { nome: 'Curitiba', uf: 'PR' },
    { nome: 'Manaus', uf: 'AM' },
  ];

  for (const cidade of cidades) {
    results.push(await checkEndpoint(
      `/api/v1/clima/${cidade.nome} retorna dados válidos`,
      `${baseUrl}/api/v1/clima/${encodeURIComponent(cidade.nome)}`,
      200,
      (body) => body && body.nome === cidade.nome && body.estado === cidade.uf && body.clima && typeof body.clima.temperatura_min === 'number'
    ));
  }

  results.push(await checkEndpoint(
    '/api/v1/cidades/CE retorna lista de cidades',
    `${baseUrl}/api/v1/cidades/CE`,
    200,
    (body) => body && body.uf === 'CE' && Array.isArray(body.cidades)
  ));

  results.push(await checkEndpoint(
    'Erro 400 para /api/v1/cidades/ceara',
    `${baseUrl}/api/v1/cidades/ceara`,
    400,
    (body) => body && body.codigo === 'SIGLA_UF_INVALIDA'
  ));

  results.push(await checkEndpoint(
    'Erro 400 para /api/v1/clima/X (nome muito curto)',
    `${baseUrl}/api/v1/clima/X`,
    400,
    (body) => body && body.codigo === 'NOME_INVALIDO'
  ));

  const postmanExists = fs.existsSync(postmanFile);
  printResult(postmanExists, `Arquivo Postman em docs/postman_collection.json ${postmanExists ? 'encontrado' : 'não encontrado'}`);
  results.push(postmanExists);

  const testFiles = fs.readdirSync(testsFolder).filter((file) => file.endsWith('.test.js') || file.endsWith('.spec.js'));
  const testsOk = testFiles.length >= 2;
  printResult(testsOk, `Pasta tests possui pelo menos 2 arquivos de teste (${testFiles.length} encontrados)`);
  results.push(testsOk);

  console.log('');
  if (results.every(Boolean)) {
    console.log('✅ Todas as verificações foram concluídas com sucesso.');
    process.exit(0);
  }

  console.log('❌ Algumas verificações falharam. Corrija os problemas e execute novamente.');
  process.exit(1);
}

main();
