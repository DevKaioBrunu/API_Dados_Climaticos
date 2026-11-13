# Handoff para QA — tarefa 003 (área climática)

**Data da revisão:** 2026-11-10

**Responsável pela frente:** Kaio Bruno Soares dos Santos

**Estado local:** testes implementados e validados com provedores simulados;

Este documento é a versão corrigida do handoff anexado à revisão antes do commit. Descreve o código ativo em `backend/src/` e separa resultados executados de pendências do Projeto B. Os arquivos em `X/` são apenas referência.

## Requisitos e limites

| Requisito | Evidência da tarefa 003 | Estado |
|---|---|---|
| B-TEC-04 — testes unitários do domínio | `backend/src/tests/weather.test.js` isola `weather.js` com mock de `httpClient`. | Implementado e executado na suíte. |
| B-TEC-05 — teste de integração | `backend/src/tests/clima.integration.test.js` atravessa Express, rota, serviços e cliente HTTP com Axios simulado. | Integração interna executada; aceitação formal pela equipe/curso ainda pendente. |
| B-TEC-06 — mínimo de cobertura declarado e respeitado | Cobertura foi medida nesta tarefa. | Mínimo ainda não declarado nem configurado; tarefa 004 pendente. |

Não houve alterações no código de produção da API nem adição de dependências nesta tarefa. O registro anterior de autoria e assistência de IA está em `docs/ia.md`; esta revisão foi solicitada por Kaio e assistida por OpenAI Codex.

## Arquivos da tarefa

| Arquivo | Verificação principal |
|---|---|
| `backend/src/tests/weather.test.js` | Quatro testes unitários: arredondamento, tradução e fallback da condição, parâmetros do forecast e erro de domínio. |
| `backend/src/tests/clima.test.js` | Quatorze testes de rota: 400, CPTEC, 404, oito capitais e falhas de IBGE, geocodificação e previsão. Nos casos de sucesso, compara os valores do clima e valida a data ISO. |
| `backend/src/tests/health.test.js` | Dois testes de rota: `healthy` e `degraded`, ambos com HTTP 200 e payloads distintos. |
| `backend/src/tests/clima.integration.test.js` | Dois testes de integração interna: payload final de sucesso, ordem das três URLs chamadas e resposta 503 para falha do forecast. |

As respostas de IBGE e Open-Meteo são simuladas. O teste unitário mocka `getWithRetry`; os testes de rota e integração mockam Axios. Assim, os testes não verificam disponibilidade nem formato atual dos provedores externos.

Supertest abre uma porta TCP **local e temporária** para cada requisição. A suíte não depende da porta 3000 e não deixa um servidor persistente ativo. Uma tentativa de execução em sandbox sem permissão de socket falhou com `listen EPERM`; a execução autorizada fora desse sandbox passou.

## Como reproduzir

Na raiz do repositório, com Node.js e dependências instaladas:

```bash
npx jest backend/src/tests/weather.test.js --runInBand
npx jest backend/src/tests/clima.test.js --runInBand
npx jest backend/src/tests/health.test.js backend/src/tests/clima.integration.test.js --runInBand
npm test -- --coverage --runInBand
```

Os três comandos seletivos são opções de reprodução; **não foram executados separadamente nesta revisão**. O comando executado nesta revisão foi `npm test -- --coverage --coverageReporters=text --runInBand`, com o Node.js do Linuxbrew no `PATH`, para mostrar cobertura no terminal sem gerar artefatos. Resultado: **6 suítes e 39 testes aprovados, 0 falhas**.

| Componente | Declarações | Ramificações | Funções | Linhas |
|---|---:|---:|---:|---:|
| `backend/src/services/weather.js` | 100% | 100% | 100% | 100% |
| `backend/src/routes/clima.js` | 95,45% | 83,33% | 100% | 95,45% |
| `backend/src/routes/cidades.js` | 95,45% | 82,35% | 100% | 95,45% |
| `backend/src/services/ibge.js` | 90,74% | 84,84% | 100% | 90,56% |
| `backend/src/services/httpClient.js` | 78,57% | 73,07% | 50% | 81,48% |
| `backend/src/index.js` | 90,90% | 50% | 66,66% | 90,90% |
| Total medido | 90,85% | 80,43% | 83,33% | 91,35% |

## Pendências para a entrega do projeto

- A equipe precisa confirmar se a integração interna com Axios mockado é aceita como evidência formal de B-TEC-05, conforme registrado na tarefa 002.
- A tarefa 004 deve definir e aplicar um mínimo de cobertura para cumprir B-TEC-06. Medir 90,85% de declarações não estabelece esse mínimo.
- `npm run check-routes`, consultas reais a provedores, verificação de Docker/frontend e CI **não foram executados nesta revisão**. São verificações distintas desta suíte com mocks.
- Antes do commit, revisar os arquivos não versionados com `git status --short`. Recomenda-se deixar `.github/agents/Agente.md` fora do commit específico da tarefa 003, pois é uma instrução de agente separada dos testes; sua inclusão deve ser decidida pela equipe. Este handoff não implica que arquivos já tenham sido incluídos no Git.
