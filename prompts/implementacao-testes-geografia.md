# Implementação da tarefa 002 — testes da área geográfica

Sou Daniel e autorizo a implementação da tarefa `.spec/tarefas/002-testes-geografia.md`, dentro do escopo e dos acordos abaixo.

## Antes de alterar

Leia `AGENTS.md`, `docs/guia-uso-de-ia.md`, `.spec/README.md`, `docs/requisitos-projeto-b.md`, `.spec/tarefas/002-testes-geografia.md` e `.agents/skills/testes-jest/SKILL.md`. Inspecione o estado do Git, os arquivos atuais da área geográfica, os testes existentes, os scripts disponíveis e as decisões de cobertura/CI em `.spec/tarefas/004-lint-cobertura-ci.md`.

Preserve alterações locais já existentes. Confirme que a tarefa continua atribuída à frente geográfica de Daniel e que não há conflito entre o estado atual e o escopo autorizado. Se encontrar mudança necessária fora da tarefa 002, dependência nova, requisito ambíguo que altere o escopo ou conflito com trabalho existente, pare nessa parte e explique antes de ampliar o trabalho.

## Escopo acordado

- Daniel conduz a tarefa por pertencer à área geográfica e à comunicação com provedores.
- A tarefa 002 pode avançar sem esperar a implementação das demais tarefas.
- Mantenha a suíte automatizada determinística e independente da internet; use mocks para isolar Axios/provedores nos testes unitários e de rota.
- Cubra contratos observáveis confirmados no código para o serviço geográfico e a rota, incluindo resultados válidos e falhas relevantes. Não transforme hipóteses em requisitos.
- A tarefa 004 é transversal e não bloqueia os testes geográficos. Não implemente lint, CI ou política/limiar de cobertura como parte desta tarefa. Registre a dependência de cobertura como pendente se ainda não houver decisão da equipe.
- Não adicione dependências nem migre Jest/Supertest sem necessidade justificada e alinhamento.

## Integração e limites das evidências

Inspecione o requisito B-TEC-05 e os testes atuais. Distinga explicitamente:

1. testes unitários do serviço, com a camada HTTP isolada;
2. testes de rota com Supertest, Axios/provedores mockados, que integram componentes da aplicação sem consultar o serviço externo;
3. eventual verificação contra o IBGE real, que depende de rede e disponibilidade externa.

Não faça a suíte padrão depender de provedor real. Não declare que um teste com Axios mockado valida comunicação real com o IBGE. Documente na tarefa qual evidência automatizada foi implementada e a limitação. Se não for possível concluir, com os documentos disponíveis, que ela satisfaz B-TEC-05, mantenha essa adequação como decisão pendente para a equipe; não amplie o escopo por conta própria.

## Implementação e fechamento

Faça alterações pequenas e limitadas à tarefa 002. Execute os testes acordados com os comandos realmente disponíveis no projeto. Registre comandos, resultados, falhas e limitações; não afirme validação não executada. Atualize o checklist e o histórico da tarefa apenas com evidências reais e acrescente o uso material de IA a `docs/ia.md`. Mantenha `CONTRIBUTORS.md` (que agora está na raiz do codigo )coerente com contribuições efetivamente realizadas, sem atribuir autoria exclusiva sobre a base reaproveitada.

Ao concluir, resuma arquivos alterados, cenários cobertos, comandos e resultados, distinção entre mocks e provedores reais, pendências e riscos. Não crie commit, push ou merge. Não use `x/` como fonte da implementação ativa.
