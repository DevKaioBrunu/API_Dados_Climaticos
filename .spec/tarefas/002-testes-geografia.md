# 002 — Testes da área geográfica

**Estado:** proposta para alinhamento.  
**Responsável sugerido:** Daniel, conforme divisão funcional informada; confirmar antes de alterar a frente.  
**Requisitos relacionados:** B-TEC-04 e B-TEC-05.

## Objetivo

Avaliar e complementar testes da consulta de cidades/UF e comunicação geográfica, cobrindo comportamento e falhas relevantes sem depender dos provedores nos testes unitários.

## Inspeção inicial

Há `backend/src/tests/cidades.test.js`; os cenários lidos mockam Axios e exercitam a rota. Ainda é necessário avaliar se há teste unitário de domínio e qual teste de integração satisfaz o requisito.

## Escopo proposto

- Derivar casos dos comportamentos atuais documentados e das decisões da equipe.
- Distinguir teste de rota com HTTP mockado, teste unitário e integração real.
- Anotar lacunas como hipóteses até confirmar no código e requisitos.

## Dependências e aceite

Alinhar estratégia de teste com Kaio e definir com a tarefa transversal de cobertura/CI como será medida a cobertura. Aceite: testes relevantes com asserções, execução reproduzível e descrição honesta das dependências externas.

**Validação:** a definir no plano de implementação aprovado. Nenhum teste foi executado ou adicionado nesta etapa.
