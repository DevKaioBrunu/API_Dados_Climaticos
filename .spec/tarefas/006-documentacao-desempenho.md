# 006 — Documentação e desempenho

**Estado:** proposta para alinhamento; responsável transversal não confirmado.  
**Requisitos:** B-DOC-01 a B-DOC-05, B-DES-01 e B-DES-02, B-AUT-04, B-IA-02.

## Objetivo

Manter README utilizável e preparar ADR, OpenAPI do endpoint principal, smoke test k6 com p95 medido, `docs/desempenho.md`, evidências de contribuições e registro de IA.

## Situação observada

Há README na raiz, coleção Postman e um arquivo local `docs/requisitos-projeto-b.md`. A fonte consolidada menciona ambiguidade sobre README em `docs/`; não assumir que dois READMEs são exigidos. Os artefatos de ADR, OpenAPI e desempenho ainda precisam ser inspecionados/produzidos sem conteúdo fictício. O `CONTRIBUTORS.md` está em `x/` por decisão de Daniel e, enquanto local, não atende ao artefato de entrega exigido na raiz.

## Dependências

Escolher o endpoint principal e decisões técnicas com a equipe; só reportar p95 após executar o smoke test e registrar ambiente/carga.

**Validação:** revisão documental e execução de k6 planejadas para etapa própria. Nenhuma medição de desempenho foi feita nesta etapa.

## Checklist de aceite

- [ ] README explica nível, execução e testes conforme a fonte do curso.
- [ ] ADR registra uma decisão que a equipe realmente tomou.
- [ ] OpenAPI descreve o endpoint principal observado.
- [ ] Smoke test k6 executado e p95 medido com ambiente/carga descritos.
- [ ] `docs/desempenho.md` registra medições reais e limitações.
- [ ] Contribuições têm evidências de autoria; item de entrega `CONTRIBUTORS.md` está disponível na raiz.
- [ ] Contribuições individuais são demonstráveis por commits e PRs identificados.
- [ ] Prompts e usos materiais de IA estão registrados em `docs/ia.md`.
- [ ] Validação documental e de desempenho executada e registrada.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação de Daniel | Rascunho transversal preparado; responsável não confirmado e artefatos de ADR/OpenAPI/desempenho ainda não implementados. | Inspeção do README e dos requisitos; nenhuma medição de p95 foi feita. `x/CONTRIBUTORS.md` permanece local e não satisfaz a entrega na raiz. |
