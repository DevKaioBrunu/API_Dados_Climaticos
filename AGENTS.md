# Orientações para agentes de IA

## Contexto do projeto

API de dados climáticos e geográficos de cidades brasileiras.

Entrega: Projeto B do curso
FullCycle - Engenharia de Software - 4.0,
Projeto Final - Turma Online.

A base foi reaproveitada de um trabalho acadêmico anterior.
Distinguir código reaproveitado, alterações novas e validações realizadas.

## Estrutura da aplicação

- package.json e package-lock.json na raiz.
- Backend em backend/src/.
- Testes existentes em backend/src/tests/.
- Frontend em frontend/.
- Testes com Jest e Supertest.
- X/ contém material de referência, não código ativo.

Confirmar essas informações nos arquivos atuais antes de trabalhar.

## Responsabilidades da equipe

- Daniel: área geográfica e comunicação com provedores.
- Kaio: área climática e inicialização da aplicação.
- Tarefas transversais: conforme responsável definido na especificação.

Não alterar arquivos de outra frente sem apresentar a necessidade.

## Processo de trabalho

1. Ler a especificação da tarefa.
2. Inspecionar o código ativo.
3. Apresentar diagnóstico e plano.
4. Aguardar autorização para implementar.
5. Fazer alterações limitadas ao escopo.
6. Executar as verificações disponíveis.
7. Informar resultados e limitações.
8. Sugerir atualização da documentação e do registro de IA.

## Restrições

- Não refatorar sem necessidade e aprovação.
- Não trocar ferramentas sem justificativa.
- Não adicionar dependências sem explicar sua finalidade.
- Não ampliar o escopo do Projeto B.
- Não tratar sugestões anteriores como fatos confirmados.
- Não usar x/ como fonte da implementação atual.
- Não alterar segredos ou publicar credenciais.
- Não executar ações destrutivas, commits, pushes ou merges
  sem autorização explícita.

## Validação e honestidade técnica

- Não afirmar que testes passaram sem executá-los.
- Não confundir inicialização com funcionamento de ponta a ponta.
- Distinguir testes com mocks de consultas reais a provedores.
- Informar quando uma hipótese ainda precisa ser confirmada.
- Não registrar planejamento como contribuição concluída.

## Documentação

- Documentar o comportamento implementado, não o desejado.
- Registrar decisões técnicas relevantes.
- Atualizar docs/ia.md com os usos relevantes de IA.
- Manter CONTRIBUTORS.md coerente com as contribuições realizadas.
- Seguir o fluxo e o padrão de acompanhamento descritos em docs/guia-uso-de-ia.md e .spec/README.md.
