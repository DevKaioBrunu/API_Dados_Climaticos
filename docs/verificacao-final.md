# Verificação final do fechamento — 2026-11-12

Condução de Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex,
após autorização explícita nesta conversa para executar o prompt de fechamento.
Base Git: `DEV`, commit `d6ae88d05d6d6260d59cb8744535bf43b6cc6239`.
As alterações do fechamento permanecem locais e não possuem commit/CI remoto
próprios nesta etapa. Nenhum commit, push, merge ou envio ao Moodle foi feito.

## Resultado e mudanças

Validação local concluída para os cenários descritos. Preparados exemplo de
ambiente, análise de design, documentação, guia de estudo, roteiro e checklist.
A única mudança em JavaScript foi corrigir o caminho da coleção Postman no
verificador manual: de `backend/src/docs/` para `docs/` na raiz.
Não foram alterados contratos, serviços, frontend, dependências ou Compose.

O código de integração dos provedores e a observabilidade já existiam.
Documentar Adapter/SOLID não constitui nova autoria desses componentes.
O [design](design.md) explica aplicação e limites dos princípios.

## Ambiente e verificações

Ambiente local Linux, Node.js **22.23.5**, npm **10.9.9** e Docker **29.9.3**.
Navegador temporário: Chrome for Testing **157.0.8103.78**, headless.
Ferramentas temporárias foram colocadas em `/tmp/api-clima-fechamento`,
sem adicionar dependências à aplicação.

| Comando/verificação | Resultado real |
|---|---|
| `npm ci --cache /tmp/api-clima-fechamento/npm-cache --no-fund --fetch-retries=0 --fetch-timeout=20000` | Passou pelo lockfile: 491 pacotes adicionados. Auditoria da instalação reportou 15 vulnerabilidades (3 baixas, 12 moderadas); nenhuma correção automática aplicada |
| `npm run lint` | Passou após reinstalação, sem alterar regras |
| `npm run test:coverage -- --ci --runInBand` | Fora do sandbox: 7 suítes/42 testes passaram; 204/228 declarações (89,47%), linhas 90,58%, funções 76,66%, ramificações 76,69%. Mínimo: 80% global de declarações |
| `docker compose config --quiet` | Passou |
| `docker compose up --build --detach` | Build da API/frontend passou e stack iniciou com Prometheus; instalação de produção no build reportou zero vulnerabilidades naquela consulta |
| `npm run check-routes` | Passou: health, clima de oito cidades, cidades de CE, dois status 400 esperados, coleção Postman e presença dos testes |
| `node --env-file=.env.example ...` | Arquivo carregado; logger `info`, timeout público 5000 e host de métricas local conferidos. Override `LOG_LEVEL=warn` prevaleceu; sem arquivo, logger usou default `info` |
| `.gitignore` | `.env` ignorado; `.env.example` permitido. O exemplo ainda precisa ser incluído no commit autorizado |

Falhas iniciais preservadas: a primeira cobertura encontrou a instalação
local desatualizada, sem `pino`, e cinco suítes não carregaram. Após `npm ci`,
a execução no sandbox falhou com `listen EPERM` por bloquear as portas TCP
temporárias do Supertest. A execução autorizada fora do sandbox passou.
Essas tentativas não são registradas como sucesso.

Os números da auditoria são observações do npm nesses comandos, com escopos
diferentes (desenvolvimento completo e produção). Não constituem auditoria
exaustiva; nenhuma dependência foi atualizada. O lockfile foi preservado.

### Interface e provedores reais

Chrome headless acessou a interface servida por Nginx em 8080, sem mocks:

- Carregamento do catálogo do IBGE e seleção CE/Fortaleza pelo atalho da interface.
- Consulta de clima HTTP 200, nome Fortaleza e UF CE, mínima 25 °C e máxima
  30 °C na resposta daquele momento. Valores são previsão da amostra.
- Alternância para JSON técnico e retorno à visão formatada.
- Troca para tema escuro; consulta de cidades CE com limite 1 e um resultado.
- Health com `healthy` no corpo; isso não é garantia contínua dos provedores.
- Layout sem overflow horizontal em 375 px. Capturas de 1280 px e 375 px
  foram inspecionadas; não equivalem a avaliação integral de acessibilidade.

O verificador manual consultou Fortaleza, São Paulo, Rio de Janeiro, Brasília,
Salvador, Belo Horizonte, Curitiba e Manaus, com status e formato esperados.
Para os dois casos HTTP 400, o script confirma o status, sem validar o corpo
no caminho de exceção; testes Jest existentes verificam contratos de erro.

### Logs e coleta Prometheus

Alvo confirmado: `http://api:9100/metrics`, job `api`, estado `up`;
consulta `up{job="api"}` retornou **1**. A soma coletada de
`api_http_requests_total` avançou de **16 para 17** após uma requisição
400 e o scrape seguinte. Isso comprova coleta nessa execução, sem medir o SLO.

