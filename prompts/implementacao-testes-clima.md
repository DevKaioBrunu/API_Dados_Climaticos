# Implementação — Testes da área climática (tarefa 003)

## Fontes obrigatórias antes de iniciar

1. `AGENTS.md` — restrições permanentes.
2. `.github/agents/Agente.md` — fluxo, identidade e proibições.
3. `docs/guia-uso-de-ia.md` — registro, classificação e evidências.
4. `.spec/tarefas/003-testes-clima.md` — escopo, checklist e histórico.
5. `docs/requisitos-projeto-b.md` — B-TEC-04, B-TEC-05 e B-TEC-06.
6. Os arquivos ativos listados na seção "Código ativo envolvido".

## Solicitante e responsável

Solicitante: Kaio Bruno Soares dos Santos.
Responsável pela área climática e inicialização: Kaio.

Toda contribuição, decisão e registro de IA desta tarefa deve ser atribuída a Kaio.

## Objetivo

Avaliar e complementar os testes da previsão climática e do health, cobrindo sucesso, entradas inválidas e falhas de provedores conforme o comportamento já implementado. Criar testes unitários do serviço climático e um teste de integração explícito para o fluxo da rota de clima. Executar, medir cobertura e registrar evidências reais.

## Código ativo envolvido

| Arquivo | Papel |
|---|---|
| `backend/src/services/weather.js` | Serviço climático: `buscarClima(lat, lon)` |
| `backend/src/services/ibge.js` | Serviço geográfico: `buscarCidade(nome)` |
| `backend/src/services/httpClient.js` | Cliente HTTP com retry: `getWithRetry(url, opts)` |
| `backend/src/routes/clima.js` | Rota `GET /api/v1/clima/:nome_cidade` |
| `backend/src/index.js` | App Express e rota `GET /api/v1/health` |
| `backend/src/tests/clima.test.js` | Testes existentes da rota de clima (mocks Axios) |
| `backend/src/tests/health.test.js` | Testes existentes do health (mocks Axios) |

## Decomposição em 4 tasks sequenciais

### Task 01 — Testes unitários do serviço climático

**Arquivo novo:** `backend/src/tests/weather.test.js`

1. Mockar `getWithRetry` via `jest.mock("../services/httpClient")`, no limite do serviço, sem requisições de rede. Nota: os demais arquivos de teste (`clima.test.js`, `health.test.js`) mockam `axios` diretamente com `jest.mock("axios")`; a diferença é intencional — neste arquivo o objetivo é isolar a lógica de `weather.js` do cliente HTTP, caracterizando teste unitário.
2. Testar resposta válida: código meteorológico conhecido, temperaturas decimais, estrutura `daily` esperada.
3. Verificar valores arredondados (`Math.round`) e tradução da condição.
4. Verificar parâmetros enviados ao cliente: URL, latitude, longitude, `daily`, `timezone`, `forecast_days`.
5. Testar código meteorológico não mapeado → `"Condicao Desconhecida"`.
6. Testar falha do cliente HTTP → erro com `tipo: "SERVICO_EXTERNO"` e `servico: "OPEN_METEO"`.
7. Não alterar `weather.js`, salvo defeito direto revelado pelo teste e com autorização.

**Critérios de aceite:**
- [ ] Existe teste unitário separado para `weather.js`.
- [ ] Não depende de internet nem credenciais.
- [ ] Sucesso verifica transformação, arredondamento, tradução e unidades.
- [ ] Falha verifica `tipo` e `servico`.
- [ ] Passa isoladamente e junto da suíte existente.

**Validação:**
```bash
npx jest backend/src/tests/weather.test.js --runInBand
npm test -- --runInBand
```

---

### Task 02 — Complementação dos testes da rota de clima

**Arquivo existente:** `backend/src/tests/clima.test.js`

1. Preservar cenários úteis existentes; revisar antes de editar.
2. Adicionar: nome com 1 caractere → `400`, código `NOME_INVALIDO`, `nome_informado`.
3. Adicionar: caso `CPTEC` → `503`, serviço `CPTEC`.
4. Adicionar: falha do IBGE na primeira chamada → `503`, serviço correspondente.
5. Adicionar: falha do geocodificador, distinguindo-a da falha do forecast.
6. Manter teste de sucesso com asserções: nome, estado, temperaturas, condição, `consultado_em`.
7. Garantir ordem e quantidade de mocks alinhadas ao fluxo real. Referência: a sequência de chamadas `axios.get` na rota de clima é: (1) IBGE — busca município por nome; (2) Open-Meteo Geocoding — obtém coordenadas (chamada dentro de `buscarCidade` em `ibge.js`); (3) Open-Meteo Forecast — obtém previsão (chamada em `buscarClima` em `weather.js`). Os mocks devem respeitar exatamente essa ordem.
8. Usar `encodeURIComponent` para nomes com espaço ou acento.

**Classificação:** testes de rota/integração interna (Express + serviços com Axios mockado). Não comprovam disponibilidade real dos provedores.

