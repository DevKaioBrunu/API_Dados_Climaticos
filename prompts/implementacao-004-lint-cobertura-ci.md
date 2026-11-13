# Tarefa 004 — prompt para lint, cobertura e CI

Este prompt orienta a tarefa `.spec/tarefas/004-lint-cobertura-ci.md`.
Kaio Bruno Soares dos Santos aprovou o prompt e autorizou a implementação
em 2026-11-10, assumindo a condução desta tarefa com assistência de Codex.
A autorização veio da conversa, não da existência deste arquivo. O estado
atual e as evidências de execução estão na especificação da tarefa 004.

## Fontes e inspeção obrigatórias

1. Leia `AGENTS.md`, `.github/agents/Agente.md`,
   `docs/guia-uso-de-ia.md`, `.spec/README.md`, `.spec/projeto.md`,
   `.spec/tarefas/004-lint-cobertura-ci.md` e os requisitos B-TEC-06 e
   B-TEC-07 em `docs/requisitos-projeto-b.md`.
2. Inspecione a branch, o estado do Git e as mudanças locais. Preserve o
   trabalho existente, inclusive arquivos não rastreados.
3. Confira `package.json`, `package-lock.json`, `README.md`, os arquivos
   JavaScript ativos em `backend/src/` e `frontend/js/`, os testes
   Jest/Supertest e quaisquer configurações de lint, cobertura ou CI que
   existam no momento da execução.
4. Use `X/` somente como referência às orientações solicitadas; nunca como
   evidência de código ativo. Separe requisitos, fatos observados, hipóteses
   e decisões pendentes.

## Escopo autorizado e decisões registradas

O diagnóstico e o plano foram apresentados antes da autorização. Na
continuidade, confira o estado atual e respeite o escopo já aprovado;
novas necessidades fora dele devem ser apresentadas antes de ampliar o trabalho.

- Kaio conduz a tarefa transversal. Mudanças necessárias na frente
  geográfica de Daniel exigem apresentar a necessidade e obter alinhamento.
- ESLint 10, `@eslint/js` e `globals` como dependências de desenvolvimento.
  A proposta inicial de ESLint 9 foi corrigida após constatar seu fim de
  suporte em 2026-08-06. O ambiente de referência usa Node.js 22.13+ na linha 22.
- Lint do JavaScript do backend, testes, frontend e configurações de ESLint/Jest,
  com regras recomendadas e ambientes apropriados.
- Cobertura mínima de 80% global de declarações da API via Jest/Babel.
  Contabilizar `backend/src/**/*.js`, exceto `backend/src/tests/**` e o
  arquivo vazio `backend/src/app.js`; retirar essa última exclusão se o
  arquivo receber implementação. O percentual é decisão da entrega,
  não uma exigência numérica do curso.
- GitHub Actions com Node.js 22, push em `main`/`DEV`, PR para essas branches
  e acionamento manual; instalação pelo lockfile, lint e testes com cobertura.

A medição após configurar esse escopo confirmou 90,85% de declarações e
80,43% de ramificações. Use a especificação para consultar as evidências
e execute novamente as verificações quando houver alterações relevantes.

## Execução após autorização

1. Acrescente o comando reproduzível de lint e somente as dependências de
   desenvolvimento justificadas. Configure lint para o JavaScript ativo
   acordado, distinguindo ambientes Node.js, Jest e navegador. Não introduza
   regras de formatação ou refatorações amplas sem necessidade aprovada.
2. Configure Jest para coletar cobertura dos módulos ativos da API, incluindo
   arquivos sem teste direto, e falhar abaixo do mínimo aprovado. Declare a
   métrica, o valor e cada exclusão. Preserve Jest e Supertest.
3. Crie o workflow de CI acordado para instalar dependências de forma
   reproduzível, executar lint e executar testes com a política de cobertura.
   Não faça a suíte padrão depender de IBGE, Open-Meteo ou outro provedor real.
4. Documente os comandos de lint, testes e cobertura no `README.md`. Limite
   mudanças de código a correções diretamente necessárias para o lint
   aprovado; apresente antes qualquer necessidade de alterar outra frente.
5. Registre decisões e evidências em `.spec/tarefas/004-lint-cobertura-ci.md`
   e o uso material de IA em `docs/ia.md`. Mantenha `CONTRIBUTORS.md` coerente
   somente com contribuições efetivamente realizadas e confirmadas.

Arquivos abrangidos: `package.json`, `package-lock.json`, `eslint.config.cjs`,
`jest.config.cjs`, `.github/workflows/ci.yml`, `README.md` e os registros acima.
Os ajustes de código necessários ao lint foram limitados ao parâmetro não
utilizado no health e à anotação do global `ApiClient` no frontend.

## Validação e aceite

- Execute localmente os comandos aprovados para instalação, lint, testes
  e cobertura. Registre comando, ambiente, resultado, falhas e limitações.
- Confira que o comando de cobertura realmente falha abaixo do mínimo
  aprovado e que os arquivos contabilizados correspondem à política escrita.
- Revise o diff e execute `git diff --check`.
- Marque os critérios da tarefa 004 apenas com evidência correspondente:
  comandos documentados e reproduzíveis; mínimo declarado e respeitado;
  CI com instalação, lint e testes e execução verde comprovada.
- Trate um teste com Axios simulado como teste com mock. Não apresente a
  suíte como consulta real aos provedores nem a execução local como CI verde.
  A evidência de CI verde exige uma execução real e seu link; se ainda não
  existir, mantenha esse critério pendente.

Não faça commit, push ou merge sem autorização específica. Ao concluir,
informe o que foi analisado, arquivos alterados, comandos e resultados
reais, limitações, pendências e próximos passos. Não registre planejamento
como implementação concluída.
