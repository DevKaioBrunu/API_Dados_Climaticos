## PROJETO NIVEL B - FullCycle - Engenharia de Software - 4.0

# API Dados Climáticos

API REST em Node.js com Express para consultar dados geográficos de municípios
brasileiros e dados climáticos.

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Acesso à internet para a verificação de saúde no IBGE e para as consultas
  aos serviços externos

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Execução

Os scripts definidos no `package.json` são:

```bash
# Produção
npm start

# Desenvolvimento, com reinício automático
npm run dev
```

O servidor utiliza a porta `3000` e, quando iniciado corretamente, fica
disponível em:

```text
http://localhost:3000
```

## API

Todas as rotas são prefixadas por `/api/v1`.

### Verificação de saúde

```http
GET /api/v1/health
```

Essa rota consulta o serviço de municípios do IBGE com timeout de 3 segundos.
Ela sempre retorna HTTP 200, informando no campo `status` se a aplicação está
`healthy` ou `degraded`.

Exemplo de resposta quando o IBGE está disponível:

```json
{
  "status": "healthy",
  "versao": "1.0.0",
  "timestamp": "2026-05-05T19:36:11.491Z"
}
```

Quando o serviço externo não está disponível, a resposta inclui:

```json
{
  "status": "degraded",
  "versao": "1.0.0",
  "timestamp": "2026-05-05T19:36:11.491Z",
  "motivo": "Servico externo indisponivel"
}
```

### Clima

A aplicação registra o grupo de rotas:

```http
/api/v1/clima
```

### Cidades

A aplicação registra o grupo de rotas:

```http
/api/v1/cidades
```

Os detalhes de cada endpoint dependem dos módulos de rotas carregados por
`backend/src/index.js`.


## Estrutura atual

```text
.
├── backend/
│   └── src/
│       ├── app.js
│       └── index.js
├── package.json
└── package-lock.json
```

O ponto de entrada da aplicação é `backend/src/index.js`. O arquivo configura
Express, CORS, JSON, a porta do servidor, a rota de saúde e o tratamento de
rotas inexistentes.

## Situação atual

Os scripts `start` e `dev` do `package.json` ainda apontam para
`src/index.js`, embora o ponto de entrada esteja em `backend/src/index.js`.
Além disso, o código importa `backend/src/routes/clima.js` e
`backend/src/routes/cidades.js`, que ainda não estão presentes no repositório.
Por isso, a execução completa da API depende desses caminhos e módulos serem
ajustados ou adicionados.

## Testes

O projeto possui o script abaixo no `package.json`:

```bash
npm test
```

No estado atual do repositório, não há arquivos de teste versionados.