**Critérios de aceite:**
- [ ] Entradas inválidas relevantes possuem asserções específicas.
- [ ] Sucesso, cidade inexistente e falhas de cada etapa externa estão cobertos.
- [ ] Erros verificam status e código de negócio.
- [ ] Testes determinísticos e independentes.
- [ ] Classificação como teste mockado documentada.

**Validação:**
```bash
npx jest backend/src/tests/clima.test.js --runInBand
npm test -- --runInBand
```

---

### Task 03 — Testes de health e integração da aplicação

**Arquivos:** `backend/src/tests/health.test.js` e novo `backend/src/tests/clima.integration.test.js`

1. Preservar testes existentes de health: `healthy` e `degraded`.
2. Fortalecer asserções com propriedades do contrato: `status`, `versao`, `timestamp`, `motivo` (só em degraded).
3. Criar teste de integração explícito em `clima.integration.test.js`:
   - Importar o `app` de `index.js` (a rota de health e o app Express estão em `backend/src/index.js`; o arquivo `backend/src/app.js` existe mas está vazio e não é utilizado);
   - Requisição HTTP com Supertest;
   - Atravessar rota de clima e serviços;
   - Simular respostas externas de forma determinística.
4. Cobrir fluxo completo de sucesso: IBGE → geocodificação → previsão.
5. Verificar payload final da API, não apenas chamada interna.
6. Documentar no describe ou nome que se trata de integração interna com provedores simulados.
7. Não iniciar servidor persistente; não depender da porta `3000`.

**Classificação obrigatória:**
- Health com Axios mockado = teste de rota, não health check real.
- Fluxo climático com Axios mockado = integração interna.
- `npm run check-routes` com servidor ativo = verificação real, sujeita à rede.
- Node inicializado sem requisição = smoke de inicialização apenas.

**Critérios de aceite:**
- [ ] Health cobre os dois estados com payloads relevantes.
- [ ] Existe teste de integração identificável e classificado.
- [ ] Teste de integração valida a resposta final da rota.
- [ ] Suíte não abre portas nem depende de provedores externos.
- [ ] Documentação distingue mock, inicialização e chamada real.

**Validação:**
```bash
npx jest backend/src/tests/health.test.js backend/src/tests/clima.integration.test.js --runInBand
npm test -- --runInBand
```

---

### Task 04 — Validação final, cobertura e registros

> **Prazo:** Commits posteriores a 13/11 não são avaliados (conforme `docs/requisitos-projeto-b.md`). A data atual é 10/11 — restam 3 dias para a entrega final.

**Pré-requisitos:** Tasks 01, 02 e 03 concluídas ou revisadas.

1. Revisar diff: nomes descritivos, asserções específicas, sem dependência de ordem, mocks restaurados, sem rede.
2. Executar suíte Jest completa em modo determinístico.
3. Executar cobertura e registrar números reais — não inventar limiar (B-TEC-06 não define valor numérico).
4. `check-routes` somente com API ativa e autorização; classificar separadamente.
5. Atualizar `.spec/tarefas/003-testes-clima.md`: marcar apenas critérios comprovados, acrescentar histórico com data, participante, comandos e resultados.
6. Atualizar `docs/ia.md` com uso material de IA: arquivos afetados, decisões humanas, validações executadas.
7. Não alterar `CONTRIBUTORS.md` ou arquivos fora do escopo sem confirmação.

**Validação:**
```bash
npm test -- --runInBand
npm test -- --coverage --runInBand
```

## Escopo geral — o que está fora

- Não alterar `weather.js`, `ibge.js`, `httpClient.js`, `clima.js` ou `index.js` para facilitar mocks.
- Não substituir Jest/Supertest.
- Não introduzir chamadas de rede nos testes automatizados.
- Não adicionar dependências.
- Não alterar contratos de status ou payload.
- Não invadir a frente geográfica (Daniel) sem alinhamento.
- Não ampliar o escopo do Projeto B.
- Não tratar este prompt como autorização — aguardar autorização explícita de Kaio para cada task.
- Não inventar datas, commits, métricas ou autoria.
- Não usar `X/` como fonte de implementação.

## Fluxo de execução

Para cada task, seguir obrigatoriamente:

1. Inspecionar o código ativo e a especificação aplicável.
2. Apresentar diagnóstico e plano da task.
3. Aguardar autorização explícita de Kaio.
4. Implementar somente o escopo autorizado.
5. Executar validações e registrar resultados reais.
6. Informar limitações e pendências.

## Formato da resposta para cada task

1. O que foi analisado.
2. O que foi alterado (se autorizado).
3. Arquivos envolvidos.
4. Validações executadas.
5. Resultados reais.
6. Limitações.
7. Pendências.
8. Próximos passos.

Se algo não foi validado: declarar "não executado", "não confirmado", "hipótese" ou "pendente de validação".
Nunca apresentar intenção como resultado concluído.
