# Execução com Docker Compose

## Pré-requisitos

- Docker instalado e em execução, com o comando `docker compose` disponível.
- Acesso à internet para baixar a imagem base e instalar dependências durante o primeiro build. As consultas de clima e cidades também dependem dos serviços externos descritos no README.

## Subir a API

Na raiz do repositório, execute:

```bash
docker compose up --build
```

O Compose constrói a imagem e inicia a API. A aplicação fica disponível em `http://localhost:3000`.

Para encerrar, use `Ctrl+C`. Para remover o container criado pelo Compose:

```bash
docker compose down
```

## Verificar a resposta HTTP

Com o serviço em execução, abra `http://localhost:3000/api/v1/health` no navegador ou consulte esse endereço com um cliente HTTP. A rota responde HTTP 200 e informa `healthy` ou `degraded` conforme a consulta ao IBGE. Portanto, essa resposta confirma que a rota respondeu, mas o estado `degraded` indica que o serviço externo não estava disponível.

Uma resposta da rota health não comprova o fluxo completo de consulta climática. Esse fluxo também depende da geocodificação da Open-Meteo e do serviço de previsão da Open-Meteo.

## Conteúdo da imagem

A imagem usa as dependências de produção do lockfile e copia o código de `backend/src/`. Testes, frontend, documentação e material em `x/` ficam fora da imagem. Nenhum segredo ou arquivo `.env` é necessário para iniciar a API com a configuração atual.

## Limites

A porta interna está fixa em `3000` no código e o Compose publica `3000:3000`. A imagem não define healthcheck Docker: o endpoint existente consulta o IBGE e sempre responde HTTP 200, então não representa de forma confiável a saúde do processo/container. O build e a resposta HTTP também não equivalem à validação ponta a ponta dos provedores.

## Estado da validação neste workspace

Em 09/11/2026, `docker compose config` validou a configuração. `docker compose build --progress plain` construiu a imagem e `docker compose up --build --detach` iniciou o serviço. Uma requisição local para `/api/v1/health` retornou HTTP 200 com `status: healthy`. Em seguida, `docker compose down` encerrou e removeu o container temporário e a rede criada pelo Compose.

A tentativa de executar o comando em primeiro plano com PTY não iniciou por uma restrição de criação de terminal nesta sessão. A variante destacada validou o build e a inicialização em um único comando; ela mantém o container em execução até `docker compose down`.

Durante `npm ci --omit=dev`, o npm reportou 4 vulnerabilidades nas dependências instaladas: 1 moderada, 2 altas e 1 crítica. Nenhuma dependência foi atualizada nesta tarefa. O endpoint de health confirmou a rota e obteve resposta saudável do IBGE nessa chamada; isso não valida o fluxo de previsão climática na Open-Meteo. Testes automatizados não foram executados.
