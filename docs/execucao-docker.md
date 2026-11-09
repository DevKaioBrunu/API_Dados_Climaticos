# Execução com Docker Compose

## Pré-requisitos

- Docker instalado e em execução, com o comando `docker compose` disponível.
- Acesso à internet para baixar a imagem base e instalar dependências durante o primeiro build. As consultas de clima e cidades também dependem dos serviços externos descritos no README.

## Subir a API

Na raiz do repositório, execute:

```bash
docker compose up --build
```

O Compose constrói e inicia dois serviços: a API e o Nginx que serve os arquivos estáticos do frontend. Abra a interface em `http://localhost:8080`. A API também permanece acessível diretamente em `http://localhost:3000`.

Para encerrar, use `Ctrl+C`. Para remover o container criado pelo Compose:

```bash
docker compose down
```

## Verificar a resposta HTTP

Com a interface aberta em `http://localhost:8080`, use o botão Health para chamar `/api/v1/health` pelo proxy do Nginx. Também é possível abrir `http://localhost:8080/api/v1/health` ou consultar diretamente `http://localhost:3000/api/v1/health`. A rota responde HTTP 200 e informa `healthy` ou `degraded` conforme a consulta ao IBGE. Portanto, essa resposta confirma que a rota respondeu, mas o estado `degraded` indica que o serviço externo não estava disponível.

Uma resposta da rota health não comprova o fluxo completo de consulta climática. Esse fluxo também depende da geocodificação da Open-Meteo e do serviço de previsão da Open-Meteo.

## Conteúdo da imagem

O serviço da API instala as dependências de produção do lockfile e copia o código de `backend/src/`. O serviço frontend usa Nginx para servir `index.html`, CSS e JavaScript; o proxy encaminha caminhos `/api/` para o serviço `api` na rede interna do Compose. Testes, documentação e material em `x/` ficam fora das imagens. Nenhum segredo ou arquivo `.env` é necessário para iniciar os serviços com a configuração atual.

## Limites

A porta da API está fixa em `3000` no código e o Compose publica `3000:3000`; o Nginx publica `8080:80`. A API não define healthcheck Docker: o endpoint existente consulta o IBGE e sempre responde HTTP 200, então não representa de forma confiável a saúde do processo/container. O build e a resposta HTTP também não equivalem à validação ponta a ponta dos provedores.

## Estado da validação neste workspace

Em 09/11/2026, `docker compose config` validou os serviços `api` e `frontend`; `docker compose build --progress plain` construiu as duas imagens; `docker compose up --build --detach` iniciou os containers. A página em `http://localhost:8080/`, o cliente JavaScript e a folha de estilos responderam HTTP 200. Pelo proxy Nginx, `/api/v1/health` respondeu `healthy`, `/api/v1/cidades/CE?limite=1` retornou HTTP 200 e `/api/v1/clima/Fortaleza` retornou HTTP 200 com condição `Nublado`. Essas chamadas foram feitas sem mocks e incluíram IBGE e Open-Meteo. A API também permanece exposta diretamente em `http://localhost:3000`.

Não foi possível automatizar interação visual com os botões nesta sessão porque o host de navegador não estava disponível. Os containers foram deixados em execução para conferência manual em `http://localhost:8080`; Daniel depois executou `docker compose down` e confirmou que os containers foram removidos e as imagens permaneceram locais.

Durante `npm ci --omit=dev` no build da API, o npm reportou 4 vulnerabilidades nas dependências instaladas: 1 moderada, 2 altas e 1 crítica. Nenhuma dependência foi atualizada nesta tarefa. Testes automatizados não foram executados. As respostas reais de uma chamada demonstram o fluxo testado, não garantem disponibilidade contínua dos provedores.
