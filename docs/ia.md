# Uso de inteligência artificial

Este registro descreve usos efetivamente realizados no projeto. Sugestões de IA são avaliadas pela equipe; não substituem decisões humanas, execução de comandos, evidências de autoria nem validação do comportamento da aplicação.

## Ferramentas e forma de trabalho

### Perplexity

O Perplexity foi usado como apoio de tutoria e planejamento: interpretação dos requisitos do curso, esclarecimento de conceitos de Node.js, Git e Docker, apoio a diagnósticos e preparação de rascunhos. Essas interações ajudaram a organizar o trabalho, mas não comprovam que as sugestões tenham sido adotadas, que uma falha exista ou que algum requisito esteja concluído. A equipe confirma cada sugestão no repositório e nas verificações correspondentes.

### OpenAI Codex, nesta sessão

Codex foi usado para ler o handoff, as instruções do repositório, os arquivos de implementação e os requisitos consolidados em `docs/requisitos-projeto-b.md`; apresentar um inventário e um plano antes de editar; e, após autorização de Daniel, organizar documentação de apoio orientada por especificações.

Prompt relevante, resumido: “Leia este handoff e continue a partir do workspace atual. Comece pelo inventário e pelo plano. Não altere arquivos ainda.” Depois da apresentação do inventário, Daniel autorizou implementar as mudanças, indicou `docs/requisitos-projeto-b.md` como fonte dos requisitos e esclareceu que o registro de contribuições deve permanecer em `x/` por enquanto, enquanto o uso de Codex, Perplexity, spec-driven development, skills e prompts deve ser documentado.

Resultado desta etapa: foram preparados arquivos de especificação, modelos de prompt, procedimentos reutilizáveis de skill e registros de uso de IA e contribuições. O conteúdo organiza trabalho futuro; não implementa Docker, não altera o comportamento da API e não conclui os requisitos técnicos do Projeto B. Não foram executados testes nesta etapa.

Decisões humanas: Daniel autorizou esta etapa e definiu o limite de manter o arquivo de contribuições em `x/`, fora da raiz de entrega por enquanto. Requisitos e status foram vinculados à consolidação fornecida em `docs/requisitos-projeto-b.md`, sem inventar percentuais, metas numéricas ou escolhas de ferramentas. A equipe permanece responsável por revisar, entender e aprovar os artefatos antes de usá-los como evidência acadêmica.

## Fluxo spec-driven adotado

1. Consultar `AGENTS.md`, o handoff e a especificação relevante antes de propor trabalho.
2. Inspecionar o código ativo e distinguir evidência observada, hipótese e requisito.
3. Registrar objetivo, responsável, limites, dependências, critérios de aceite e validações em `.spec/`.
4. Planejar sem editar quando solicitado; iniciar implementação somente após autorização aplicável.
5. Implementar em escopo pequeno, revisar o diff e executar apenas as verificações planejadas/autorizadas.
6. Atualizar documentação, evidências de contribuição e este registro com o que realmente ocorreu.

Os diretórios `.spec/`, `.agents/skills/` e `prompts/` são convenções locais do projeto. A existência dos arquivos não garante que a IDE os carregue automaticamente; os procedimentos podem ser consultados explicitamente. Skills descrevem fluxos reutilizáveis, e prompts são pontos de partida que devem ser adaptados à tarefa.

## Registro por etapa

