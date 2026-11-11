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

Status dessa frente: em preparação.
A conclusão será registrada após implementação e validação.

## Contribuições de Kaio Bruno

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
O workflow está preparado; a execução remota e seu link verde permanecem
pendentes. Não houve commit, push ou merge nesta etapa. Decisões, comandos
e limitações estão na tarefa 004 e em `docs/ia.md`.

## Requisitos adicionais da entrega FullCycle

A adequação ao Projeto B acrescenta à base acadêmica os requisitos
abaixo. Os itens são marcados somente após sua conclusão e verificação.

### Execução e design

- [ ] Execução com Docker Compose por um único comando.
- [ ] Fluxo principal funcionando de ponta a ponta.
- [ ] Aplicação de princípios SOLID, demonstrada no código.
- [ ] Um pattern aplicado e justificado.

### Testes e automação

- [ ] Testes unitários do domínio.
- [ ] Pelo menos um teste de integração.
- [x] Cobertura mínima declarada e respeitada (80% global de declarações; 90,85% medidos na tarefa 004).
- [x] Lint configurado e executado (tarefa 004).
- [ ] CI verde com instalação, lint e testes.

Os testes já existentes serão reaproveitados e avaliados quanto
à suficiência. Não é necessário substituir Jest por outra ferramenta
apenas para atender ao projeto.

### Configuração e operação

- [ ] .env.example versionado.
- [ ] Segredos fora do código e do histórico versionado.
- [ ] Logs estruturados.
- [ ] Pelo menos uma métrica.
- [ ] Um SLO simples declarado.

### Documentação e desempenho

- [ ] README com nível B, instruções de execução e testes.
- [ ] Um ADR registrando uma decisão técnica.
- [ ] OpenAPI do endpoint principal.
- [ ] Um smoke test com k6.
- [ ] p95 medido e registrado em docs/desempenho.md.
- [ ] CONTRIBUTORS.md atualizado com contribuições reais.
- [ ] Prompts relevantes e uso de IA registrados em docs/ia.md.

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
| Daniel | Integração da área geográfica | A preencher | Registrar verificações realizadas |
| Daniel | Inclusão de HTML e CSS da interface | A preencher | Registrar verificações realizadas |
| Kaio Bruno | Integração da área climática | A preencher | Registrar verificações realizadas |
| Kaio Bruno | Ajustes de caminhos e documentação | A preencher | Registrar verificações realizadas |
| Daniel | Execução com Docker | Pendente | Pendente |
| Daniel, com assistência de Codex | Testes unitários do serviço geográfico e testes da rota de cidades (tarefa 002) | Não criado | `npm.cmd test -- --runInBand`: 7 suítes e 46 testes passaram; integrações HTTP externas foram mockadas |
| Kaio Bruno, com assistência de Codex | Lint, mínimo de cobertura e configuração de CI (tarefa 004) | Não criado nesta etapa | Instalação e lint passaram; 6 suítes/39 testes com mocks e 90,85% de declarações. Reprovação por cobertura insuficiente verificada. CI remoto pendente |

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
