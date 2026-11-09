# Projeto B — API Dados Climáticos

## Objetivo

Consolidar a API de domínio único baseada em trabalho acadêmico anterior e demonstrar um fluxo principal real de ponta a ponta, mantendo o escopo simples. A aplicação atual consulta municípios no IBGE, geocodifica com Open-Meteo e consulta previsão na Open-Meteo.

## Referência e limites

- Requisitos: [`../docs/requisitos-projeto-b.md`](../docs/requisitos-projeto-b.md), consolidação local da fonte do curso.
- Código ativo observado: `backend/src/`; testes em `backend/src/tests/`; interface em `frontend/`.
- `x/` contém material de referência e registros locais; não é fonte da implementação ativa.
- Não presumir que o código reaproveitado foi escrito exclusivamente pela equipe atual.
- Não ampliar para requisitos de outros níveis. A fonte não fixa percentual de cobertura, meta numérica de SLO ou limite de p95.
- A existência de rotas e testes não comprova funcionamento de ponta a ponta nem consultas reais aos provedores.

## Responsabilidades informadas pela equipe

- Daniel: área geográfica, integração com provedores e preparação da execução Docker.
- Kaio: área climática e inicialização da API.
- Tarefas transversais: responsável deve ser alinhado; rascunhos não autorizam alterações na frente de outra pessoa.

## Estado inicial confirmado nesta etapa

- O `package.json` raiz aponta `start` e `dev` para `backend/src/index.js`, usa Jest e declara Jest/Supertest como dependências de desenvolvimento.
- Há testes Jest/Supertest em `backend/src/tests/`; os testes lidos simulam HTTP com mocks do Axios.
- A API tem endpoints de health, clima por cidade e cidades por UF.
- `AGENTS.md`, `docs/ia.md`, `docs/requisitos-projeto-b.md` e `.spec/` apareciam como não rastreados no estado Git inspecionado. Preserve esse estado até a equipe decidir o que integrar.
- A tarefa Docker é planejamento; nenhum artefato Docker foi criado ou validado nesta etapa.

## Requisitos do curso e acompanhamento

Consulte a fonte consolidada para o checklist completo. Em resumo: Compose com um comando, SOLID, um pattern justificado, testes unitários e de integração, mínimo de cobertura declarado, CI com install/lint/test, `.env.example`, proteção de segredos, logs estruturados, uma métrica, um SLO simples, README, ADR, OpenAPI, smoke test k6 com p95 medido, `docs/desempenho.md`, `CONTRIBUTORS.md` e prompts relevantes em `docs/ia.md`.

Estado nesta especificação: levantamento documental iniciado. A implementação e a validação dos requisitos ainda precisam ser avaliadas individualmente. `x/CONTRIBUTORS.md` é um registro de trabalho local solicitado por Daniel e não satisfaz, enquanto permanecer em `x/`, a exigência de entrega de `CONTRIBUTORS.md` na raiz.

## Próximas tarefas

Ver `tarefas/`. A ordem e os responsáveis transversais precisam de alinhamento; não interpretar esta lista como autorização automática para alterar código.
