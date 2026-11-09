# Especificações e tarefas

Este diretório mantém a visão de escopo e os rascunhos de trabalho do Projeto B. Os requisitos consolidados em [`../docs/requisitos-projeto-b.md`](../docs/requisitos-projeto-b.md) são a referência local; confirme qualquer ambiguidade na fonte do curso antes de tomar uma decisão.

## Como usar

- `projeto.md` resume objetivo, limites, requisitos e estado observado.
- `tarefas/NNN-*.md` descreve uma entrega pequena, seu responsável, dependências, aceite e validação.
- Atualize estados somente com evidências. “Planejado” e “em alinhamento” não significam implementação concluída.
- Use em cada tarefa as seções `Checklist de aceite` e `Histórico de andamento`, conforme o padrão abaixo.
- Antes de implementar, inspecione o código ativo e leia as instruções aplicáveis. Respeite a autorização e os limites de frente definidos pela equipe.
- Registre hipóteses como hipóteses. Não derive requisitos numéricos que a fonte não define.
- Atualize `docs/ia.md` e `x/CONTRIBUTORS.md` quando houver uso relevante de IA ou contribuição efetivamente realizada.

Os documentos aqui são especificações e convenções da equipe; não são prova de funcionamento nem garantia de carregamento automático por uma IDE.

## Padrão de acompanhamento das tarefas

Cada `tarefas/NNN-*.md` deve indicar estado atual, responsável (ou pendente), requisitos relacionados, objetivo, limites, dependências, arquivos, critérios de aceite e verificações.

### Checklist de aceite

Escreva critérios observáveis e específicos. Use `[ ]` enquanto o critério não foi verificado; marque `[x]` somente após a evidência correspondente. Se a verificação estiver pendente, falhar ou não puder ser executada, deixe o item desmarcado e explique a limitação. Planejamento e criação da especificação não contam como implementação.

### Histórico de andamento

Mantenha um histórico cronológico de avanços relevantes, decisões de escopo e validações. Acrescente linhas; não apague eventos anteriores para ocultar uma tentativa ou falha. Datas no padrão ISO `AAAA-MM-DD`. Diferencie planejamento, implementação e validação e não atribua a uma pessoa trabalho sem evidência.

```markdown
## Checklist de aceite

- [ ] Critério observável e verificável.
- [ ] Outro critério observável.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| AAAA-MM-DD | Nome | Planejamento, implementação ou validação realizada. | Comando, resultado, commit/PR ou pendência. |
```

Para uma tarefa ainda não iniciada, mantenha o checklist desmarcado e declare que não há implementação registrada. Acrescente uma atualização quando houver avanço material; não é necessário criar uma entrada para cada conversa ou edição trivial.
