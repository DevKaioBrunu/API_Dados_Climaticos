# API Dados Climáticos

API REST em Node.js e Express para consultar municípios brasileiros no IBGE e
previsões climáticas na Open-Meteo.

## Requisitos

- Node.js 18 ou superior
- npm 9 ou superior
- Acesso à internet para consultar o IBGE e a Open-Meteo

## Instalação

Na raiz do projeto:

```bash
npm install
```

## Execução

### Com Docker Compose

Com Docker instalado e em execução, na raiz do projeto:

```bash
docker compose up --build
```

A API fica disponível em `http://localhost:3000`. Para encerrar, pressione
`Ctrl+C`; para remover o container, execute `docker compose down`. Consulte
[`docs/execucao-docker.md`](docs/execucao-docker.md) para detalhes e limites
da verificação.

### Localmente com Node.js

```bash
# Produção
npm start

# Desenvolvimento, com reinício automático
npm run dev
```

O servidor fica disponível em `http://localhost:3000`.

## Testes

```bash
npm test
```

Para verificar as rotas contra um servidor em execução:

```bash
npm run check-routes
```

## API

Todas as rotas usam o prefixo `/api/v1`.

### Health

```http
GET /api/v1/health
```

Consulta o serviço de municípios do IBGE. A rota sempre responde `200` e
informa `healthy` quando o serviço está disponível ou `degraded` quando está
indisponível.

### Clima por cidade

```http
GET /api/v1/clima/:nome_cidade
```

Exemplo:

```http
GET /api/v1/clima/Fortaleza
```

O nome é validado no IBGE, as coordenadas são obtidas pela geocodificação da
Open-Meteo e a previsão de um dia é consultada na Open-Meteo.

Respostas de erro:

- `400 NOME_INVALIDO`
- `404 CIDADE_NAO_ENCONTRADA`
- `503 SERVICO_EXTERNO_INDISPONIVEL`

### Cidades por UF

```http
GET /api/v1/cidades/:sigla_uf?limite=10
```

Exemplo:

```http
GET /api/v1/cidades/CE?limite=5
```

`sigla_uf` deve conter duas letras. O parâmetro `limite` é opcional e aceita
valores inteiros de `1` a `100`, com padrão `10`.

Respostas de erro:

- `400 SIGLA_UF_INVALIDA`
- `400 LIMITE_INVALIDO`
- `404 UF_NAO_ENCONTRADA`
- `503 SERVICO_EXTERNO_INDISPONIVEL`

### Rota inexistente

Rotas não encontradas retornam `404` em JSON com o código
`ROTA_NAO_ENCONTRADA`.

## Estrutura

```text
.
├── backend/
│   └── src/
│       ├── index.js
│       ├── routes/
│       │   ├── cidades.js
│       │   └── clima.js
│       ├── services/
│       │   ├── httpClient.js
│       │   ├── ibge.js
│       │   └── weather.js
│       └── tests/
│           ├── checkRoutes.js
│           ├── cidades.test.js
│           ├── clima.test.js
│           └── health.test.js
├── docs/
│   └── postman_collection.json
├── frontend/
└── package.json
```

O código executado e testado está em `backend/`. A pasta `X/` contém material
antigo e não é utilizada pela aplicação atual.

## Serviços externos

- IBGE: municípios por nome e por estado
- Open-Meteo Geocoding: coordenadas das cidades
- Open-Meteo Forecast: previsão climática
