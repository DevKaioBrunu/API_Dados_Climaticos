# 003 — Testes da área climática

**Estado:** proposta para alinhamento.  
**Responsável sugerido:** Kaio, conforme divisão funcional informada; confirmar antes de alterar a frente.  
**Requisitos relacionados:** B-TEC-04 e B-TEC-05.

## Objetivo

Avaliar e complementar testes da previsão climática e inicialização/health, cobrindo sucesso, entradas e falhas conforme o comportamento acordado.

## Inspeção inicial

Há `backend/src/tests/clima.test.js` e `health.test.js`; os cenários lidos simulam respostas HTTP com mocks do Axios. Isso não comprova integração com provedores reais nem, por si só, teste unitário de domínio.

## Escopo proposto

- Confirmar contratos atuais antes de criar expectativas novas.
- Planejar testes unitários e identificar o teste de integração exigido.
- Manter hipóteses sobre edge cases separadas de defeitos confirmados.

## Dependências

Alinhar mudanças que cruzem serviços, health ou cliente HTTP com Kaio e Daniel.

**Validação:** a definir no plano aprovado. Nenhum teste foi executado ou adicionado nesta etapa.

## Checklist de aceite

- [ ] Casos de clima definidos a partir dos contratos confirmados.
- [ ] Testes unitários e de rota adicionados/ajustados com asserções relevantes.
- [ ] Teste de integração identificado e classificado; mocks e chamadas reais estão claramente distinguidos.
- [ ] Comandos de validação executados e resultados registrados.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação de Daniel | Rascunho da tarefa preparado para Kaio revisar; nenhuma implementação de teste realizada. | Inspeção de `clima.test.js` e `health.test.js`; os cenários lidos mockam Axios. Responsável e escopo final aguardam confirmação de Kaio. |
