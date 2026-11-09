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
| 2026-11-09 | OpenAI Codex | Daniel, com assistência de Codex | Inventário do workspace, leitura do handoff e dos requisitos, seguida de organização documental autorizada. | Arquivos listados no diff desta etapa. Nenhum teste executado; documentação ainda requer revisão humana. |
| Anterior, data não registrada | Perplexity | Daniel e/ou equipe, conforme uso relatado | Tutoria, interpretação de requisitos, planejamento, diagnósticos e rascunhos. | Relato prévio em `x/CONTRIBUTORS.md`; prompts completos, decisões específicas e validações não foram preservados. |

## Próximas atualizações

Acrescentar entradas quando IA contribuir materialmente com implementação, análise ou decisão. Registrar ferramenta, participante, objetivo/prompt relevante, sugestão aceita ou rejeitada, decisão humana e verificação executada. Não registrar planejamento como contribuição concluída nem testes sugeridos como testes aprovados.
