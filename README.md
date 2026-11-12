# Projeto B — API Dados Climáticos

API REST em Node.js e Express para consultar municípios brasileiros no IBGE e
previsões climáticas na Open-Meteo.

## Desenvolvimento com IA

O fluxo de especificações, prompts, skills e registro de uso de IA está em
[`docs/guia-uso-de-ia.md`](docs/guia-uso-de-ia.md). Os usos efetivos de IA são
registrados em [`docs/ia.md`](docs/ia.md).

## Requisitos

- Node.js 22.x, versão 22.13 ou superior, para desenvolvimento e verificações (mesma linha usada no CI)
- npm 9 ou superior
- Acesso à internet para consultar o IBGE e a Open-Meteo

## Instalação

Na raiz do projeto:

```bash
npm ci
```

## Execução

### Com Docker Compose

Com Docker instalado e em execução, na raiz do projeto:

```bash
docker compose up --build
```

A interface fica disponível em `http://localhost:8080`, e a API pode ser
acessada diretamente em `http://localhost:3000`. A interface encaminha as
chamadas `/api/` para a API pelo Compose. Para encerrar, pressione `Ctrl+C`;
para remover os containers, execute `docker compose down`. Consulte
[`docs/execucao-docker.md`](docs/execucao-docker.md) para detalhes e limites
da verificação.

Na interface, escolha uma UF pela lista pesquisável e, em seguida, selecione
um município para consultar o clima. As duas listas aceitam digitação e
navegação com as setas, Enter e Escape. Editar a UF limpa o município
selecionado. Os atalhos de cidades também selecionam a UF correspondente.
O controle com sol ou lua no canto superior direito alterna entre os temas
claro e escuro. A escolha é
salva no navegador quando o armazenamento local está disponível; caso esteja
bloqueado, a escolha vale até recarregar a página.

A lista de municípios é obtida diretamente do serviço de localidades do IBGE
pelo navegador e precisa de internet. Se o carregamento falhar, use a opção
de tentar novamente. Para a consulta de municípios pela API, informe também
o limite de resultados, entre 1 e 100; esse limite não restringe a lista de
seleção de cidade.

As consultas exibem clima, municípios ou disponibilidade, com alternância
para JSON técnico. O estado `degraded` é apresentado como disponibilidade
limitada mesmo quando a resposta HTTP é 200. A rota de clima recebe somente o
nome da cidade; se a API retornar outra UF para um nome homônimo, a interface
informa a divergência, mas não consegue solicitar a UF correta à API atual.
Por padrão, as chamadas à API usam a origem da página; é possível informar
outro endereço no campo da interface. Ao abrir o HTML como arquivo local, o
endereço padrão é `http://localhost:3000`.

### Localmente com Node.js

```bash
# Produção
npm start

# Desenvolvimento, com reinício automático
npm run dev
```

O servidor fica disponível em `http://localhost:3000`.

## Lint, testes e cobertura

```bash
npm run lint
npm test
npm run test:coverage -- --runInBand
```

O lint usa ESLint 10 com regras recomendadas para o JavaScript do backend,
testes, frontend e configurações de ESLint/Jest. Os ambientes Node.js, Jest
e navegador são configurados separadamente. O comando falha em erros ou avisos.

O mínimo é **80% global de declarações (statements) da API**, aplicado pelo
Jest em `npm run test:coverage`. `npm test` executa a suíte sem coletar cobertura.
O CI usa o comando com cobertura para verificar o mínimo em cada execução.

São contabilizados os arquivos `backend/src/**/*.js`, inclusive módulos sem
teste direto. As exclusões são `backend/src/tests/**` (testes e o verificador
manual `checkRoutes.js`) e `backend/src/app.js` (arquivo vazio, sem uso atual).
Se `app.js` passar a conter implementação, sua exclusão deve ser removida.
Frontend, configurações e material de `X/` não fazem parte da cobertura da API.
Ramificações, funções e linhas são reportadas sem um mínimo separado.

O valor de 80% é uma decisão desta entrega; o curso não determina percentual.
A suíte completa medida em 10/11/2026 atingiu 90,85% de declarações. O piso
estabelece uma proteção inicial para a base reaproveitada. Relatórios locais:
`coverage/lcov-report/index.html`, `coverage/lcov.info` e
`coverage/coverage-summary.json`; esses artefatos são ignorados pelo Git.

Os testes unitários e de integração interna simulam a camada HTTP/provedores.
O Supertest usa portas TCP locais temporárias. Para verificar as rotas com
consultas reais, em uma execução separada contra a API já iniciada:

```bash
npm run check-routes
```

### Integração contínua

O workflow [CI](.github/workflows/ci.yml) usa Ubuntu e Node.js 22 e está
configurado para pushes em `main`/`DEV`, PRs destinados a essas branches
e acionamento manual. Executa, nesta ordem:

```bash
npm ci
npm run lint
npm run test:coverage -- --ci --runInBand
```

Instalação, lint e testes foram validados localmente. Kaio informou uma execução
verde do workflow CI para o commit `c97ed29` na branch `DEV`, apresentada em
captura da página [Actions](https://github.com/DevKaioBrunu/API_Dados_Climaticos/actions).
A captura identifica a execução, mas não mostra os detalhes individuais dos passos.

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

O backend está em `backend/` e a interface estática em `frontend/`.

## Serviços externos

- IBGE: municípios por nome e por estado
- Open-Meteo Geocoding: coordenadas das cidades
- Open-Meteo Forecast: previsão climática

## Observabilidade

O Compose também inicia o Prometheus para coletar o contador de requisições da
API. O painel fica em `http://localhost:9090`, acessível somente pelo próprio
computador. Logs JSON e a definição do SLO inicial estão documentados em
[`docs/observabilidade.md`](docs/observabilidade.md).
