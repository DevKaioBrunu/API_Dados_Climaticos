---
name: testes-jest
description: Planejar, escrever e avaliar testes Jest/Supertest para a API, distinguindo unidade, integração e mocks externos.
---

# Testes com Jest e Supertest

1. Leia `AGENTS.md`, a tarefa aplicável em `.spec/tarefas/` e o código ativo.
2. Identifique contrato observado e comportamento que o teste deve proteger; não converta hipóteses em expectativas sem decisão da equipe.
3. Classifique cada teste como unitário, integração ou verificação contra serviço real. Registre quando Axios/provedores estão mockados.
4. Preserve Jest/Supertest já usados. Não migre ferramenta nem adicione dependência sem necessidade justificada e alinhamento.
5. Após autorização de implementação, cubra resultados e falhas relevantes com asserções específicas; evite dependência de rede em testes determinísticos.
6. Execute o comando de teste acordado e relate o resultado real, cobertura quando configurada e limites do que foi exercitado.
