# 006 — Documentação e desempenho

**Estado:** proposta para alinhamento; responsável transversal não confirmado.  
**Requisitos:** B-DOC-01 a B-DOC-05, B-DES-01 e B-DES-02, B-AUT-04, B-IA-02.

## Objetivo

Manter README utilizável e preparar ADR, OpenAPI do endpoint principal, smoke test k6 com p95 medido, `docs/desempenho.md`, evidências de contribuições e registro de IA.

## Situação observada

Há README na raiz, coleção Postman e um arquivo local `docs/requisitos-projeto-b.md`. A fonte consolidada menciona ambiguidade sobre README em `docs/`; não assumir que dois READMEs são exigidos. Os artefatos de ADR, OpenAPI e desempenho ainda precisam ser inspecionados/produzidos sem conteúdo fictício. O `CONTRIBUTORS.md` está em `x/` por decisão de Daniel e, enquanto local, não atende ao artefato de entrega exigido na raiz.

## Dependências e aceite

Escolher o endpoint principal e decisões técnicas com a equipe; só reportar p95 após executar o smoke test e registrar ambiente/carga. ADR deve refletir decisão tomada; OpenAPI deve corresponder à API observada; CONTRIBUTORS deve atribuir contribuições com evidências disponíveis; `docs/ia.md` deve separar usos reais de planejamento.

**Validação:** revisão documental e execução de k6 planejadas para etapa própria. Nenhuma medição de desempenho foi feita nesta etapa.
