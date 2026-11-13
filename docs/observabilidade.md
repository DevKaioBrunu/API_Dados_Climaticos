# Observabilidade

## Logs

A API usa Pino e grava linhas JSON em `stdout`. Cada requisição concluída gera
um registro com horário ISO, nível, serviço, evento, ID de requisição, método,
template da rota, status HTTP e duração em milissegundos. Eventos de ciclo de
vida registram a inicialização da API e do servidor de métricas. O ID também é
retornado no cabeçalho `X-Request-Id` e é criado pela API; valores enviados pelo
cliente não são reutilizados como ID.

Falhas dos provedores aparecem no registro da requisição com o nome do provedor
conhecido pela rota e o status HTTP. URLs, status/códigos upstream, mensagens
brutas de erro, corpos, cabeçalhos, query strings, nomes de cidades e
coordenadas não são registrados. Rotas não reconhecidas aparecem como
`unmatched`, sem o caminho recebido. O health `degraded` é indicado no evento
estruturado com o provedor, embora a resposta HTTP continue sendo 200 conforme
o comportamento atual. A aplicação emite um único evento por requisição; os
serviços não gravam um segundo evento para a mesma falha.

O nível pode ser configurado por `LOG_LEVEL`; o padrão é `info`. Em Docker, os
logs ficam disponíveis no fluxo padrão do container da API.

## Métrica e coleta

A API expõe o contador Prometheus `api_http_requests_total`, incrementado
quando cada requisição HTTP termina. Os únicos labels são método normalizado,
template de rota e classe de status (`2xx`, `4xx`, `5xx`). Eles não incluem
valores da URL ou fornecidos por usuários. A coleta não registra a própria
requisição de scrape.

O endpoint de métricas fica em `GET /metrics` na porta `9100`, separada da API
e sem publicação de porta no Compose. No Compose, somente os serviços da rede
interna alcançam essa porta. O painel do Prometheus é publicado em
`127.0.0.1:9090`; o volume `prometheus-data` preserva os dados e a retenção é
de 15 dias.

Suba a aplicação e o coletor na raiz do repositório:

```bash
docker compose up --build
```

Abra `http://localhost:9090` e consulte `Status > Targets` para verificar se o
alvo `api` está `UP`. O contador bruto também pode ser consultado em
`http://localhost:9090/graph` usando `api_http_requests_total`. Em execução
local sem Docker, a API escuta as métricas somente em `127.0.0.1:9100`; nesse
modo não há coleta histórica automática.

## SLO de disponibilidade por requisição

Objetivo inicial escolhido para esta entrega: **pelo menos 95%** das requisições
válidas às rotas de clima e cidades devem responder com sucesso durante uma
janela móvel de **7 dias**. O indicador é:

```text
requisições 2xx / (requisições 2xx + requisições 5xx) × 100
```

Respostas `4xx` são excluídas por representarem entradas ou recursos inválidos
do cliente. `/api/v1/health` é excluído porque hoje responde `200` mesmo quando
informa `degraded`. Falhas de provedores que resultam em `503` contam como
requisições ruins. A meta de 95% é uma decisão inicial do projeto, não uma meta
definida pelo curso nem uma medição de disponibilidade real. Ela deve ser
reavaliada quando houver dados operacionais suficientes.

Consulta PromQL correspondente, inserida na interface do Prometheus:

```promql
100 *
sum(increase(api_http_requests_total{route=~"/api/v1/(clima|cidades)/.*",status_class="2xx"}[7d]))
/
sum(increase(api_http_requests_total{route=~"/api/v1/(clima|cidades)/.*",status_class=~"2xx|5xx"}[7d]))
```

Sem requisições elegíveis na janela, não há amostra para avaliar o SLO. A
implementação e os testes confirmam a instrumentação e o cálculo consultável;
eles não demonstram que a meta foi atingida ao longo de sete dias. O SLO também
não equivale a uma garantia contínua, e depende da disponibilidade dos
provedores externos usados pelo fluxo principal.

## Validação no fechamento

Em 12/11/2026, o Compose completo iniciou com Prometheus 3.13.5. O alvo
`http://api:9100/metrics` ficou `UP`, a consulta `up{job="api"}` retornou 1 e
o contador coletado avançou de 16 para 17 após uma requisição e o scrape
seguinte. Um evento JSON de requisição teve os campos documentados conferidos.
Essa observação comprova a coleta nessa execução; o cumprimento do SLO de
sete dias continua sem medição. Ambiente, comandos e limites estão em
[verificação final](verificacao-final.md).
