# Implementação — tarefa 005: observabilidade

## Autorização e autoridade de decisão

Daniel é o responsável escolhido pela equipe e mantém a responsabilidade pelas
decisões da tarefa. A pedido dele, a IA deve comparar opções e recomendar
caminhos técnicos simples, seguros, fáceis de operar e explicar pela equipe.
Daniel autoriza a implementação dentro do escopo descrito abaixo; implemente a
alternativa recomendada, registre justificativa e trade-offs e não interrompa
por escolhas técnicas rotineiras. Apresente as recomendações como decisões do
projeto autorizadas por Daniel, nunca como requisitos do curso.

Esta autorização não inclui commits, pushes, merges, publicação/deploy,
alterações destrutivas, acesso a segredos ou consultas reais a provedores
externos. Não inclua credenciais em código, configuração, logs ou documentação.
Respeite as frentes da equipe: prefira instrumentação transversal; se for
necessário tocar arquivos de uma frente geográfica ou climática, explique a
necessidade e limite a mudança a observabilidade, sem alterar a lógica de
negócio. Não declare consenso de toda a equipe sem evidência.

## Contexto e fontes

Antes de editar, leia `AGENTS.md`, `.spec/README.md`, `.spec/projeto.md`,
`.spec/tarefas/005-observabilidade.md`, `docs/guia-uso-de-ia.md`,
`docs/requisitos-projeto-b.md` e a documentação ativa pertinente. Inspecione
`git status`, `package.json`, `package-lock.json`, Docker/Compose, o backend
ativo, testes e configuração de CI/monitoramento. Preserve alterações locais
existentes. `x/` é referência, não fonte da implementação atual.

Use B-OPE-03, B-OPE-04 e B-OPE-05 como requisitos: logs estruturados, ao menos
uma métrica observável e um SLO simples. A fonte do curso não fixa biblioteca,
métrica, indicador, janela nem meta numérica; exemplos de ferramentas não são
obrigatórios. Confirme todos os fatos no código atual. Verifique onde a rota
`/api/v1/health` está implementada: `backend/src/app.js` foi identificado
anteriormente como vazio e a aplicação ativa aponta para `backend/src/index.js`.

## Decisões técnicas

Escolha uma solução completa e coerente para logs, métrica, coleta e SLO.
Considere primeiro as opções mais simples que atendem aos requisitos. Avalie
biblioteca versus implementação nativa, custo de dependências, adequação ao
Node/Express, execução no Compose, privacidade, exposição da telemetria,
cardinalidade e capacidade real de calcular o SLO na janela escolhida. Não
adicione Grafana, tracing distribuído, alertas ou serviços auxiliares sem
necessidade demonstrada.

Você pode escolher biblioteca, métrica, indicador, janela e meta numérica do
SLO. Escolha um objetivo inicial justificável e verificável após definir o
indicador e o método de medição. Registre que é uma decisão deste projeto, não
uma exigência da fonte do curso. Diferencie objetivo declarado, resultado
medido e disponibilidade real. Não afirme que o SLO foi cumprido durante uma
janela que não foi observada.

Para métricas de requisição, use apenas labels de cardinalidade limitada, como
método, rota normalizada e classe/código de status. Nunca use nome de cidade,
UF informada, coordenadas, URL, query string, identificador de usuário ou texto
livre como label. Se optar por endpoint de métricas, explique e documente como
será lido/coletado no Compose e restrinja sua exposição ao mínimo necessário.
Um endpoint exposto sem coleta ou leitura documentada não basta para demonstrar
um SLI ao longo do tempo.

Para logs, prefira campos explícitos e dados mínimos. Não registre corpos,
cabeçalhos, coordenadas, URLs completas, query strings, nomes de cidades ou
mensagens brutas de erro sem necessidade. Analise especialmente erros do IBGE
cuja URL pode conter o nome pesquisado e objetos/mensagens de erro que possam
revelar parâmetros. Evite duplicação de registros para a mesma falha. Use
`stdout`/`stderr` compatível com containers, níveis coerentes e contexto de
requisição sem dados fornecidos pelo usuário.

## Implementação

1. Faça um diagnóstico curto antes de editar: estado do Git, arquivos ativos,
   locais atuais de log, comportamento de sucesso/erro das rotas, configurações
   existentes e riscos de dados. Separe fatos, hipóteses e decisões tomadas.
2. Defina uma implementação mínima que cubra logs estruturados, pelo menos uma
   métrica, método de leitura/coleta e SLO com indicador, janela e meta.
3. Implemente apenas o necessário. Explique a finalidade de cada dependência
   nova e atualize `package-lock.json` se adicionar dependências. Não troque
   ferramentas já usadas sem justificativa.
4. Adicione ou adapte testes Jest/Supertest para verificar formato/campos dos
   logs, ausência de dados sensíveis, incremento/leitura da métrica e cenários
   relevantes de sucesso e erro. Mantenha os testes determinísticos; não chame
   IBGE ou Open-Meteo durante a suíte.
5. Documente o comportamento que realmente ficou implementado, como consultar
   a métrica, a fórmula do indicador, janela, meta, limitações, exposição e
   comandos de validação. Use a documentação existente e crie o menor artefato
   adicional necessário.
6. Atualize `.spec/tarefas/005-observabilidade.md` apenas com fatos verificados:
   responsável, decisões, checklist e histórico datado. Marque `[x]` somente
   quando houver evidência. Se não houver evidência de alinhamento de toda a
   equipe ou de medição real ao longo da janela, não declare esses itens como
   concluídos; descreva a pendência com precisão.
7. Registre o uso material de IA em `docs/ia.md` e mantenha `CONTRIBUTORS.md`
   coerente com as contribuições efetivamente realizadas, seguindo a convenção
   atual do repositório.

## Validação e entrega

Execute as verificações disponíveis e pertinentes, normalmente lint, testes
Jest/Supertest e configuração/build do Compose se a solução alterar Compose.
Registre comandos e resultados reais. Diferencie testes com mocks de consultas
reais a provedores; este prompt não autoriza chamadas reais. Não confunda
inicialização, endpoint de métricas acessível ou teste mockado com SLO observado
em produção.

Revise o diff completo para garantir que o escopo permaneceu em observabilidade,
que dados sensíveis não são emitidos e que não foram apagadas alterações
anteriores. Finalize com resumo das decisões autônomas, arquivos alterados,
dependências adicionadas (se houver), verificações executadas, resultados,
itens do aceite concluídos e limitações/pendências. Não faça commit, push,
merge ou deploy.