Um registro JSON de requisição continha `time`, `level`, `service`, `event`,
`request_id`, `method`, `route`, `status_code`, `duration_ms` e `msg`;
sem campos de URL, corpo, query ou cabeçalhos. As rotas usam templates.

API e frontend já estavam ativos no início; a API foi recriada e Prometheus
foi acrescentado com o volume previsto no Compose. Os três serviços foram
deixados ativos para revisão da dupla. O Chrome temporário foi encerrado;
nenhum volume foi apagado. Métricas em 9100 continuam sem publicação no host
e Prometheus permanece publicado somente em `127.0.0.1:9090`.

## Verificação de segredos

Ferramenta: [Gitleaks 8.30.1, distribuição oficial](https://github.com/gitleaks/gitleaks/releases/tag/v8.30.1),
baixada temporariamente e conferida pelo SHA256 do manifesto oficial:
`551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb`
para o arquivo Linux x64. Consulte a [documentação oficial](https://github.com/gitleaks/gitleaks)
para os comandos e o comportamento do scanner.

Comandos, executados na raiz; o nome completo do binário nesta sessão foi
`/tmp/api-clima-fechamento/gitleaks`:

```bash
gitleaks git --no-banner --redact=100 --log-opts='--all --full-history' \
  --report-format=json --report-path=/tmp/api-clima-fechamento/segredos-historico.json .
gitleaks dir --no-banner --redact=100 \
  --report-format=json --report-path=/tmp/api-clima-fechamento/segredos-arquivos.json \
  /tmp/api-clima-fechamento/arquivos-versionaveis
```

O clone não é raso. O Git enumerou **102 commits alcançáveis por `--all`**;
o scanner reportou **50 commits processados**, cerca de **3,70 MB**, e
**nenhum achado** no histórico. As contagens do Git e da ferramenta são
registradas separadamente: não presumimos que tenham o mesmo significado.
O comando abrange as refs locais disponíveis, inclusive branches, remotas
locais, stash e refs internas de checkpoints; nenhum fetch foi feito.

Para o conteúdo atual, o snapshot é construído a partir de
`git ls-files --cached --others --exclude-standard -z`, copiando somente
arquivos versionados ou novos não ignorados, sem `.git` e sem arquivos pessoais
ignorados. Foram examinados **90 arquivos**, cerca de **433,78 KB** naquele
snapshot, com **nenhum achado** e código de saída zero. O resultado também
está registrado na tarefa 008.
Os relatórios JSON são redigidos por `--redact=100` e permanecem em `/tmp`.

Limites: heurísticas podem não detectar todo segredo; refs remotas ausentes,
objetos inacessíveis, serviços externos, conteúdo pessoal ignorado e tudo que
não foi examinado ficam fora da conclusão. Ausência de achados não é garantia
universal. Nenhum segredo foi alterado e não houve reescrita de histórico.

## CI, desempenho e SLO

Confirmado pela API pública do GitHub em 12/11/2026: [CI #5](https://github.com/DevKaioBrunu/API_Dados_Climaticos/actions/runs/43300946340),
branch `DEV`, commit `d6ae88d05d6d6260d59cb8744535bf43b6cc6239`, estado
`completed`, conclusão `success`. Última atualização informada:
`2026-11-12T20:30:32Z`. Fonte consultada:
[metadados da execução](https://api.github.com/repos/DevKaioBrunu/API_Dados_Climaticos/actions/runs/43300946340).
Isso não cobre arquivos ainda locais; o CI do fechamento permanece pendente
do envio autorizado e da execução correspondente.

O smoke test de [desempenho](desempenho.md) permanece como medição histórica
de 12/11: 1 VU, dez requisições, 20/20 checks, p95 **1,47 s**. Não foi
reexecutado porque este fechamento não modificou o fluxo medido da API.

O SLO de 95%/sete dias está declarado, e a coleta foi confirmada. A janela
completa não foi observada. A entrega não exige esperar sete dias nem
inventar um resultado para essa janela.

## Revisão e pendências externas

`git diff --check` passou. Links locais e blocos de código de 21 documentos
Markdown alterados/novos foram conferidos, assim como whitespace dos arquivos
novos. O diff contém uma correção de caminho no verificador manual, um exemplo
público e documentação; `package.json` e o lockfile não foram alterados.

Conferir o [design](design.md), [guia de estudo](guia-estudo-apresentacao.md),
[roteiro](roteiro-apresentacao.md), [checklist](checklist-entrega.md) e
[tarefa 008](../.spec/tarefas/008-fechamento-apresentacao.md).

Continuam pendentes: revisão da dupla e da divisão de falas, autorização e
integração Git, CI do commit final, ensaio, gravação, confirmação do prazo no
Moodle e envio oficial. Nenhuma dessas ações é presumida concluída.
