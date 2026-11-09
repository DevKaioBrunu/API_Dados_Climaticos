# 001 — Execução com Docker Compose

**Estado:** frontend e API servidos pelo Compose e validados por requisições HTTP locais; teste manual dos botões no navegador segue disponível para Daniel.  
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

## Critérios de aceite

- Compose inicia a aplicação com um único comando documentado.
- Frontend responde em `http://localhost:8080` e encaminha chamadas `/api/` à API.
- API responde também diretamente em `http://localhost:3000`.
- O cliente JavaScript usa a origem atual por padrão; os endpoints do frontend alcançam a API pelo proxy.
- Arquivos de referência, testes e segredos locais desnecessários não entram na imagem.
- Documentação registra pré-requisitos, comando, porta e limites da validação.

## Validação anterior da API

Verificações: `docker version` confirmou Client e Server disponíveis; `docker compose config` validou o serviço `api`, build `.` e publicação `3000:3000`; `docker compose build --progress plain` construiu a imagem; `docker compose up --build --detach` construiu/iniciou o serviço em um comando; `GET http://localhost:3000/api/v1/health` respondeu HTTP 200 com `status: healthy`; `docker compose down` removeu o container e a rede temporários. A tentativa de abrir o comando em primeiro plano com PTY não pôde iniciar por erro de acesso ao criar o processo de terminal nesta sessão; a validação de execução foi feita com `--detach`. O build reportou 4 vulnerabilidades nas dependências instaladas (1 moderada, 2 altas e 1 crítica); nenhuma dependência foi alterada. Não foram executados testes automatizados nem validado o fluxo real de previsão Open-Meteo.

## Validação da extensão com frontend

Em 09/11/2026: `docker compose config` passou para os serviços `api` e `frontend`; `docker compose build --progress plain` construiu ambas as imagens; `docker compose up --build --detach` iniciou os dois serviços. `GET /` em `http://localhost:8080/` respondeu HTTP 200 com o HTML esperado; `GET /js/api.js` respondeu HTTP 200 e contém o fallback para `window.location.origin`. Pelo proxy do Nginx, health respondeu `healthy`, cidades por UF retornou HTTP 200 com uma cidade e clima para Fortaleza retornou HTTP 200 (`Nublado`). Essas chamadas usaram os provedores reais, sem mocks. A API continua acessível diretamente em `http://localhost:3000`. Os containers foram deixados ativos para Daniel abrir e testar a interface no navegador. Não foi possível automatizar clique nos botões porque o serviço de navegador desta sessão estava indisponível. Testes automatizados não foram executados.

## Riscos e decisões pendentes

- A porta está fixa em `3000` no código; a imagem e o Compose usam essa porta sem alterar o código da aplicação.
- O `.gitignore` existente foi preservado. O `.dockerignore` exclui explicitamente `x/`, dependências locais, arquivos de teste e artefatos fora do runtime.
- A implementação foi autorizada por Daniel nesta conversa.
