# CONTRIBUTORS — Autoria, responsabilidades e contribuições

## FullCycle - Engenharia de Software - 4.0
### Projeto Final - Turma Online

**Projeto:** API Dados Climáticos  
**Nível:** Projeto B — API de domínio único  
**Equipe:** Marcos Daniel Gomes Dantas e Kaio Bruno Soares dos Santos  

## Índice

1. [Contexto e origem do projeto](#contexto-e-origem-do-projeto)
2. [Equipe e responsabilidades](#equipe-e-responsabilidades)
3. [Contribuições de Daniel](#contribuições-de-daniel)
4. [Contribuições de Kaio Bruno](#contribuições-de-kaio-bruno)
5. [Requisitos adicionais da entrega FullCycle](#requisitos-adicionais-da-entrega-fullcycle)
6. [Colaboração e evidências](#colaboração-e-evidências)
7. [Uso de inteligência artificial](#uso-de-inteligência-artificial)

## Contexto e origem do projeto

A API Dados Climáticos foi desenvolvida a partir do reaproveitamento
de um trabalho acadêmico de faculdade do qual Daniel e Kaio Bruno
participaram.

A base reúne consultas geográficas e climáticas de cidades brasileiras,
integrações com serviços externos e uma interface para utilização da API.

Para o Projeto Final do curso FullCycle - Engenharia de Software - 4.0,
a dupla assumiu a consolidação dessa base e sua adequação aos requisitos
de qualidade, execução, operação e documentação solicitados pelo professor.

O trabalho desta entrega não consiste em apresentar todo o código como
uma implementação nova. Consiste em integrar os componentes existentes,
compreender seu funcionamento, identificar lacunas e acrescentar as
evidências de engenharia exigidas para o Projeto B.

O reaproveitamento preserva os créditos dos demais colaboradores
que participaram da base acadêmica original.

## Equipe e responsabilidades

| Participante | GitHub | Responsabilidade principal |
|---|---|---|
| Marcos Daniel Gomes Dantas | mdanieldantas | Consulta geográfica, comunicação com provedores e preparação da execução com Docker |
| Kaio Bruno Soares dos Santos | DevKaioBrunu | Consulta climática, inicialização da API e integração dos componentes da aplicação |

As responsabilidades funcionais incluem manutenção, compreensão
e evolução das respectivas áreas. Não representam autoria exclusiva
de todos os arquivos reaproveitados.

A dupla também participa da organização das tarefas, da documentação
e da verificação dos requisitos da entrega.

## Contribuições de Daniel

### Integração da área geográfica

Daniel realizou a inclusão dos componentes geográficos da base
acadêmica no projeto de entrega, abrangendo:

- Cliente HTTP compartilhado, com suporte a novas tentativas.
- Serviços de consulta de municípios e coordenadas.
- Rota de consulta de cidades por UF.
- Arquivos de testes relacionados à consulta de cidades.
- Estrutura HTML e estilos da interface existente.

Essa contribuição estabeleceu a presença da área geográfica
no repositório de entrega e sua articulação com os demais componentes
da API.

### Organização e acompanhamento da entrega

Daniel participou da organização do trabalho, levantando dúvidas
sobre os requisitos e utilizando apoio de tutoria para estruturar
a divisão das atividades e a documentação.

Também relatou a inicialização local da aplicação após sincronizar
as alterações da equipe. Essa verificação não equivale, por si só,
à aprovação de todos os testes ou integrações.

### Frente de trabalho assumida

Daniel assumiu a preparação da execução com Docker, incluindo:

- Dockerfile.
- Docker Compose.
- .dockerignore.
- Documentação da execução.
- Verificação do funcionamento da API no container.

Status dessa frente: implementada, com evidências históricas da tarefa 001
e revalidação na tarefa 008. A configuração atual inclui também o coletor
adicionado por Daniel na tarefa 005; o fechamento de Kaio confirmou a coleta.

## Contribuições de Kaio Bruno

### Refatoração semântica do frontend

Em 11/11/2026, Kaio solicitou o início da refatoração da interface e
autorizou a Task 02 com assistência de OpenAI Codex. Foi reorganizado o
HTML existente com regiões semânticas, orientações para os campos e
anúncio de atualizações, preservando os identificadores usados pelo
JavaScript da base. O lint passou e as ações foram verificadas em uma
simulação de DOM e fetch. Naquele momento, verificações em navegador e as
etapas de estilos e interações ainda estavam pendentes. A validação posterior
do conjunto está registrada abaixo e na tarefa 007. O HTML e os estilos da
base são contribuições anteriormente registradas para Daniel.

Na continuidade, Kaio autorizou a Task 03, com assistência de Codex. A
folha de estilos foi refatorada com a paleta proposta, layout responsivo,
foco e suporte a movimento reduzido. Lint e verificações estáticas passaram;
naquela etapa, a avaliação no navegador e a combobox permaneciam pendentes;
as verificações posteriores constam no registro da Task 05.

Após autorização de Kaio para a Task 04 e conclusão da estrutura da Task 03,
Codex implementou a seleção de UF e município com consulta ao IBGE, resultados
formatados e JSON, tratamento de erros e verificação de UF divergente. Lint e
39 testes do backend passaram; a interação foi verificada inicialmente com
DOM simulado. Na Task 05, o fluxo foi exercitado em Chrome headless e a
consulta de clima respondeu através do proxy com provedores reais.

Kaio também solicitou uniformizar o seletor de UF com a lista de municípios;
com assistência de Codex, o controle passou a permitir pesquisa e navegação
por teclado. O lint passou e os fluxos foram verificados com DOM simulado.

Kaio solicitou ainda a alternância entre modo claro e escuro, implementada
com assistência de Codex e preferência local no navegador. A lógica foi
verificada em simulação; verificação visual específica dos dois temas e
avaliação completa de acessibilidade estavam pendentes nessa etapa. Depois,
os dois temas foram inspecionados no Chrome; a avaliação completa continua pendente.

Em revisão posterior solicitada por Kaio, Codex colocou o controle de tema
com ícones de sol e lua no topo direito e apresentou mínima e máxima em pares
rotulados, removendo a barra literal. Lint e verificações estruturais passaram;
o encaixe foi conferido posteriormente no Chrome na versão restaurada do cabeçalho.

Kaio enviou uma captura apontando o desnível no cabeçalho; Codex ajustou o
alinhamento do título com o cartão de status. A captura confirma o problema
anterior, não a renderização após o ajuste.

Na orientação seguinte de Kaio, Codex alinhou o cartão de status com o painel
de resultados e moveu o controle de tema para a mesma linha, à direita. Lint
e inspeção estrutural passaram; naquela etapa, a nova disposição não foi
conferida visualmente no navegador.

Kaio não aprovou essa última disposição; Codex a reverteu e restaurou o
cabeçalho da versão imediatamente anterior. Os ícones do tema e os pares de
temperatura permaneceram como estavam.
O serviço frontend local em 8080 foi reconstruído com essa versão restaurada;
HTML e CSS servidos coincidiram com os arquivos locais.

Na Task 05, anterior às alterações de tema e cabeçalho, Kaio autorizou que Codex verificasse lint, testes, cobertura,
build e fluxos no Chrome headless, com consultas reais aos provedores. Durante
a validação, foi corrigido o retorno de foco após uma requisição. A suíte
passou com 39 testes e 90,85% de declarações da API; avaliações completas de
acessibilidade e CLS seguem pendentes. Detalhes estão na tarefa 007.

Após a implementação do tema, Kaio solicitou recriar o serviço frontend em
Compose. `docker compose up --detach --build --no-deps frontend` concluiu e
`localhost:8080` passou a servir a versão daquele momento com o controle de tema. Essa
recriação foi confirmada por resposta HTTP e comparação do HTML servido; a
interação visual com o tema não foi repetida nesse passo. As validações e
limitações completas estão em `.spec/tarefas/007-refatoracao-frontend.md`.

### Integração da área climática

Kaio realizou a inclusão e consolidação dos componentes climáticos
da base acadêmica no projeto de entrega, abrangendo:

- Rota de consulta climática.
- Serviço de comunicação com o provedor meteorológico.
- Testes relacionados ao clima e ao health.
- Scripts JavaScript da interface.
- Coleção de requisições para uso no Postman.

### Inicialização e integração da aplicação

Kaio participou da preparação da estrutura executável do projeto,
incluindo:

- Configuração inicial do projeto e das dependências.
- Servidor Express e endpoint de health.
- Ajustes dos caminhos para a estrutura backend/src.
- Correção de referências ao código antigo.
- Atualização do README para refletir a organização da aplicação.

Essas alterações contribuíram para reunir as áreas geográfica
e climática em uma base de execução comum.

### Levantamento de pontos de atenção

Kaio compartilhou uma análise assistida por IA sobre a relação
entre implementação, documentação e testes.

O levantamento indicou pontos para investigação, como validação
de parâmetros, geocodificação, tratamento de falhas e cobertura
de cenários de teste.

Os apontamentos devem ser confirmados antes de serem registrados
como defeitos corrigidos ou melhorias concluídas.

### Lint, cobertura e configuração de CI — tarefa 004

Em 10/11/2026, Kaio aprovou o prompt da tarefa 004 e autorizou sua
implementação com assistência de OpenAI Codex. Foram acrescentados ESLint 10,
um mínimo global de 80% de declarações no Jest, o workflow GitHub Actions e
instruções de execução. A base existente recebeu apenas dois ajustes para
lint: remoção de parâmetro não usado no health e anotação do global
`ApiClient` no frontend.

Instalação pelo lockfile e lint passaram. A suíte com provedores simulados
passou com 6 suítes, 39 testes e 90,85% de declarações. Uma execução restrita
aos testes unitários climáticos comprovou a reprovação abaixo do mínimo:
4 testes passaram, mas a cobertura global de 14,02% resultou em código 1.
Posteriormente, Kaio apresentou captura da execução verde CI #1 no commit
`c97ed29` da branch `DEV`. Não houve commit, push ou merge na etapa de implementação. Decisões, comandos
e limitações estão na tarefa 004 e em `docs/ia.md`.

### Preparação do fechamento e da apresentação

Em 12/11/2026, Kaio solicitou um prompt para orientar o fechamento técnico,
a consolidação documental e o estudo e gravação com Daniel. Com assistência
de OpenAI Codex, foi preparado
`prompts/fechamento-projeto-b-apresentacao.md`, seguindo as instruções de
`Agente.md`, localizado em `X/Agente.md`, e o fluxo do repositório.
O prompt foi indexado e seu uso registrado em `docs/ia.md`.

Na criação do prompt, a contribuição era somente preparação documental.
Implementação, novas validações, materiais finais, ensaio e vídeo ainda
não tinham ocorrido naquele momento.

Após essa preparação, Kaio autorizou executar o fechamento. Com assistência
de Codex, foram criados `.env.example`, análise de design, verificação final,
guia de estudo, roteiro e checklist; corrigido o caminho da coleção Postman
no verificador manual e atualizados os registros. O código dos provedores,
frontend, Compose e contratos permaneceu inalterado. SOLID e Adapter foram
documentados a partir dos componentes já existentes, preservando a autoria.

No fechamento, lint e 42 testes passaram com 89,47% de declarações; o fluxo
real passou no Chrome e no verificador de rotas, e a coleta Prometheus foi
confirmada. Gitleaks examinou o histórico disponível sem achados; alcance e
resultado do conteúdo atual estão na tarefa 008 e em `docs/verificacao-final.md`.
Os arquivos do fechamento ainda não têm commit próprio. Ensaio, gravação e
entrega oficial permanecem pendentes.

## Requisitos adicionais da entrega FullCycle

A adequação ao Projeto B acrescenta à base acadêmica os requisitos
abaixo. Os itens são marcados somente após sua conclusão e verificação.

### Execução e design

- [x] Execução com Docker Compose por um único comando; validada em registros anteriores e confirmada por Daniel em navegador local.
- [x] Fluxo principal funcionando de ponta a ponta; k6 consultou clima com provedores reais e Daniel informou teste da interface local.
- [x] Aplicação de SOLID demonstrada nos pontos existentes, com limites explícitos em `docs/design.md`; não se afirma aplicação integral dos cinco princípios.
- [x] Adapter funcional nas integrações identificado e justificado em `docs/design.md`.

### Testes e automação

- [x] Testes unitários do domínio (`weather`, `ibge` e rotas); suíte executada na tarefa 006.
- [x] Pelo menos um teste de integração interna (`clima.integration.test.js`, com provedores simulados).
- [x] Cobertura mínima declarada e respeitada (80% global de declarações; 89,47% e 42 testes no fechamento; 90,85% era a medição da tarefa 004).
- [x] Lint configurado e executado (tarefa 004).
- [x] CI verde com instalação, lint e testes: CI #5 confirmado para `d6ae88d`; CI das alterações locais do fechamento depende de envio autorizado.

Os testes da base foram reaproveitados e ampliados nas tarefas registradas.
Jest e Supertest foram preservados; os resultados atuais estão na tarefa 008.

### Configuração e operação

- [ ] .env.example incluído no commit da entrega; arquivo preparado e carregamento conferido no workspace, aguardando integração autorizada.
- [x] Verificação de segredos realizada no alcance documentado, sem achados no histórico disponível; conteúdo atual e limitações registrados na tarefa 008. Não representa garantia universal.
- [x] Logs estruturados em JSON com Pino, documentados em `docs/observabilidade.md`.
- [x] Métrica Prometheus `api_http_requests_total` implementada, documentada e coletada em Compose, com alvo UP e incremento na tarefa 008.
- [x] SLO simples documentado em `docs/observabilidade.md`; a declaração não comprova que a meta foi atingida.

### Documentação e desempenho

- [x] README com nível B, instruções de execução e testes; inclui comando do smoke test k6.
- [x] Um ADR registrando a decisão de observabilidade tomada na tarefa 005.
- [x] OpenAPI do endpoint principal (`GET /api/v1/clima/{nome_cidade}`).
- [x] Um smoke test k6 executado com uma VU e dez iterações.
- [x] p95 de 1,47 s medido e registrado em `docs/desempenho.md`, com ambiente, carga e limitações.
- [x] `CONTRIBUTORS.md` atualizado com a contribuição da tarefa 006; commit de implementação identificado como `62c62e3`.
- [x] Prompt, decisões e uso de IA da tarefa 006 registrados em `docs/ia.md`.

A existência desta lista não significa que os requisitos
já foram implementados. O estado final deve corresponder
aos arquivos, às execuções e às evidências da entrega.

## Colaboração e evidências

A organização do trabalho mantém duas áreas funcionais principais:

- Daniel: geografia e comunicação com provedores.
- Kaio Bruno: clima e inicialização da aplicação.

As atividades transversais são distribuídas entre os participantes,
evitando alterações simultâneas nos mesmos arquivos.

As evidências devem relacionar contribuição, autoria e resultado:

| Participante | Contribuição | PR ou commit | Validação |
|---|---|---|---|
| Daniel | Integração da área geográfica e rotas de cidades | `53589ac`, `2de27d7` | Serviços IBGE/Open-Meteo e rota de cidades registrados no histórico; testes geográficos ampliados em `dc6b487`. |
| Daniel | Inclusão de HTML e CSS da interface | `d640e37` | Commit identificado no histórico local do Git. |
| Kaio Bruno | Integração da área climática | `e15e107` | Serviço e consulta climática registrados no histórico local do Git. |
| Kaio Bruno | Ajustes de caminhos e documentação | `3fe86da` | Correção de referências ao código legado registrada no histórico local do Git. |
| Daniel | Execução com Docker | `9e188c3`, `3c0145d` | Build e execução Compose descritos em `docs/execucao-docker.md`; Daniel também informou validação posterior da interface no navegador em `http://localhost:8080/`. |
| Daniel, com assistência de Codex | Testes unitários do serviço geográfico e testes da rota de cidades (tarefa 002) | `dc6b487` | `npm.cmd test -- --runInBand`: 7 suítes e 46 testes passaram; integrações HTTP externas foram mockadas. |
| Kaio Bruno, com assistência de Codex | Lint, mínimo de cobertura e configuração de CI (tarefa 004) | `c97ed29` | Instalação e lint passaram; 6 suítes/39 testes com mocks e 90,85% de declarações. Reprovação por cobertura insuficiente verificada. Kaio apresentou captura do CI #1 verde para esse commit. |
| Daniel, com assistência de Codex | Observabilidade (tarefa 005): responsável escolhido pela equipe; solicitou comparação de opções simples e seguras e autorizou implementar a recomendação assistida por IA | `c825695` | Lint passou; 7 suítes/42 testes com mocks passaram e cobertura global de statements foi 89,47%. YAML validado localmente. Naquela validação, Compose/Prometheus em execução não foram verificados; sem chamadas reais a provedores. |
| Daniel, com assistência de Codex | Documentação, ADR, OpenAPI, smoke test e medição de desempenho (tarefa 006); Daniel confirmou responsabilidade e autorizou o Codex a decidir a solução | `62c62e3` | `npm run lint` passou; 7 suítes/42 testes com mocks e 89,47% de statements; OpenAPI YAML válido; imagem e serviço API construídos pelo Compose; k6 v2.4.0: 10 requisições reais, 10 HTTP 200, 20/20 checks e p95 de 1,47 s. Daniel também informou que abriu a interface em `http://localhost:8080/`, iniciou a API com `npm run dev`/nodemon e usou Live Server; estes são testes relatados por Daniel. A amostra k6 usa IBGE/Open-Meteo e não representa desempenho contínuo. |

Revisões, correções e novas entregas serão acrescentadas conforme
forem realizadas. Planejamento não será registrado como implementação,
e presença de testes não será registrada como aprovação dos testes.

## Uso de inteligência artificial

O Perplexity foi utilizado como tutor de Engenharia de Software
e assistente de planejamento e redação técnica.

O apoio incluiu:

- Interpretação dos requisitos da entrega.
- Sugestões para divisão das atividades.
- Explicações sobre Node.js, Git e Docker.
- Apoio ao diagnóstico de erros de execução.
- Sugestões de comandos e ajustes de configuração.
- Rascunhos de documentação, checklists e descrições de PR.

O protagonismo da equipe está na compreensão do projeto,
na execução do trabalho, na avaliação das sugestões e na verificação
dos resultados. O uso de IA não substitui essas responsabilidades.

Sugestões geradas por IA não são tratadas como comprovação
de funcionamento, aprovação de testes ou conclusão de requisitos.

Os prompts relevantes, as sugestões aproveitadas ou rejeitadas
e as verificações realizadas serão detalhados em docs/ia.md.
Outras ferramentas utilizadas devem ser acrescentadas a esse registro.

### Uso de Codex e fluxo orientado por especificações

Em 09/11/2026, Daniel utilizou o OpenAI Codex nesta IDE para continuar o
trabalho a partir do workspace: primeiro solicitou inventário e plano sem
edições; depois autorizou a organização da documentação de apoio, indicando
`docs/requisitos-projeto-b.md` como fonte local dos requisitos e pedindo que
este registro de contribuições permanecesse em `x/` por enquanto.

Nesta etapa, o Codex leu instruções, handoff, requisitos, configuração,
implementação, testes e documentos existentes. Após a autorização, preparou
especificações em `.spec/`, modelos em `prompts/`, procedimentos em
`.agents/skills/` e atualizou `docs/ia.md` e este registro. O fluxo proposto
é orientado por especificações: inspecionar, separar fatos de hipóteses,
planejar, obter autorização quando necessário, implementar em escopo limitado,
validar e registrar evidências. Esses arquivos são convenções locais; o
carregamento automático de skills pela IDE não foi confirmado.

O Perplexity permanece registrado como apoio anterior de tutoria,
interpretação de requisitos, planejamento, diagnóstico e rascunhos. Não há
transcrições completas de prompts anteriores nem evidência de que todas as
sugestões tenham sido adotadas. O registro detalhado desta etapa está em
`docs/ia.md`.

Esta contribuição foi de organização e documentação. Não houve alteração
do comportamento da API, implementação Docker ou execução de testes naquela
etapa. A cópia em `x/` é mantida como registro local por decisão de Daniel;
`CONTRIBUTORS.md` na raiz é o artefato destinado à entrega do Projeto B.

### Configuração Docker preparada

Após autorização de Daniel, em 09/11/2026, Codex criou a configuração inicial
de Docker Compose da API (`Dockerfile`, `docker-compose.yml` e `.dockerignore`)
e documentou o procedimento em `docs/execucao-docker.md`, com uma referência
no README. O escopo usa a porta fixa 3000 da aplicação e instala somente
dependências de produção na imagem.

A configuração foi validada em 09/11/2026: `docker compose config` passou,
o build foi concluído, `docker compose up --build --detach` iniciou o serviço,
e uma chamada local a `/api/v1/health` respondeu HTTP 200 com `healthy`.
`docker compose down` encerrou e removeu o container e a rede temporários.
O comando interativo com PTY não iniciou por erro de acesso ao criar o
terminal nesta sessão; a variante destacada confirmou build e inicialização.

Durante a instalação de produção, o npm reportou quatro vulnerabilidades
(uma moderada, duas altas e uma crítica); não houve atualização de dependências
nesta tarefa. Não foram executados testes automatizados nem validado o fluxo
climático com a Open-Meteo. A rota health consultou o IBGE com resultado
saudável apenas para aquela requisição.

### Frontend no Docker Compose

Após novo pedido e autorização de Daniel, a tarefa Docker foi ampliada para
servir também a interface existente. Foi criado `frontend/Dockerfile` com
Nginx e `frontend/nginx.conf`, que entrega os arquivos estáticos e encaminha
`/api/` ao serviço `api` na rede Compose. O Compose publica a interface em
`8080` e mantém a API em `3000`. O cliente frontend usa a origem da página
como base padrão e mantém `http://localhost:3000` como fallback ao abrir o
HTML diretamente via `file://`.

Em 09/11/2026, as duas imagens foram construídas e os serviços iniciados.
Página, CSS e JS responderam HTTP 200; health, cidades por UF e clima de Fortaleza
foram consultados através do proxy Nginx com respostas válidas, usando os
provedores reais IBGE e Open-Meteo. Os containers foram deixados rodando para
Daniel testar a interface; depois Daniel executou `docker compose down` e
confirmou a remoção dos containers e da rede. Não foi possível automatizar cliques no navegador
porque o host de navegador desta sessão estava indisponível. Testes
automatizados não foram executados. O alerta de quatro vulnerabilidades do
npm permanece sem alteração nesta tarefa.

### Guia de uso de IA e acompanhamento spec-driven

Em 09/11/2026, a pedido de Daniel, Codex preparou `docs/guia-uso-de-ia.md`
com o fluxo de uso de IA, responsabilidades humanas e funções de AGENTS.md,
specs, skills, prompts e registros. Também foi definido em `.spec/README.md`
um padrão comum de checklist de aceite e histórico cronológico datado.

A tarefa 001 recebeu checklist e histórico com as implementações e verificações
que já tinham evidência; o clique manual nos botões permanece desmarcado. As
tarefas 002 a 006 receberam checklists e histórico de planejamento, sem marcar
implementação como concluída. README e AGENTS.md apontam para o guia. Esta foi
uma atualização de documentação; não alterou o código da aplicação nem executou
testes. O arquivo permanece em `x/` e é ignorado pelo Git, por decisão de Daniel.

### Prompt de implementação para testes geográficos

Em 09/11/2026, a pedido de Daniel, Codex preparou
`prompts/implementacao-testes-geografia.md` para orientar a futura execução da
tarefa 002. O prompt registra o escopo geográfico de Daniel, testes automatizados
determinísticos com mocks e a independência em relação à tarefa transversal 004.
Também exige distinguir testes da aplicação com provedores mockados de consultas
reais ao IBGE. A criação do prompt não implementou nem validou testes; a tarefa
002 continua sujeita à execução e às evidências registradas em sua especificação.
