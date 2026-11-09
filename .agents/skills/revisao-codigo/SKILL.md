---
name: revisao-codigo
description: Revisar mudanças da API contra requisitos, escopo, comportamento e evidências sem alterar o código.
---

# Revisão de código

1. Leia `AGENTS.md`, a tarefa em `.spec/` e a especificação de requisitos aplicável.
2. Inspecione o diff e os caminhos de execução relevantes; não use `x/` como fonte do código ativo.
3. Confira contratos, tratamento de falhas, limites entre áreas de responsabilidade, documentação e verificações realizadas.
4. Priorize achados por impacto e forneça arquivo/linha e cenário. Separe defeitos confirmados de riscos e hipóteses.
5. Não faça alterações. Não afirme que testes passaram sem evidência; indique quais verificações não foram executadas.
