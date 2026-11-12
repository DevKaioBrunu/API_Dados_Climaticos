# ADR 0001: Logs estruturados e métricas Prometheus

- **Estado:** aceito
- **Data:** 2026-11-12
- **Responsável:** Daniel, com implementação assistida por OpenAI Codex
- **Referências:** tarefa [005 — Observabilidade](../../.spec/tarefas/005-observabilidade.md), [documentação de observabilidade](../observabilidade.md)

## Contexto

A API precisava produzir logs estruturados e expor uma métrica, com coleta
compatível com a execução em Docker Compose. A solução deveria evitar registrar
dados de requisição desnecessários e manter a operação proporcional ao projeto.

## Decisão

Usar Pino para emitir logs JSON em `stdout` e o cliente Prometheus para expor
`api_http_requests_total` em um servidor interno de métricas. No Compose, um
Prometheus coleta essa métrica. Os labels ficam limitados a método, template
de rota e classe de status. O projeto também adotou um SLO inicial de 95% de
respostas 2xx entre respostas 2xx e 5xx das rotas de clima e cidades, em uma
janela móvel de sete dias.

Esta decisão foi tomada para a tarefa 005 sob orientação e autorização de
Daniel. A meta do SLO é uma decisão do projeto; não é um requisito numérico do
curso nem evidência de que o objetivo foi atingido.

## Alternativas consideradas

- Registrar texto simples com `console.log` e não adicionar coleta: menor
  configuração, mas sem estrutura consistente ou consulta histórica da métrica.
- Usar Pino sem Prometheus: logs estruturados com menor operação, mas sem a
  métrica coletável exigida pelo projeto.
- Adotar Grafana e alertas: adicionaria serviços e operação que não são
  necessários para o escopo atual.

## Consequências

- Logs estruturados podem ser consultados no fluxo do container sem gravar
  URLs, nomes de cidades, coordenadas, corpos ou cabeçalhos.
- O contador pode ser coletado pelo Prometheus no Compose; a coleta em execução
  precisa ser validada no ambiente usado para a entrega.
- O SLO depende de tráfego suficiente na janela e da disponibilidade dos
  provedores externos. A configuração não prova que a meta foi atingida.
- A solução adiciona operação de Prometheus e dependências correspondentes,
  compensadas pela coleta histórica e pelo formato estruturado.
