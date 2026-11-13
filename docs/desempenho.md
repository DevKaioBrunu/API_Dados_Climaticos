# Desempenho

## Smoke test k6

Medição pontual executada em **2026-11-12** para `GET
/api/v1/clima/Fortaleza`, escolhido como fluxo principal da API climática. O
teste usou uma VU, dez iterações sequenciais e uma pausa de um segundo após
cada requisição. O script verificou HTTP 200 e os campos básicos do contrato.

### Ambiente e execução

- API iniciada com `docker compose up --build --detach api`; a imagem foi
  construída a partir de `node:22-alpine` e publicada em `localhost:3000`.
- Docker Desktop 29.9.3, host Windows com backend Linux/amd64 em WSL2.
- Recursos visíveis ao daemon Docker: 4 CPUs e aproximadamente 9,6 GiB de memória.
- k6 v2.4.0 executado no container oficial `grafana/k6`, digest
  `sha256:3d8e5c7f1d53ec59408c2ffbd9943602a0985ffcbd4a2430ec00f3ffca89796e`.
- O container k6 acessou a API por `http://host.docker.internal:3000`.
- A rota fez chamadas reais ao IBGE e à Open-Meteo; não foram usados mocks.
- Comando PowerShell usado:

  ```powershell
  Get-Content -Raw scripts/k6-smoke.js | docker run --rm -i `
    -e BASE_URL=http://host.docker.internal:3000 grafana/k6 run -
  ```

### Resultado

| Métrica | Resultado |
|---|---:|
| Requisições HTTP | 10 |
| Respostas HTTP não esperadas | 0 (0%) |
| Checks do script | 20/20 aprovados |
| Duração média de `http_req_duration` | 697,47 ms |
| Mediana de `http_req_duration` | 509,39 ms |
| p90 de `http_req_duration` | 1,18 s |
| **p95 de `http_req_duration`** | **1,47 s** |
| Máximo de `http_req_duration` | 1,75 s |

### Limitações

Esta amostra descreve somente as dez requisições desta execução. O p95 inclui
latência e disponibilidade dos provedores externos, além do processamento da
API; não representa uma garantia de desempenho contínuo nem uma medição isolada
do servidor. Uma VU e dez iterações são uma carga pequena de smoke test, não um
teste de capacidade. O curso não define limite de aprovação para p95 e nenhum
limite foi configurado no script.

Os resultados podem variar conforme rede, tempo de resposta dos provedores,
retries e ambiente. Para repetir a medição, inicie a API na porta 3000 e
execute `k6 run scripts/k6-smoke.js`; configure `BASE_URL` se a API estiver em
outro endereço. O teste não avalia uma janela de disponibilidade nem o SLO de
sete dias documentado em `docs/observabilidade.md`.
