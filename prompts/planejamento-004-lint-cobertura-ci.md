# Planejamento — tarefa 004: lint, cobertura e CI

**Registro da fase de planejamento:** a implementação foi posteriormente
autorizada por Kaio em 2026-11-10. Consulte a tarefa 004 e
`prompts/implementacao-004-lint-cobertura-ci.md` para as decisões adotadas,
as validações locais e a pendência de execução remota do CI.

Leia `AGENTS.md`, `.github/agents/Agente.md`, `docs/guia-uso-de-ia.md`,
`.spec/README.md`, `.spec/projeto.md`, `.spec/tarefas/004-lint-cobertura-ci.md`
e os requisitos B-TEC-06 e B-TEC-07 em `docs/requisitos-projeto-b.md`.
Trate `X/` somente como referência, nunca como código ativo.

Kaio Bruno Soares dos Santos solicitou o planejamento. Naquela etapa, a
responsabilidade transversal ainda era pendente; a aprovação e a condução
posteriores estão registradas na especificação. Preserve essa distinção
entre o planejamento inicial e a implementação autorizada.

Inspecione o estado do Git, `package.json`, `package-lock.json`, os arquivos
JavaScript ativos em `backend/src/` e `frontend/js/`, os testes Jest/Supertest,
o README e qualquer configuração de lint, cobertura ou CI já existente.
Separe requisitos, fatos observados, hipóteses e decisões pendentes.

Apresente um plano que contenha:

1. Objetivo, responsável pendente, escopo e itens fora do escopo.
2. Ferramenta de lint proposta, arquivos abrangidos, regras iniciais e
   exclusões justificadas; explique cada dependência nova e a versão de
   Node.js necessária.
3. Métrica e limiar de cobertura propostos, módulos que serão contabilizados,
   exclusões justificadas e comando que falhará abaixo do mínimo. Não trate
   a medição atual como um mínimo já definido.
4. Workflow CI proposto: gatilhos, ambiente, instalação reprodutível,
   lint, testes com cobertura e evidência de execução verde.
5. Arquivos previstos, riscos, critérios de aceite e validações locais e
   remotas. Distinga testes com provedores simulados de consultas reais.

Não altere código, dependências, configuração ou workflow durante o
planejamento. Apresente as decisões à equipe e aguarde autorização explícita
para implementar. Depois de autorizado, registre somente resultados
efetivamente verificados na tarefa e em `docs/ia.md`; não faça commit, push
ou merge sem autorização específica.
