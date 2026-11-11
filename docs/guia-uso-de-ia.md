# Guia de uso de IA no desenvolvimento

## Finalidade

Este guia descreve como a equipe usa assistentes de IA para apoiar o desenvolvimento da API Dados Climáticos. A IA pode ajudar a entender o repositório, planejar uma tarefa, preparar alterações, analisar resultados e redigir documentação. A equipe continua responsável por requisitos, decisões, código entregue e evidências.

O fluxo é **orientado por especificações** (*spec-driven*): antes de implementar uma mudança, a equipe registra o que precisa ser feito, quem responde pela tarefa, os limites do trabalho e como o resultado será aceito. A especificação orienta pessoas e ferramentas; ela não é código executável e não dispara trabalho automaticamente.

## Arquivos e responsabilidades

| Arquivo ou pasta | Para que serve |
|---|---|
| `AGENTS.md` | Regras curtas e permanentes para o trabalho de agentes neste repositório. |
| `.spec/projeto.md` | Objetivo, limites, requisitos e estado geral confirmado. |
| `.spec/tarefas/` | Escopo de cada entrega, responsável, checklist de aceite e histórico datado. |
| `.agents/skills/*/SKILL.md` | Procedimentos reutilizáveis para tipos de trabalho, como Docker, testes e revisão. O agente pode aplicá-los quando a tarefa for compatível ou quando forem solicitados. |
| `prompts/` | Modelos de pedidos que a equipe adapta à tarefa. Não executam por conta própria. |
| `docs/ia.md` | Registro dos usos relevantes de IA que realmente ocorreram, das decisões humanas e das validações. |
| `CONTRIBUTORS.md` | Registro de autoria e contribuições para a entrega do curso. A cópia em `x/` é local e ignorada pelo Git; ela não substitui o arquivo de entrega na raiz. |

As instruções e skills disponíveis dependem da ferramenta e da configuração do ambiente. A presença de um arquivo no repositório não garante, sozinha, que qualquer assistente ou IDE o carregue automaticamente. Quando necessário, a equipe deve apontar explicitamente para o documento pertinente.

## Fluxo recomendado para cada tarefa

1. **Escolher e ler a tarefa.** Consultar `AGENTS.md`, os requisitos do curso e o arquivo correspondente em `.spec/tarefas/`.
2. **Inspecionar o estado atual.** Conferir branch, mudanças locais, código ativo e verificações existentes. Separar requisito, fato observado e hipótese.
3. **Planejar antes de editar.** Descrever objetivo, responsável, escopo, itens fora do escopo, dependências, arquivos afetados, critérios de aceite e validações. Registrar decisões ainda em aberto.
4. **Alinhar a autorização.** O responsável humano confirma o escopo e autoriza a implementação. A existência de uma tarefa ou de um prompt não é, por si só, autorização para mudar código.
5. **Implementar em partes pequenas.** Usar a skill adequada como procedimento, se disponível. Preservar o trabalho existente, respeitar as frentes da equipe e justificar dependências novas.
6. **Verificar o resultado.** Executar as verificações previstas e registrar os comandos e resultados reais. Distinguir testes com mocks, chamadas reais a provedores e simples inicialização.
7. **Revisar e entregar.** Conferir o diff, explicar decisões e limitações, atualizar o checklist e o histórico da tarefa. Fazer commits/PRs com autoria individual conforme o fluxo acordado pela equipe.
8. **Registrar uso relevante de IA.** Atualizar `docs/ia.md` quando a IA contribuir materialmente para planejamento, código, análise ou documentação.

## Como registrar o andamento em `.spec/tarefas/`

Cada tarefa deve manter:

- Um estado atual curto e responsável definido ou explicitamente pendente.
- Um **checklist de aceite** com `[ ]` para itens não verificados e `[x]` somente para itens concluídos com evidência. Planejamento escrito não conta como implementação concluída.
- Um **histórico de andamento** em ordem cronológica, com data ISO (`AAAA-MM-DD`), participante, mudança ou decisão, e evidência/resultado. Acrescentar uma linha após cada avanço, decisão de escopo ou validação relevante; não reescrever o passado para esconder falhas.
- Uma distinção clara entre planejamento, implementação, validação e pendências. Se uma verificação falhar ou não puder ser executada, registrar a limitação em vez de marcar o aceite.

Modelo:

```markdown
## Checklist de aceite

- [ ] Critério observável e verificável.
- [ ] Outro critério observável.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| AAAA-MM-DD | Nome | O que ocorreu, indicando se foi planejamento, implementação ou validação. | Comando, teste, diff, commit/PR ou pendência. |
```

Se a tarefa ainda não começou, mantenha os critérios desmarcados e registre “sem implementação até o momento” no estado ou na primeira entrada de histórico. Não crie eventos ou datas retroativos sem evidência.

## Responsabilidades e limites

- A pessoa responsável confirma o objetivo, aprova decisões e compreende o código que entrega.
- A IA pode propor alternativas, mas não transforma sugestão em requisito ou decisão da equipe.
- A IA não deve afirmar que testes, integrações, CI ou requisitos passaram sem execução e evidência.
- Código reaproveitado, alterações da equipe e alterações assistidas por IA devem ser distinguidos quando houver evidência disponível; autoria é demonstrada por commits e PRs, não por uma declaração do assistente.
- Não fornecer segredos ao assistente nem incluí-los em arquivos, prompts, logs ou histórico Git.
- Não adicionar dependências, alterar outra frente, publicar, fazer push, merge ou executar ação destrutiva sem autorização aplicável.
- Prompts e skills ajudam a manter consistência; não substituem especificação, revisão humana, autorização ou validação.

## Registro em `docs/ia.md`

Para cada uso material, registrar, conforme disponível:

- ferramenta e participante;
- objetivo ou resumo do prompt relevante;
- arquivos ou decisões influenciados;
- sugestões aceitas/rejeitadas e decisão humana;
- comandos de validação e resultados reais;
- limitações, commit/PR quando existirem.

Não é necessário registrar cada pergunta trivial. É importante registrar contribuições que afetaram requisitos, implementação, decisões técnicas, documentação ou evidências da entrega.

## Continuidade desta equipe

Na continuação do projeto, Kaio pode revisar `.spec/tarefas/003-testes-clima.md`, que registra testes climáticos implementados e validados com mocks. A definição e a verificação de um mínimo de cobertura para B-TEC-06 permanecem na tarefa 004; a aceitação formal da integração interna com Axios simulado para B-TEC-05 ainda depende da equipe. Daniel e Kaio devem combinar branch, revisão por PR e validação antes de iniciar mudanças em arquivos compartilhados.
