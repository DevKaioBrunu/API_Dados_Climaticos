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

### Configuração de ambiente

Os valores públicos estão em [`.env.example`](.env.example). Para carregá-los
explicitamente no Node.js suportado, após instalar as dependências:

```bash
cp .env.example .env
node --env-file=.env backend/src/index.js
```

`npm start` e `npm run dev` usam defaults e variáveis exportadas pelo ambiente;
não carregam `.env` automaticamente. Não é necessário dotenv. Use um modo de
execução por vez para evitar disputa pela porta fixa 3000.

| Variável | Default no Node local | Efeito |
|---|---|---|
| `LOG_LEVEL` | `info` | Nível dos logs Pino |
| `HTTP_TIMEOUT_MS` | `5000` | Timeout por tentativa do cliente HTTP compartilhado |
| `HTTP_RETRIES` | `2` | Retentativas do cliente compartilhado |
| `HTTP_RETRY_DELAY_MS` | `300` | Base da espera crescente entre tentativas |
| `METRICS_HOST` | `127.0.0.1` | Interface do servidor de métricas |
| `METRICS_PORT` | `9100` | Porta do servidor de métricas |

Use inteiros positivos nas opções HTTP: no código atual, zero resulta no
default. A API não lê `PORT`. O health usa timeout próprio de 3000 ms e não
passa pelo cliente de retentativas; o navegador tem timeout próprio de 15 s.
As integrações atuais são públicas e não exigem chaves de API.

No Compose, o YAML fixa `METRICS_HOST=0.0.0.0` e `METRICS_PORT=9100` na rede
interna, sem publicar a porta no host. As outras variáveis do exemplo não
são repassadas automaticamente ao container. Um `.env` do Compose serve à
interpolação de valores referenciados no YAML; não é carregamento automático
de todas as variáveis na aplicação. A subida padrão dispensa arquivo `.env`.

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
A suíte de 10/11/2026 atingiu 90,85% de declarações; a validação de fechamento
em 12/11/2026 passou com 7 suítes/42 testes e 89,47%, incluindo observabilidade.
São medições de versões/escopos diferentes. O piso
estabelece uma proteção inicial para a base reaproveitada. Relatórios locais:
`coverage/lcov-report/index.html`, `coverage/lcov.info` e
`coverage/coverage-summary.json`; esses artefatos são ignorados pelo Git.

Os testes unitários e de integração interna simulam a camada HTTP/provedores.
O Supertest usa portas TCP locais temporárias. Para verificar as rotas com
consultas reais, em uma execução separada contra a API já iniciada:

```bash
npm run check-routes
```

### Smoke test de desempenho

Com a API acessível em `http://localhost:3000` e o k6 instalado, execute:

```bash
k6 run scripts/k6-smoke.js
```

O script envia dez requisições sequenciais para `GET /api/v1/clima/Fortaleza`,
com uma única VU e uma pausa de um segundo entre as requisições. Ele verifica
resposta HTTP 200 e os campos básicos do contrato. O resumo do k6 apresenta o
p95 de `http_req_duration`; essa medição inclui a latência dos provedores
externos usados pela rota. O script não define um limite de aprovação.
Configure outra origem com `BASE_URL`, se necessário.

### Integração contínua

O workflow [CI](.github/workflows/ci.yml) usa Ubuntu e Node.js 22 e está
configurado para pushes em `main`/`DEV`, PRs destinados a essas branches
e acionamento manual. Executa, nesta ordem:

```bash
npm ci
npm run lint
npm run test:coverage -- --ci --runInBand
```

O [CI #5](https://github.com/DevKaioBrunu/API_Dados_Climaticos/actions/runs/43300946340)
foi confirmado pela API pública do GitHub em 12/11/2026: branch `DEV`, commit
`d6ae88d`, conclusão `success`. As alterações locais deste fechamento precisam
ser enviadas com autorização e ter seu próprio CI conferido. A execução
anterior não comprova mudanças ainda não enviadas.

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

## Design, validação e apresentação

- [SOLID e Adapter no código](docs/design.md): evidências, justificativa e limites.
- [Verificação final](docs/verificacao-final.md): comandos, cobertura, fluxo real,
  scrape Prometheus, varredura de segredos e pendências externas.
- [ADR](docs/adr/0001-decisao.md), [OpenAPI](docs/openapi.yaml) e
  [desempenho medido](docs/desempenho.md).
- [Guia de estudo da dupla](docs/guia-estudo-apresentacao.md) e
  [roteiro do vídeo de dez minutos](docs/roteiro-apresentacao.md).
- [Checklist de entrega](docs/checklist-entrega.md) e
  [autoria e contribuições](CONTRIBUTORS.md).

O SLO de 95%/sete dias é uma meta declarada; a coleta foi confirmada no
fechamento, sem comprovação de cumprimento da janela. O p95 de 1,47 s pertence
ao smoke test registrado de dez requisições, não a uma garantia contínua.
