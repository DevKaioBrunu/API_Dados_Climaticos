# 001 — Execução com Docker Compose

**Estado:** implementação e validação local do container concluídas; fluxo climático completo e testes automatizados não foram validados nesta tarefa.  
**Responsável informado:** Daniel.  
**Requisito:** B-TEC-01.  
**Dependências:** comportamento de inicialização e arquivos necessários ao runtime inspecionados; foi mantida a porta fixa `3000` existente.

## Objetivo

Permitir subir a API com um único comando via Docker Compose e documentar o uso observado.

## Escopo previsto

- Inspecionar `package.json`, entrada do servidor, configuração de porta e arquivos necessários à instalação/execução.
- Propor e, após autorização específica, criar Dockerfile, Compose e `.dockerignore` mínimos.
- Atualizar instruções de execução para refletir o comportamento realmente validado.
- Verificar build, inicialização e resposta da API no container, distinguindo isso de integração real com provedores.

## Fora do escopo

- Alterar lógica de clima, geografia ou health sem necessidade demonstrada e alinhamento com o responsável.
- Acrescentar banco de dados, ambientes ou ferramentas não exigidos.
- Declarar fluxo externo ponta a ponta validado apenas porque o container iniciou.

## Arquivos previstos

Criados nesta etapa: `Dockerfile`, `docker-compose.yml`, `.dockerignore` e `docs/execucao-docker.md`; o README recebeu instruções de Compose. Não houve alteração da configuração da aplicação nem adição de dependências.

## Critérios de aceite

- Compose inicia a aplicação com um único comando documentado.
- A API responde no container em verificação local reproduzível.
- Arquivos de referência, testes e segredos locais desnecessários não entram na imagem.
- Documentação registra pré-requisitos, comando, porta e limites da validação.

## Validação

Verificações: `docker version` confirmou Client e Server disponíveis; `docker compose config` validou o serviço `api`, build `.` e publicação `3000:3000`; `docker compose build --progress plain` construiu a imagem; `docker compose up --build --detach` construiu/iniciou o serviço em um comando; `GET http://localhost:3000/api/v1/health` respondeu HTTP 200 com `status: healthy`; `docker compose down` removeu o container e a rede temporários. A tentativa de abrir o comando em primeiro plano com PTY não pôde iniciar por erro de acesso ao criar o processo de terminal nesta sessão; a validação de execução foi feita com `--detach`. O build reportou 4 vulnerabilidades nas dependências instaladas (1 moderada, 2 altas e 1 crítica); nenhuma dependência foi alterada. Não foram executados testes automatizados nem validado o fluxo real de previsão Open-Meteo.

## Riscos e decisões pendentes

- A porta está fixa em `3000` no código; a imagem e o Compose usam essa porta sem alterar o código da aplicação.
- O `.gitignore` existente foi preservado. O `.dockerignore` exclui explicitamente `x/`, dependências locais, arquivos de teste e artefatos fora do runtime.
- A implementação foi autorizada por Daniel nesta conversa.
