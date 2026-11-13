# 004 — Lint, cobertura e CI

**Estado:** implementada; CI #5 confirmado para `d6ae88d`; fechamento local revalidado com 42 testes e 89,47% de declarações. CI das alterações locais posteriores depende de envio autorizado.

**Responsável pela condução:** Kaio Bruno Soares dos Santos, que aprovou o prompt e autorizou a implementação nesta conversa; assistência de OpenAI Codex.

**Requisitos:** B-TEC-06 e B-TEC-07.

## Objetivo

Configurar lint, um mínimo de cobertura justificado e CI com instalação de dependências, lint e testes; obter evidência de execução verde.

## Situação inicial

Antes desta implementação, `package.json` tinha scripts `start`, `dev`, `test` e `check-routes`, sem lint ou política de cobertura/CI. Jest e Supertest já eram usados. O requisito não define percentual mínimo.

## Decisões e escopo implementado

- Kaio aprovou o prompt e pediu a implementação em 2026-11-10. As alterações são da tarefa transversal 004; não atribuem autoria exclusiva sobre a base reaproveitada.
- ESLint 10 com `@eslint/js` para regras recomendadas e `globals` para Node.js, Jest e navegador, todos como dependências de desenvolvimento com versões exatas. A proposta anterior de ESLint 9 foi corrigida porque essa linha [encerrou o suporte em 2026-08-06](https://eslint.org/docs/v9.x/use/configure/configuration-files). O README passa a indicar Node.js 22.13+ na linha 22 para desenvolvimento e verificações; o CI usa Node.js 22, como o Docker existente.
- `npm run lint` verifica `backend/src/`, `frontend/js/`, `eslint.config.cjs` e `jest.config.cjs`, incluindo testes e `checkRoutes.js`. Usa regras recomendadas, sem impor reformatação. Dependências, relatórios e `X/` ficam fora do lint.
- As únicas mudanças no código existente são a remoção de um parâmetro de `catch` não utilizado no health e a anotação de exportação do global `ApiClient` no frontend. Não houve alteração dos contratos HTTP, dos testes existentes ou dos módulos geográficos.
- `npm run test:coverage` aplica **80% global de declarações**, com o provedor Babel já usado na medição anterior. É um piso inicial para a base reaproveitada, abaixo dos 90,85% medidos, com margem de 10,85 pontos percentuais; não é um percentual exigido pelo curso. Ramificações, funções e linhas são informativas, sem mínimo separado. A regra é global, não por arquivo.
- `collectCoverageFrom` abrange `backend/src/**/*.js`, inclusive módulos sem teste direto. Exclui `backend/src/tests/**` (testes e verificador manual) e `backend/src/app.js` (vazio e não executado). Se `app.js` receber implementação, retirar sua exclusão. Frontend, configurações e `X/` estão fora do escopo de cobertura da API; `index.js`, rotas e serviços permanecem contabilizados integralmente.
- `.github/workflows/ci.yml` usa GitHub Actions, Ubuntu, Node.js 22 e cache npm; executa `npm ci`, `npm run lint` e `npm run test:coverage -- --ci --runInBand`. Gatilhos: push em `main`/`DEV`, PR para essas branches e execução manual. Não executa chamadas reais a provedores.

## Arquivos e dependências

- Configurações: `eslint.config.cjs`, `jest.config.cjs`, `.github/workflows/ci.yml`.
- Scripts e dependências: `package.json`, `package-lock.json`. Foram adicionados `eslint@10.14.0`, `@eslint/js@10.0.1` e `globals@17.14.0`; nenhuma versão anteriormente presente no lockfile foi alterada ou removida.
- Ajustes locais de lint: `backend/src/index.js` e `frontend/js/api.js`.
- Documentação e rastreabilidade: `README.md`, esta tarefa, prompts da tarefa 004, `docs/ia.md` e `CONTRIBUTORS.md`.

## Checklist de aceite

- [x] Comandos documentados e reproduzíveis para lint e testes.
- [x] Cobertura mínima explicitamente declarada e respeitada, com exclusões justificadas.
- [x] Workflow preparado com instalação, lint e testes; YAML lido e comandos validados localmente.
- [x] CI executa instalação, lint e testes e possui evidência de execução verde.

## Validação local em 2026-11-10

Ambiente: Node.js 22.23.4 e npm 10.9.9 do Linuxbrew disponíveis no `PATH`.

| Verificação | Resultado |
|---|---|
| `npm ci --cache /tmp/api-clima-npm-cache --fetch-retries=0 --fetch-timeout=20000` | Instalação pelo lockfile passou com acesso à rede. A tentativa anterior `npm ci --offline --cache /tmp/api-clima-npm-cache --no-audit --no-fund` falhou por cache incompleto (`ENOTCACHED`). |
| `npm run lint` | Passou sem erros ou avisos após corrigir os dois apontamentos de `no-unused-vars`. |
| `npm run test:coverage -- --ci --runInBand` | 6 suítes e 39 testes passaram; 149 de 164 declarações cobertas (90,85%), ramificações 80,43%, funções 83,33%, linhas 91,35%. Execução fora do sandbox por causa das portas TCP temporárias do Supertest. |
| `npm run test:coverage -- --runInBand --runTestsByPath backend/src/tests/weather.test.js --coverageReporters=text --coverageDirectory=/tmp/api-clima-004-negative-coverage` | Verificação negativa: os 4 testes passaram, mas o processo saiu com código 1 por cobertura global de 14,02%, inferior aos 80% configurados. Comprova que arquivos não exercitados entram no cálculo e que o mínimo reprova a execução. |
| ESLint `lintText` com variável indefinida em memória | Detectou `no-undef` em arquivos representativos de backend, testes e frontend. Nenhum arquivo de teste foi adicionado. |
| Leitura do workflow com `js-yaml` já presente nas dependências | YAML válido e sequência de comandos conferida; não equivale à execução do GitHub Actions. |

Testes usaram mocks de Axios/cliente HTTP, sem consultas reais aos provedores. Os relatórios da suíte completa ficam em `coverage/`, ignorada pelo Git. O relatório da verificação negativa foi direcionado para `/tmp`, preservando a medição completa.

## Limitações e pendências

- **CI remoto:** a captura anterior de Kaio confirmou CI #1 em `c97ed29`. No fechamento, a API pública do GitHub confirmou [CI #5](https://github.com/DevKaioBrunu/API_Dados_Climaticos/actions/runs/43300946340), branch `DEV`, `d6ae88d`, `completed/success`. A validação remota do fechamento local continua pendente do envio autorizado.
- **Dependências:** o npm reportou 19 vulnerabilidades no conjunto instalado (3 baixas, 13 moderadas, 2 altas e 1 crítica). A correção dessas vulnerabilidades não foi feita; não foi usado `npm audit fix`. O alerta não distingue, nesta análise, quais vulnerabilidades já existiam antes da tarefa.
- **Ambiente:** a primeira instalação das dependências de lint foi bloqueada no sandbox com `EAI_AGAIN` e passou com rede autorizada. Uma comparação do lockfile via subprocesso Git também recebeu `EPERM` no sandbox e passou fora dele; as versões existentes foram preservadas.
- Docker, verificação visual do frontend, `check-routes` e consultas reais aos provedores não foram executados nesta tarefa.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação de Daniel | Rascunho transversal preparado; responsável ainda não confirmado e implementação não iniciada. | Inspeção de `package.json`: há `test`, mas não há script `lint` declarado. |
| 2026-11-10 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Iniciado o planejamento da tarefa transversal e preparado o prompt específico; responsável, ferramenta, limiar e escopo final ainda aguardam decisão da equipe. Nenhuma implementação da tarefa 004 foi feita. | `npm test -- --coverage --coverageReporters=text --runInBand`: 6 suítes e 39 testes passaram fora do sandbox; cobertura padrão atual de 90,85% de declarações e 80,43% de ramificações. A primeira tentativa no sandbox falhou com `listen EPERM` por causa da porta TCP temporária do Supertest. Testes com mocks, sem consultas reais aos provedores; CI não executado. |
| 2026-11-10 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Criado `prompts/implementacao-004-lint-cobertura-ci.md` para orientar a futura execução da tarefa. O prompt mantém responsável e escolhas técnicas como pendências e não concede autorização de implementação. | Prompt revisado contra `AGENTS.md`, `Agente.md` e os critérios da tarefa 004. Nenhum lint, limiar ou workflow foi implementado ou executado nesta etapa. |
| 2026-11-10 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Após aprovação do prompt e autorização explícita, implementados lint com ESLint 10, piso global de 80% de declarações, workflow GitHub Actions e documentação. ESLint 9 substituído na proposta pelo 10 devido ao fim de suporte; Jest/Supertest preservados. | Instalação pelo lockfile e lint passaram; 6 suítes/39 testes passaram com 90,85% de declarações. Verificação negativa saiu com código 1 ao medir 14,02%, mantendo o piso de 80%. CI remoto e seu link verde continuam pendentes; npm reportou 19 vulnerabilidades. |
| 2026-11-11 | Kaio Bruno Soares dos Santos | Informou que o CI passou e forneceu captura da execução. | Captura mostra CI #1 verde para `c97ed29` em `DEV`; os passos individuais e o link direto da execução não estão visíveis. |
| 2026-11-12 | Kaio, com assistência de OpenAI Codex | Fechamento revalidou instalação, lint/cobertura e confirmou metadados do CI #5 via API pública. | npm ci passou; instalação completa reportou 15 vulnerabilidades baixas/moderadas. Após falhas iniciais por pino ausente e listen EPERM no sandbox, execução autorizada passou: 7 suítes/42 testes, 89,47% de declarações. CI #5 em d6ae88d: completed/success; CI das alterações locais pendente do envio autorizado. |
