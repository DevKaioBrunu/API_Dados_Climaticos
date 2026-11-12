# 005 — Observabilidade

**Estado:** implementação local realizada; validação de Compose/Prometheus em execução pendente.
**Responsável:** Daniel, escolhido pela equipe para responder pelas decisões da tarefa. Codex avaliou alternativas e apresentou recomendações; Daniel orientou e autorizou a implementação.
**Requisitos:** B-OPE-03, B-OPE-04 e B-OPE-05.

## Objetivo

Planejar logs estruturados, pelo menos uma métrica e um SLO simples, escolhidos de modo compatível com a API e explicáveis pela equipe.

## Restrições

A fonte do curso não escolhe biblioteca, métrica, indicador ou meta numérica. Não copiar escolhas de exemplo como obrigações e não inventar uma meta antes de definir o indicador e a forma de medição.

## Dependências

Definir responsável e decisões com a equipe, avaliar impacto em rotas/serviços e selecionar evidência de medição.

**Validação:** lint, suíte Jest/Supertest e exposição local da métrica passaram. Os testes usam serviços externos simulados. Os arquivos YAML foram analisados localmente; o comando `docker compose config --quiet` não pôde ser executado porque o Docker CLI não está disponível neste ambiente. Não houve scrape Prometheus em Compose nem medição real ao longo da janela do SLO.

## Decisões implementadas

- Pino escreve logs JSON em `stdout`, com ID de requisição, método, template de rota, status e duração. Dados de URL, query, corpo, cabeçalhos, nome de cidade e coordenadas não são registrados. Falhas conhecidas de provedor são incluídas no único evento da requisição, com nome do provedor em lista permitida.
- `@prometheus-io/client` expõe `api_http_requests_total`, com labels limitadas a método normalizado, template de rota e classe de status. O endpoint fica em porta interna `9100`; no Compose essa porta não é publicada no host.
- Prometheus `3.13.5` está configurado para raspar a métrica a cada 15 segundos, persistir dados em volume e publicar sua interface somente em `127.0.0.1:9090`. A execução não foi validada neste ambiente.
- SLO inicial recomendado por Codex e implementado sob orientação de Daniel: no mínimo 95% de respostas `2xx` sobre respostas `2xx` e `5xx` das rotas de clima e cidades, em janela móvel de 7 dias. Respostas `4xx` e health são excluídos; `503` por falha de provedor conta como falha. A meta é uma decisão do projeto, não um requisito do curso nem evidência de disponibilidade atingida.
- Justificativa e trade-offs: Pino oferece logs estruturados e redaction sem implementar serialização própria; o cliente Prometheus fornece contador e formato de exposição; o coletor no Compose permite consultar uma janela histórica. Grafana e alertas foram excluídos para manter a solução enxuta. Fontes oficiais consultadas: documentação do Pino, cliente Prometheus para Node.js e tabela de releases/LTS do Prometheus.

## Checklist de aceite

- [x] Responsável e escolhas de observabilidade alinhados: a equipe escolheu Daniel como responsável; ele avaliou e autorizou as recomendações técnicas apresentadas com assistência de IA.
- [x] Logs estruturados implementados e comportamento documentado em `docs/observabilidade.md`.
- [x] Métrica observável e método de leitura documentados; endpoint exercitado por teste. O scrape do Prometheus no Compose aguarda validação com Docker disponível.
- [x] SLO declarado com indicador, janela móvel de 7 dias, meta inicial de 95% e consulta PromQL documentada. A meta não foi medida ao longo da janela.
- [x] Validações locais realizadas e evidências registradas abaixo; validação de Compose em execução limitada pela ausência do Docker CLI.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação de Daniel | Rascunho transversal preparado; responsável e decisões ainda não confirmados; nenhuma instrumentação realizada. | Escopo comparado com B-OPE-03/04/05; a fonte não determina biblioteca, métrica específica ou meta numérica. |
| 2026-11-12 | Daniel, com implementação assistida por OpenAI Codex | Daniel, responsável escolhido pela equipe, solicitou que Codex comparasse soluções simples e seguras e implementasse a recomendação. Daniel autorizou a implementação de Pino, contador Prometheus `api_http_requests_total`, scrape pelo Compose e SLO inicial de 95% em janela de 7 dias. Implementados logs JSON com dados minimizados, ID de requisição, servidor interno de métricas, configuração do coletor, documentação e testes; removidos logs de serviço que poderiam registrar URLs e duplicar eventos. | A primeira execução de `npm run lint` falhou por dois parâmetros `catch` não utilizados em `ibge.js` e `weather.js`; removidos, e a repetição passou. `npm run test:coverage -- --ci --runInBand`: 7 suítes/42 testes passaram, 89,47% de statements. Parser YAML local confirmou os arquivos e o alvo `api:9100`. `docker compose config --quiet` não executou: `docker` não é reconhecido. Testes mockados e endpoint local; sem chamadas reais a provedores, sem scrape em Compose ou medição de 7 dias. |
