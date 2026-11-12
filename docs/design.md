# Design observado: SOLID e Adapter

Análise em 2026-11-12 para o Projeto B. Registra o código ativo reaproveitado e
consolidado pela equipe; o fechamento não introduziu uma nova arquitetura.

## Adapter funcional nas integrações

O pattern identificado é **Adapter**, aplicado por funções que traduzem os
contratos dos provedores para os contratos usados pela aplicação.

| Participante | Arquivo/função | Adaptação observável |
|---|---|---|
| Cliente da adaptação | [`routes/clima.js`](../backend/src/routes/clima.js) | Solicita cidade e clima sem acessar diretamente `daily` ou a hierarquia de UF do IBGE |
| Adaptador climático | [`weather.js`, `buscarClima`](../backend/src/services/weather.js) | Recebe latitude/longitude; transforma arrays `daily`, códigos meteorológicos e temperaturas em mínima, máxima, condição e unidade |
| Adaptador geográfico | [`ibge.js`, `buscarCidade` e `buscarCidadesPorUF`](../backend/src/services/ibge.js) | Converte a hierarquia geográfica e nomes externos em objetos da API; a busca por nome também orquestra geocodificação |
| Sistemas adaptados | IBGE e Open-Meteo | Fornecem estruturas e erros próprios, distintos do JSON público da API |
| Transporte compartilhado | [`httpClient.js`, `getWithRetry`](../backend/src/services/httpClient.js) | Centraliza Axios, timeout e retentativas; é apoio de transporte, não a justificativa principal do Adapter |

Exemplo: Open-Meteo devolve `daily.temperature_2m_min[0]` e
`daily.weather_code[0]`; `buscarClima` retorna `temperatura_min` arredondada,
`condicao` traduzida e `unidades.temperatura`. Falhas são convertidas para
`{ tipo: "SERVICO_EXTERNO", servico: "OPEN_METEO" }`; a rota as traduz em HTTP 503.

**Justificativa:** limitar o conhecimento dos formatos externos aos serviços
permite que as rotas trabalhem com objetos pequenos da aplicação. A alternativa
de usar Axios e interpretar o JSON do provedor dentro de cada rota misturaria
transporte, mapeamento e resposta HTTP. A composição por funções combina com o
CommonJS existente, sem criar classes ou hierarquias apenas para demonstrar o
pattern. O custo é manter os mapeamentos quando o provedor muda e testar o
contrato esperado. A localização em pastas, por si só, não comprova o padrão.

## SOLID: evidências e limites

| Princípio | Evidência concreta | Limite da aplicação atual |
|---|---|---|
| S — responsabilidade única | `weather.js` adapta previsão; `httpClient.js` cuida do transporte e retentativas; logger, métricas e middleware têm módulos separados | `ibge.js` também faz geocodificação; `index.js` concentra composição e health. A separação é pragmática, não absoluta |
| O — aberto para extensão, fechado para modificação | `getWithRetry(url, options, retryOptions)` permite variar timeout e política por chamada; logger aceita nível e stream; middleware recebe logger e contador | Outro provedor ou contrato pode exigir alterar serviços/composição. Não há sistema de plugins nem extensão universal |
| L — substituição de Liskov | Não há hierarquia de classes/interfaces de domínio neste código | Não existe uma relação de subtipos exercitada que permita demonstrar LSP. Mocks isoladamente não provam esse princípio |
| I — segregação de interfaces | Consumidores importam operações pequenas: a rota de cidades usa `buscarCidadesPorUF`, a climática usa `buscarCidade` e `buscarClima` | São interfaces de módulos/funções JavaScript, sem contratos de tipos formais |
| D — inversão de dependência | `createRequestMiddleware({ requestLogger, counter, idFactory })` recebe colaboradores; os serviços usam a operação `getWithRetry` em lugar de repetir transporte Axios | Rotas e serviços ainda importam módulos concretos por CommonJS. Há injeção na observabilidade, sem inversão completa das integrações |

O projeto aplica separação de responsabilidades, interfaces pequenas e pontos
de configuração/injeção onde já são úteis. A tabela explicita aplicação e
limites; não afirma que os cinco princípios estejam demonstrados integralmente.
Para a apresentação, explique os exemplos concretos e o que precisaria mudar
se surgisse necessidade real de trocar provedores. O curso pede SOLID, mas o
consolidado não exige hierarquia de classes ou aplicação artificial de todos
os princípios a cada módulo.

## Evidências e decisão de fechamento

- [`weather.test.js`](../backend/src/tests/weather.test.js): mapeamento de
  temperatura/condição, código desconhecido e falha externa, com cliente HTTP mockado.
- [`clima.integration.test.js`](../backend/src/tests/clima.integration.test.js):
  aplicação, rota, serviços e cliente HTTP juntos, com Axios mockado na fronteira.
- [`observability.test.js`](../backend/src/tests/observability.test.js):
  colaboração de logger/contador e servidor de métricas.
- [ADR 0001](adr/0001-decisao.md): decisão de observabilidade de Daniel,
  preservada como decisão técnica principal para o vídeo.

Decisão do fechamento conduzido por Kaio: documentar os pontos existentes,
preservar contratos e não refatorar provedores para produzir um exemplo de
arquitetura. A autoria da análise documental é distinta da autoria do código,
registrada em [CONTRIBUTORS](../CONTRIBUTORS.md).
