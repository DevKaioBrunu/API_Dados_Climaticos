# 005 — Observabilidade

**Estado:** implementação e coleta em Compose validadas; alvo `api` UP e incremento observado no fechamento de 2026-11-12. Cumprimento da janela de sete dias do SLO não medido.
**Responsável:** Daniel, escolhido pela equipe para responder pelas decisões da tarefa. Codex avaliou alternativas e apresentou recomendações; Daniel orientou e autorizou a implementação.
**Requisitos:** B-OPE-03, B-OPE-04 e B-OPE-05.

## Objetivo

Planejar logs estruturados, pelo menos uma métrica e um SLO simples, escolhidos de modo compatível com a API e explicáveis pela equipe.

## Restrições

A fonte do curso não escolhe biblioteca, métrica, indicador ou meta numérica. Não copiar escolhas de exemplo como obrigações e não inventar uma meta antes de definir o indicador e a forma de medição.

## Dependências

Definir responsável e decisões com a equipe, avaliar impacto em rotas/serviços e selecionar evidência de medição.

**Validação original:** lint, suíte Jest/Supertest e exposição local passaram, com provedores simulados e sem Docker CLI naquele ambiente. **Atualização no fechamento:** Compose completo iniciado; alvo `http://api:9100/metrics` UP, `up{job="api"}=1` e contador coletado de 16 para 17. Log JSON de requisição conferido. Detalhes e limites em `docs/verificacao-final.md`; a janela do SLO não foi medida.

## Decisões implementadas

- Pino escreve logs JSON em `stdout`, com ID de requisição, método, template de rota, status e duração. Dados de URL, query, corpo, cabeçalhos, nome de cidade e coordenadas não são registrados. Falhas conhecidas de provedor são incluídas no único evento da requisição, com nome do provedor em lista permitida.
- `@prometheus-io/client` expõe `api_http_requests_total`, com labels limitadas a método normalizado, template de rota e classe de status. O endpoint fica em porta interna `9100`; no Compose essa porta não é publicada no host.
- Prometheus `3.13.5` coleta a métrica a cada 15 segundos, persiste dados em volume e publica sua interface somente em `127.0.0.1:9090`. A execução foi confirmada pela tarefa 008, após a limitação do ambiente original.
- SLO inicial recomendado por Codex e implementado sob orientação de Daniel: no mínimo 95% de respostas `2xx` sobre respostas `2xx` e `5xx` das rotas de clima e cidades, em janela móvel de 7 dias. Respostas `4xx` e health são excluídos; `503` por falha de provedor conta como falha. A meta é uma decisão do projeto, não um requisito do curso nem evidência de disponibilidade atingida.
- Justificativa e trade-offs: Pino oferece logs estruturados e redaction sem implementar serialização própria; o cliente Prometheus fornece contador e formato de exposição; o coletor no Compose permite consultar uma janela histórica. Grafana e alertas foram excluídos para manter a solução enxuta. Fontes oficiais consultadas: documentação do Pino, cliente Prometheus para Node.js e tabela de releases/LTS do Prometheus.

## Checklist de aceite

- [x] Responsável e escolhas de observabilidade alinhados: a equipe escolheu Daniel como responsável; ele avaliou e autorizou as recomendações técnicas apresentadas com assistência de IA.
- [x] Logs estruturados implementados e comportamento documentado em `docs/observabilidade.md`.
- [x] Métrica observável e método de leitura documentados; endpoint exercitado por teste e scrape em Compose confirmado na tarefa 008.
- [x] SLO declarado com indicador, janela móvel de 7 dias, meta inicial de 95% e consulta PromQL documentada. A meta não foi medida ao longo da janela.
- [x] Validações locais e Compose em execução realizados; a ausência original do Docker CLI foi superada na tarefa 008.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação de Daniel | Rascunho transversal preparado; responsável e decisões ainda não confirmados; nenhuma instrumentação realizada. | Escopo comparado com B-OPE-03/04/05; a fonte não determina biblioteca, métrica específica ou meta numérica. |
| 2026-11-12 | Daniel, com implementação assistida por OpenAI Codex | Daniel, responsável escolhido pela equipe, solicitou que Codex comparasse soluções simples e seguras e implementasse a recomendação. Daniel autorizou a implementação de Pino, contador Prometheus `api_http_requests_total`, scrape pelo Compose e SLO inicial de 95% em janela de 7 dias. Implementados logs JSON com dados minimizados, ID de requisição, servidor interno de métricas, configuração do coletor, documentação e testes; removidos logs de serviço que poderiam registrar URLs e duplicar eventos. | A primeira execução de `npm run lint` falhou por dois parâmetros `catch` não utilizados em `ibge.js` e `weather.js`; removidos, e a repetição passou. `npm run test:coverage -- --ci --runInBand`: 7 suítes/42 testes passaram, 89,47% de statements. Parser YAML local confirmou os arquivos e o alvo `api:9100`. `docker compose config --quiet` não executou: `docker` não é reconhecido. Testes mockados e endpoint local; sem chamadas reais a provedores, sem scrape em Compose ou medição de 7 dias. |
| 2026-11-12 | Kaio, com assistência de OpenAI Codex | Validação final da instrumentação de Daniel no Compose atual, sem alterações de observabilidade. | Alvo api em http://api:9100/metrics UP; up=1; soma coletada do contador de 16 para 17 após requisição e scrape. Log JSON conferido. Janela completa do SLO não observada; detalhes na tarefa 008. |
