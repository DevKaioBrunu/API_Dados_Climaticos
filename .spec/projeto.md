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

## Levantamento inicial histórico

Os itens abaixo preservam o estado do levantamento original e foram
superados pelas implementações e validações posteriores; não descrevem o
estado atual de Docker ou dos arquivos versionados.

- O `package.json` raiz aponta `start` e `dev` para `backend/src/index.js`, usa Jest e declara Jest/Supertest como dependências de desenvolvimento.
- Há testes Jest/Supertest em `backend/src/tests/`; os testes lidos simulam HTTP com mocks do Axios.
- A API tem endpoints de health, clima por cidade e cidades por UF.
- `AGENTS.md`, `docs/ia.md`, `docs/requisitos-projeto-b.md` e `.spec/` apareciam como não rastreados no estado Git inspecionado. Preserve esse estado até a equipe decidir o que integrar.
- A tarefa Docker é planejamento; nenhum artefato Docker foi criado ou validado nesta etapa.

## Atualização do frontend em 11/11/2026

A pedido de Kaio, a tarefa 007 refatorou a interface reaproveitada: busca de
UF e município, seleção em cascata com catálogo do IBGE acessado pelo
navegador, resultados formatados e JSON técnico. A implementação e as
verificações realizadas estão em [`tarefas/007-refatoracao-frontend.md`](tarefas/007-refatoracao-frontend.md).
Também foi implementada a alternância entre tema claro e escuro, com
persistência local quando disponível; a imagem do frontend em Compose foi
recriada para servir essa versão.
Em 11/11/2026 o fluxo principal foi exercitado em Chrome headless e a consulta
climática real respondeu pelo proxy. Avaliação completa de acessibilidade,
CLS e disponibilidade contínua dos provedores permanecem fora dessa evidência.

## Requisitos do curso e acompanhamento

Consulte a fonte consolidada para o checklist completo. Em resumo: Compose com um comando, SOLID, um pattern justificado, testes unitários e de integração, mínimo de cobertura declarado, CI com install/lint/test, `.env.example`, proteção de segredos, logs estruturados, uma métrica, um SLO simples, README, ADR, OpenAPI, smoke test k6 com p95 medido, `docs/desempenho.md`, `CONTRIBUTORS.md` e prompts relevantes em `docs/ia.md`.

## Fechamento local em 2026-11-12

Kaio autorizou a tarefa [008](tarefas/008-fechamento-apresentacao.md), preservando
as frentes e os contratos existentes. A [verificação final](../docs/verificacao-final.md)
registra lint, 42 testes com mocks e 89,47% de declarações; Compose com API,
frontend e Prometheus; fluxo real no Chrome; alvo `UP` e incremento coletado.
Adapter e aplicação/limites de SOLID estão em [design](../docs/design.md).
O `.env.example` foi preparado e o carregamento conferido; o histórico local
foi examinado com Gitleaks sem achados, no alcance documentado.

`CONTRIBUTORS.md` existe na raiz. O CI #5 verde foi confirmado para `d6ae88d`;
o CI das alterações locais depende de envio autorizado. SLO 95%/sete dias
está declarado, sem observação de cumprimento da janela. O p95 de 1,47 s é
a amostra de 1 VU/dez requisições registrada pela tarefa 006, não repetida
neste fechamento.

Guia de estudo, roteiro e checklist estão preparados. Revisão da dupla,
integração dos arquivos novos no GitHub, CI final, ensaio, vídeo e Moodle
permanecem pendentes; consulte a matriz de aceite da tarefa 008.

## Próximas tarefas

Seguir a tarefa 008 e o checklist de entrega para as ações humanas finais.
As especificações não autorizam automaticamente commits, pushes ou merges.
