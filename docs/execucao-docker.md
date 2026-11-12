# Execução com Docker Compose

## Pré-requisitos

- Docker instalado e em execução, com o comando `docker compose` disponível.
- Acesso à internet para baixar a imagem base e instalar dependências durante o primeiro build. As consultas de clima e cidades também dependem dos serviços externos descritos no README.

## Subir a aplicação

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

Com a interface aberta em `http://localhost:8080`, use **Verificar disponibilidade** para chamar `/api/v1/health` pelo proxy do Nginx. Também é possível abrir `http://localhost:8080/api/v1/health` ou consultar diretamente `http://localhost:3000/api/v1/health`. A rota responde HTTP 200 e informa `healthy` ou `degraded` conforme a consulta ao IBGE. Portanto, essa resposta confirma que a rota respondeu, mas o estado `degraded` indica que o serviço externo não estava disponível.

Para consultar clima, selecione uma UF e depois um município. O navegador obtém a lista de municípios diretamente do IBGE, independentemente do proxy `/api/`; é necessário acesso à internet a partir do navegador. A consulta climática vai à API pelo proxy e depende dos provedores externos. Para municípios homônimos, a API atual recebe apenas o nome e a interface avisa caso a UF retornada seja diferente da selecionada. A consulta de cidades pela API aceita limite de 1 a 100 resultados; a lista de seleção obtida do IBGE não usa esse limite.

O controle com sol ou lua no canto superior direito alterna entre os temas claro e escuro. A escolha fica salva no armazenamento local do navegador quando disponível; se o armazenamento estiver bloqueado, a escolha vale até recarregar a página.

Uma resposta da rota health não comprova o fluxo completo de consulta climática. Esse fluxo também depende da geocodificação da Open-Meteo e do serviço de previsão da Open-Meteo.

## Conteúdo da imagem

O serviço da API instala as dependências de produção do lockfile e copia o código de `backend/src/`. O serviço frontend usa Nginx para servir `index.html`, CSS e JavaScript; o proxy encaminha caminhos `/api/` para o serviço `api` na rede interna do Compose. Testes, documentação e material em `x/` ficam fora das imagens. Nenhum segredo ou arquivo `.env` é necessário para iniciar os serviços com a configuração atual.

## Limites

A porta da API está fixa em `3000` no código e o Compose publica `3000:3000`; o Nginx publica `8080:80`. A API não define healthcheck Docker: o endpoint existente consulta o IBGE e sempre responde HTTP 200, então não representa de forma confiável a saúde do processo/container. O build e a resposta HTTP também não equivalem à validação ponta a ponta dos provedores.

## Fechamento em 12/11/2026

`docker compose config --quiet` e `docker compose up --build --detach`
passaram para a stack atual com API, frontend e Prometheus. Chrome headless
exercitou clima de Fortaleza, cidades de CE e health com provedores reais;
o coletor confirmou alvo `UP` e incremento do contador. Os serviços ficaram
ativos para revisão, preservando volumes. Detalhes, falhas iniciais e limites:
[verificação final](verificacao-final.md).

O [`.env.example`](../.env.example) configura execução local com Node usando
`--env-file`; o Compose atual define somente as variáveis de métricas no
container. Copiar o exemplo para `.env` não repassa automaticamente todas as
variáveis ao container. Nenhum arquivo `.env` é necessário para a subida padrão.

## Histórico de validações neste workspace

Em 09/11/2026, `docker compose config` validou os serviços `api` e `frontend`; `docker compose build --progress plain` construiu as duas imagens; `docker compose up --build --detach` iniciou os containers. A página em `http://localhost:8080/`, o cliente JavaScript e a folha de estilos responderam HTTP 200. Pelo proxy Nginx, `/api/v1/health` respondeu `healthy`, `/api/v1/cidades/CE?limite=1` retornou HTTP 200 e `/api/v1/clima/Fortaleza` retornou HTTP 200 com condição `Nublado`. Essas chamadas foram feitas sem mocks e incluíram IBGE e Open-Meteo. A API também permanece exposta diretamente em `http://localhost:3000`.

Não foi possível automatizar interação visual com os botões nesta sessão porque o host de navegador não estava disponível. Os containers foram deixados em execução para conferência manual em `http://localhost:8080`; Daniel depois executou `docker compose down` e confirmou que os containers foram removidos e as imagens permaneceram locais.

Durante `npm ci --omit=dev` no build da API, o npm reportou 4 vulnerabilidades nas dependências instaladas: 1 moderada, 2 altas e 1 crítica. Nenhuma dependência foi atualizada nesta tarefa. Testes automatizados não foram executados. As respostas reais de uma chamada demonstram o fluxo testado, não garantem disponibilidade contínua dos provedores.

Essas verificações de 09/11/2026 antecedem a refatoração do frontend. Em 11/11/2026, `docker compose config --quiet` e `docker compose build frontend` passaram. Com serviços já existentes em execução, health, municípios de CE e clima de Fortaleza responderam pelo proxy com provedores reais; a interface foi exercitada no Chrome headless. A correção posterior de foco foi testada em container temporário da nova imagem. Depois, `docker compose up --detach --build --no-deps frontend` recriou o frontend em 8080: o JavaScript servido respondeu HTTP 200 e corresponde ao arquivo atual, incluindo a correção. Avaliação completa de acessibilidade e CLS segue pendente; detalhes em [tarefa 007](../.spec/tarefas/007-refatoracao-frontend.md).
