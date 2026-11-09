---
name: docker-node
description: Planejar e implementar a execução da API Node.js com Docker Compose, após autorização explícita para a tarefa.
---

# Docker para a API Node.js

1. Leia `AGENTS.md`, `.spec/tarefas/001-execucao-docker.md` e `docs/requisitos-projeto-b.md`.
2. Inspecione scripts, entrada real, porta, dependências e arquivos necessários ao runtime. Não presuma configuração que não existe.
3. Apresente diagnóstico, arquivos afetados, decisões e riscos; aguarde autorização específica antes de editar.
4. Após autorização, faça mudanças mínimas em Dockerfile, Compose, `.dockerignore` e documentação prevista. Não inclua `x/`, segredos, dependências locais ou testes no runtime sem justificativa.
5. Valide build, inicialização e resposta HTTP no container conforme a tarefa. Diferencie inicialização de fluxo ponta a ponta e de consulta real a provedores.
6. Registre comandos, resultados, limitações e uso de IA em `docs/ia.md`; atualize a evidência de contribuições local conforme decisão da equipe.