| Data | Ferramenta | Participante | Uso e decisão | Evidência/validação |
|---|---|---|---|---|
| 2026-11-10 | Antigravity | Kaio Bruno Soares dos Santos, com assistência de Antigravity | Elaboração do prompt específico `prompts/implementacao-testes-clima.md` decomposto em 4 tasks e implementação das Tasks 01 a 04 da tarefa 003: criação dos testes unitários de `weather.js` com mock de `httpClient` (`weather.test.js`), ampliação dos testes da rota de clima (`clima.test.js`), documentação do `health.test.js` e criação do teste de integração interna da aplicação Express (`clima.integration.test.js`, B-TEC-05). Kaio autorizou cada etapa sequencialmente. | `weather.test.js` (4/4 passaram); `clima.test.js` (14/14 passaram); `health.test.js` e `clima.integration.test.js` (4/4 passaram); `npm test -- --coverage --runInBand` com 6 suítes / 39 testes passando (0 falhas); cobertura medida: 100% em `weather.js`, 95.45% em `clima.js` e 90.85% global de statements. Testes determinísticos com mocks, sem chamadas reais aos provedores. |
| 2026-11-10 | OpenAI Codex | Kaio Bruno Soares dos Santos, com assistência de Codex | Após revisão solicitada por Kaio antes do commit, foram fortalecidas as asserções dos oito cenários de sucesso em `clima.test.js`, verificada a ordem das chamadas simuladas em `clima.integration.test.js` e corrigidas a descrição do Supertest e a documentação da tarefa 003, do guia e do handoff para QA. Kaio autorizou esta correção; o mínimo de B-TEC-06 permanece na tarefa 004. | `npm test -- --coverage --coverageReporters=text --runInBand` (Node.js do Linuxbrew): 6 suítes e 39 testes passaram; cobertura de declarações: `weather.js` 100%, `clima.js` 95.45%, total 90.85%. `git diff --check`: sem erros. Testes com Axios mockado, sem chamadas reais aos provedores. Aceitação formal da integração para B-TEC-05 e mínimo de cobertura de B-TEC-06 pendentes. Nenhum commit criado. |
| 2026-11-09 | OpenAI Codex | Daniel, com assistência de Codex | Redação de `docs/guia-uso-de-ia.md` e padronização do checklist de aceite e histórico datado nas tarefas `.spec/`. | Atualização documental baseada no pedido de Daniel e no conteúdo observado das tarefas. Nenhum código de aplicação foi alterado e nenhum teste foi executado nesta atualização. |
| 2026-11-09 | OpenAI Codex | Daniel, com assistência de Codex | Preparação do prompt `prompts/implementacao-testes-geografia.md` para executar a tarefa 002 conforme o escopo acordado: testes determinísticos com mocks, trabalho geográfico conduzido por Daniel, tarefa transversal 004 sem bloquear e distinção clara entre integração mockada e provedores reais. | Prompt criado e listado em `prompts/README.md`. Nenhuma implementação ou teste da tarefa 002 foi realizado nesta etapa. |
| 2026-11-09 | OpenAI Codex | Daniel, com assistência de Codex | Implementação da tarefa 002: testes unitários de `buscarCidadesPorUF`, ampliação dos testes Supertest da rota, atualização da especificação e deste registro. | `npm.cmd test -- --runInBand backend/src/tests/ibge.test.js backend/src/tests/cidades.test.js`: 2 suítes/17 testes passaram; `npm.cmd test -- --runInBand`: 7 suítes/46 testes passaram. Testes com mocks, sem consultas reais ao IBGE. O requisito B-TEC-05 permanece sujeito à confirmação da equipe. |
| 2026-11-09 | OpenAI Codex | Daniel, com assistência de Codex | Inventário e organização documental; após autorização, Docker da API e extensão para servir o frontend em Compose, documentação e verificações locais. | API e frontend construídos e iniciados; página, CSS e JS responderam HTTP 200; health, cidades e clima passaram via proxy Nginx, incluindo consultas reais a IBGE e Open-Meteo. Os botões não foram automatizados por indisponibilidade do host de navegador. A stack foi deixada ativa e depois Daniel executou `docker compose down`, confirmando a remoção de containers e rede. Testes automatizados não executados. O npm reportou 4 vulnerabilidades (1 moderada, 2 altas, 1 crítica). |
| Anterior, data não registrada | Perplexity | Daniel e/ou equipe, conforme uso relatado | Tutoria, interpretação de requisitos, planejamento, diagnósticos e rascunhos. | Relato prévio em `x/CONTRIBUTORS.md`; prompts completos, decisões específicas e validações não foram preservados. |

## Próximas atualizações

Acrescentar entradas quando IA contribuir materialmente com implementação, análise ou decisão. Registrar ferramenta, participante, objetivo/prompt relevante, sugestão aceita ou rejeitada, decisão humana e verificação executada. Não registrar planejamento como contribuição concluída nem testes sugeridos como testes aprovados.
