# 004 — Lint, cobertura e CI

**Estado:** proposta transversal; responsável não confirmado.  
**Requisitos:** B-TEC-06 e B-TEC-07.

## Objetivo

Definir e implementar, após alinhamento, lint, um mínimo de cobertura justificado e uma execução CI verde que instale dependências, rode lint e testes.

## Situação observada

O `package.json` atual tem scripts `start`, `dev`, `test` e `check-routes`; não declara lint nem configuração de cobertura/CI observada nesta inspeção. Jest já está em uso. O requisito não define percentual mínimo.

## Decisões pendentes

- Responsável pela tarefa transversal.
- Ferramenta/configuração de lint e limiar de cobertura; não adicionar dependências antes de justificar finalidade e obter alinhamento.
- Escopo de arquivos, exclusões e workflow CI.

## Critérios de aceite

- Comandos documentados e reproduzíveis para lint e testes.
- Cobertura mínima explicitamente declarada e respeitada, com exclusões justificadas.
- CI executa instalação, lint e testes e possui evidência de execução verde.

**Validação:** pendente de implementação autorizada. Não foi configurado nem executado CI nesta etapa.
