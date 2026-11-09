# 001 — Execução com Docker Compose

**Estado:** configuração Docker implementada; build e chamadas HTTP locais validados; teste manual dos botões no navegador continua pendente.
**Responsável informado:** Daniel.  
**Requisito:** B-TEC-01.  
**Dependências:** comportamento de inicialização e arquivos necessários ao runtime inspecionados; foi mantida a porta fixa `3000` existente.

## Objetivo

Permitir subir a aplicação (frontend e API) com um único comando via Docker Compose e documentar o uso observado.

## Escopo previsto

- Inspecionar `package.json`, entrada do servidor, configuração de porta e arquivos necessários à instalação/execução.
- Servir os arquivos estáticos do frontend com Nginx e encaminhar `/api/` ao serviço da API dentro da rede Compose.
- Criar Dockerfiles, Compose e `.dockerignore` mínimos, preservando a API acessível diretamente.
- Fazer a interface usar a origem atual como base da API por padrão, mantendo alternativa para execução local via `file://`.
- Atualizar instruções de execução para refletir o comportamento realmente validado.
- Verificar build, inicialização e resposta da API no container, distinguindo isso de integração real com provedores.

## Fora do escopo

- Alterar lógica de clima, geografia ou health sem necessidade demonstrada e alinhamento com o responsável.
- Acrescentar banco de dados, ambientes ou ferramentas não exigidos.
- Declarar fluxo externo ponta a ponta validado apenas porque o container iniciou.

## Arquivos previstos

Arquivos criados/alterados nesta etapa: `Dockerfile`, `docker-compose.yml`, `.dockerignore`, `frontend/Dockerfile`, `frontend/nginx.conf`, `frontend/index.html`, `frontend/js/api.js`, `frontend/js/app.js`, `docs/execucao-docker.md` e README. Nenhuma dependência npm foi adicionada.

## Checklist de aceite

- [x] Compose constrói e inicia os dois serviços com um comando (`docker compose up --build --detach`).
- [x] Frontend e assets respondem em `http://localhost:8080`; `/api/` chega à API pelo proxy Nginx.
- [x] API responde diretamente em `http://localhost:3000`.
- [x] O cliente JavaScript usa a origem atual por padrão e mantém fallback local para `file://`; o código foi inspecionado e o endpoint via proxy respondeu.
- [x] Imagens excluem referências e testes; a API instala somente dependências de produção.
- [x] Documentação registra pré-requisitos, comandos, portas e limites da validação.
- [ ] Daniel clica nos botões Health, Cidades e Clima no navegador servido em `http://localhost:8080` e confirma a interface interativa. O host de navegador desta sessão não permitiu automatizar esse passo.

## Validação anterior da API

Verificações: `docker version` confirmou Client e Server disponíveis; `docker compose config` validou o serviço `api`, build `.` e publicação `3000:3000`; `docker compose build --progress plain` construiu a imagem; `docker compose up --build --detach` construiu/iniciou o serviço em um comando; `GET http://localhost:3000/api/v1/health` respondeu HTTP 200 com `status: healthy`; `docker compose down` removeu o container e a rede temporários. A tentativa de abrir o comando em primeiro plano com PTY não pôde iniciar por erro de acesso ao criar o processo de terminal nesta sessão; a validação de execução foi feita com `--detach`. O build reportou 4 vulnerabilidades nas dependências instaladas (1 moderada, 2 altas e 1 crítica); nenhuma dependência foi alterada. Não foram executados testes automatizados nem validado o fluxo real de previsão Open-Meteo.

## Validação da extensão com frontend

Em 09/11/2026: `docker compose config` passou para os serviços `api` e `frontend`; `docker compose build --progress plain` construiu ambas as imagens; `docker compose up --build --detach` iniciou os dois serviços. `GET /` em `http://localhost:8080/` respondeu HTTP 200 com o HTML esperado; `GET /js/api.js` respondeu HTTP 200 e contém o fallback para `window.location.origin`. Pelo proxy do Nginx, health respondeu `healthy`, cidades por UF retornou HTTP 200 com uma cidade e clima para Fortaleza retornou HTTP 200 (`Nublado`). Essas chamadas usaram os provedores reais, sem mocks. A API continua acessível diretamente em `http://localhost:3000`. Os containers foram deixados ativos para Daniel abrir e testar a interface no navegador. Não foi possível automatizar clique nos botões porque o serviço de navegador desta sessão estava indisponível. Testes automatizados não foram executados.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-09 | Codex, sob orientação e autorização de Daniel | Implementada a configuração Compose da API; depois, o escopo foi ampliado para servir o frontend em Nginx e encaminhar `/api/` à API. Commit de implementação: `3c0145d`. | `docker compose config` e builds passaram; HTML/CSS/JS, health, cidades e clima responderam por HTTP; clima usou IBGE e Open-Meteo reais. A execução automatizada de cliques no navegador não foi possível. |
| 2026-11-09 | Daniel | Executou `docker compose down` após a conferência e consultou containers/imagens locais. | Containers e rede foram removidos; as imagens permaneceram instaladas. |

## Riscos e decisões pendentes

- A porta está fixa em `3000` no código; a imagem e o Compose usam essa porta sem alterar o código da aplicação.
- O `.gitignore` existente foi preservado. O `.dockerignore` exclui explicitamente `x/`, dependências locais, arquivos de teste e artefatos fora do runtime.
- A implementação foi autorizada por Daniel nesta conversa.
