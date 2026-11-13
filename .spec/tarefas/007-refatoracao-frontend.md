# 007 — Refatoração do frontend

**Estado:** Tasks 02 a 05 executadas; fluxo principal validado no Chrome headless e com provedores reais. Avaliação completa de acessibilidade e CLS permanece pendente.

**Solicitante:** Kaio Bruno Soares dos Santos. Frente transversal da interface; assistência de OpenAI Codex. HTML e CSS existentes são registrados em `CONTRIBUTORS.md` como contribuição de Daniel; a necessidade da alteração é a refatoração solicitada. Alinhamento da equipe para os arquivos compartilhados permanece pendente.

**Referências:** `prompts/refatoracao-frontend.md`, `prompts/planejamento-refatoracao-frontend.md`, `docs/requisitos-projeto-b.md` (B-TEC-01 e B-TEC-07), `docs/guia-uso-de-ia.md` e `.spec/README.md`.

**Ampliação de escopo solicitada em 2026-11-11:** o prompt principal passou a exigir seleção UF → município com combobox pesquisável. A proposta de campos independentes abaixo registra o plano anterior e está superada. A implementação usa diretamente a lista do IBGE, pois a rota local limita a listagem a 100 nomes e o arquivo fornecido está incompleto. A rota de clima continua recebendo apenas nome; a interface informa quando a UF retornada diverge da escolhida.

## Comportamento implementado

- O controle de tema no canto superior direito exibe sol no modo claro e lua no modo escuro; a alternância salva a escolha no armazenamento local quando disponível, com padrão claro.
- A interface usa listas pesquisáveis com a mesma aparência para selecionar a sigla da UF e o município. A lista de UFs está no frontend; após selecionar uma UF, o navegador consulta os municípios diretamente no serviço de localidades do IBGE. Editar a UF limpa a cidade e invalida respostas anteriores que chegarem depois.
- A cidade deve ser selecionada na lista para habilitar a consulta climática. A busca de município ignora diferenças de maiúsculas e acentos; as listas possuem controles de setas, Enter e Escape. Os atalhos escolhem a UF, carregam a lista e, se a cidade for encontrada, iniciam a consulta.
- A consulta de cidades pela API usa o limite informado de 1 a 100; a lista de seleção obtida do IBGE é independente desse limite. O campo de endereço da API aceita configuração; sem ela, usa a origem da página ou `localhost:3000` ao abrir por `file://`.
- Resultados de clima, cidades e health são apresentados visualmente, com alternância para JSON técnico sem nova consulta. As requisições exibem estado de carregamento e erros, usam limite de espera de 15 segundos e oferecem nova tentativa para falha ao carregar municípios.
- A visão formatada do clima apresenta temperaturas mínima e máxima em pares rotulados, com unidade, sem separador vertical.
- O health `degraded` é apresentado como disponibilidade limitada. A rota de clima recebe apenas o nome; quando retorna UF diferente da selecionada, a interface informa a divergência em vez de exibir o resultado como correspondente. A API atual não permite escolher qual UF homônima consultar.

Esses itens descrevem o código inspecionado. Os fluxos principais e três larguras foram verificados no Chrome headless; a avaliação completa de acessibilidade e CLS permanece pendente. O checklist e o histórico abaixo distinguem simulação de consultas reais.

## Diagnóstico inicial da base

- `frontend/index.html` já associa labels aos quatro campos e oferece consulta das três rotas, URL base configurável e cidades rápidas. A resposta aparece em `<pre>`; não há formulário, apresentação formatada, regiões de anúncio ou estado de carregamento.
- `frontend/css/styles.css` usa tema escuro, cartões semelhantes e foco para inputs; o comportamento de teclado, contraste e dimensões reais ainda não foram medidos no navegador.
- `frontend/js/api.js` usa a origem da página por padrão, aceita URL configurável e usa `localhost:3000` ao abrir via arquivo. `app.js` mostra JSON e trata falhas; não desabilita controles durante requisições nem diferencia `healthy` de `degraded`.
- O código das rotas retorna clima com `nome`, `estado`, mínima, máxima, condição, unidade e horário; não retorna temperatura atual. A rota de clima recebe somente o nome da cidade: a UF preenchida no frontend não filtra essa consulta. A rota de cidades retorna objetos `{ nome }`, quantidade e UF; recebe limite padrão 10, de 1 a 100.
- Health retorna HTTP 200 para `healthy` e `degraded`; o estado degradado não deve ser apresentado como saúde normal. Erros 400, 404, 500 e 503 estão previstos nas rotas; o campo `servico` identifica o provedor quando disponível.
- `frontend/Dockerfile` copia HTML, CSS e JS; Nginx encaminha `/api/` ao serviço `api:3000`. Compose expõe frontend em 8080 e API em 3000. A configuração ESLint contempla os scripts do navegador. Essas conclusões decorrem de leitura estática, sem execução dos serviços ou consultas reais nesta etapa.

## Proposta inicial de identidade

Tema: um boletim de observação do céu e municípios brasileiros, com a área de resultado como ponto focal. O painel de busca permanece simples. Não pressupor um mapa geográfico real nem coordenadas disponíveis na lista de municípios.

Paleta base proposta (semântica de estados complementada pelas cores abaixo):

| Token | Valor | Uso proposto |
|---|---|---|
| `--bg` | `#e8f2f3` | Fundo de céu claro |
| `--surface` | `#ffffff` | Superfície de leitura |
| `--text` | `#163440` | Texto principal |
| `--text-muted` | `#3d5962` | Texto secundário |
| `--primary` | `#005c70` | Ação principal e detalhes |
| `--focus` | `#163f85` | Contorno de foco |

Estados sobre superfície branca: sucesso `#17633d`, alerta `#805000`, erro `#a52e30`; sempre acompanhados de texto, sem depender só da cor. O contorno de controles e demais combinações de cor ainda deverão ser verificados na implementação.

Contraste calculado pela luminância relativa WCAG para os pares propostos: texto/fundo 11,52:1; texto/superfície 13,13:1; secundário/superfície 7,49:1; primário/superfície e branco/primário 7,60:1; foco/superfície 10,08:1; sucesso/superfície 7,27:1; alerta/superfície 6,85:1; erro/superfície 6,92:1. Esses pares atendem 4,5:1 matematicamente; não comprovam acessibilidade da página final.

Tipografia: propor uma família sem serifa legível, com hierarquia por peso e escala; usar fontes locais/de sistema para não depender de rede, com `font-family` definido após verificar a disponibilidade. Corpo de 16 px e entrelinha de 1,5; linhas descritivas com largura inferior a 80 caracteres. Temperaturas mínima e máxima em destaque, claramente rotuladas como previsão; data da consulta não é a data de uma medição.

### Wireframe proposto

Alinhamento principal à esquerda; no desktop, busca à esquerda e resultado à direita. No celular, empilhar as regiões na ordem abaixo.

```text
 Dados climáticos                               Estado da consulta
 Consulte o clima e municípios brasileiros     [Verificar disponibilidade]

 Consulta                              Resultado
 Cidade [________________]             [Visão formatada] [JSON técnico]
 [Consultar clima]                     ┌───────────────────────────────┐
 Cidades rápidas:                      │ Fortaleza, CE                 │
 [Fortaleza] [São Paulo] [...]         │ Condição: parcialmente nublado│
                                       │ Mínima 24 °C   Máxima 31 °C   │
 Municípios por estado                 │ Consultado em ...             │
 UF [__]  Limite [___]                └───────────────────────────────┘
 [Buscar cidades]                      Ou: lista de municípios com total
                                       Ou: situação da API e motivo
 Configuração: endereço da API         Ou: JSON técnico da última resposta
```

Números e localidade do wireframe são ilustrativos, não medições. O desenho e a proposta original de campos independentes foram substituídos pela seleção em cascata descrita acima. Reservar espaço para resultado e testar rolagem, toque, foco e movimento reduzido; não declarar CLS alcançado sem medição.

### Textos propostos

- Inicial: “Escolha uma cidade ou busque municípios por estado para começar.”
- Cidade: “Digite pelo menos 2 caracteres.” UF: “Use a sigla com 2 letras, por exemplo CE.” Limite: “Escolha um número inteiro de 1 a 100.”
- Carregamento: “Consultando dados. Aguarde.” Saúde degradada: “A API respondeu, mas um serviço externo está indisponível.”
- 400: “Confira os dados informados e tente novamente.” 404: “Não encontramos o resultado. Confira o nome ou a sigla.”
- 500: “Não foi possível concluir a consulta. Tente novamente em instantes.” 503: “O serviço externo está temporariamente indisponível. Tente novamente em instantes.” Identificar o serviço somente quando informado.
- Conexão: “Não foi possível conectar à API. Verifique o endereço e se o serviço está em execução.” Timeout, caso implementado: explicar tempo esgotado e sugerir nova tentativa.

## Etapas e limites propostos

1. **Task 01:** diagnóstico e design apresentados; Kaio autorizou a Task 02. Confirmação separada do alinhamento da equipe para arquivos compartilhados permanece pendente.
2. **Task 02:** HTML semântico implementado e fluxo principal exercitado no navegador; avaliação completa de acessibilidade pendente.
3. **Task 03:** CSS refatorado e combobox acrescentada com a Task 04; três larguras verificadas sem rolagem horizontal; CLS e contraste efetivo completos não medidos.
4. **Task 04:** cascata IBGE, estados, apresentação e JSON implementados; fluxo real verificado no navegador, com limites descritos no histórico.
5. **Task 05:** lint, Jest, cobertura, Compose, build, consultas reais e cenários no Chrome headless executados; foco após requisição corrigido e verificado. As verificações não comprovam WCAG integral nem funcionamento permanente dos provedores.

Não alterar backend, contratos, portas, Compose, Nginx, testes do backend ou provedores. A necessidade de alterar infraestrutura ou arquivos de outra frente deverá ser apresentada antes de qualquer alteração. HTML, CSS e JS são interdependentes: cada etapa deve manter a compatibilidade possível e a validação completa depende da conclusão do conjunto.

## Checklist de aceite

- [x] Diagnóstico e proposta de paleta, contrastes, wireframe e textos registrados a partir da leitura do código.
- [x] Alternância claro/escuro e persistência implementadas; comportamento de armazenamento bloqueado verificado em simulação.
- [x] Conferir os dois temas e o cabeçalho em capturas do Chrome a 375 e 1280 px; repetir fluxo principal por teclado na versão atual.
- [ ] Verificar todos os estados e combinações de contraste no navegador e testar com leitor de tela.
- [ ] Confirmação separada de alinhamento da equipe para os arquivos HTML/CSS originalmente atribuídos a Daniel. A alteração foi solicitada e autorizada por Kaio; este alinhamento não está registrado.
- [x] HTML com regiões semânticas, labels e orientações associadas aos campos; IDs e referências ARIA inspecionados.
- [x] Comboboxes de UF e município permitem busca, navegação por teclado e seleção válida; troca de UF limpa a cidade e respostas atrasadas são ignoradas.
- [x] Fluxo somente por teclado de selecionar CE, escolher Fortaleza e consultar clima chegou a HTTP 200; Tab, Shift+Tab, setas, Enter e Space verificados no Chrome headless.
- [x] CSS refatorado com tokens, layout responsivo, foco visível, estados de interação e regra para movimento reduzido.
- [x] Nas larguras Chrome verificadas (375, 768 e 1280 px), não houve rolagem horizontal; capturas de 375 e 1280 px foram inspecionadas.
- [x] Medir CLS no carregamento, alternância de tema e consulta health nos cenários de 375 e 1280 px: 0, conforme PerformanceObserver no Chrome.
- [ ] Confirmar contraste WCAG AA em todos os estados renderizados, operação com leitor de tela e CLS nos demais fluxos e dispositivos. A amostragem de cores e a medição de um cenário não comprovam o conjunto.
- [x] Consultas de health, clima e municípios renderizadas; JSON técnico alterna sem nova requisição. Health `degraded` e divergência de UF recebem tratamento específico.
- [x] Estado de carregamento, timeout e nova tentativa para falha ao carregar municípios implementados; estados e respostas verificadas por simulação e no navegador conforme o cenário.
- [x] A API retornou HTTP 400 para cidade de uma letra; o formulário impede consulta climática sem uma cidade selecionada.
- [x] Lint, Jest e Compose executados com resultados registrados.
- [x] Fluxo no navegador e provedores reais verificados, ou limitação registrada.
- [x] Documentação e contribuição efetiva atualizadas conforme evidências desta etapa.
- [x] Frontend em `localhost:8080` recriado com a imagem que inclui a correção de foco; JavaScript servido respondeu HTTP 200 e corresponde ao arquivo local.

## Validação da Task 05 em 11/11/2026

| Verificação | Resultado e limite |
|---|---|
| `npm run lint` | Passou sem erros ou avisos, inclusive após a correção de foco. |
| `npm test -- --runInBand` e `npm run test:coverage -- --ci --runInBand` | Fora do sandbox, Supertest usou portas locais: 6 suítes e 39 testes passaram; 90,85% de declarações, igual à medição anterior, acima do mínimo de 80%. Provedores mockados na suíte. |
| `docker compose config --quiet` e `docker compose build frontend` | Configuração e build passaram. Os serviços já estavam ativos e não foram recriados; antes da correção de foco, HTML, CSS e JS servidos em 8080 correspondiam aos arquivos locais. Após a correção, a nova imagem foi verificada em container temporário na porta 18080 e esse container foi encerrado. O serviço preexistente em 8080 não foi atualizado nesta etapa. |
| `curl` pelo proxy em 8080 | Health respondeu HTTP 200 `healthy`; cidades/CE retornou 10 municípios; clima/Fortaleza respondeu HTTP 200, com UF CE e dados da previsão. Foram chamadas reais de uma execução, não garantia de disponibilidade contínua. Cidade `X` respondeu HTTP 400 `NOME_INVALIDO`. |
| Chrome 157 headless | CE, busca `For`, Fortaleza/Forquilha, clima, cidades, health, atalho Fortaleza, JSON, troca para SP, rolagem e entrada sem seleção exercitados. Fluxo CE/Fortaleza somente por teclado chegou ao resultado HTTP 200; Tab, Shift+Tab, setas, Enter e Space exercitados. A primeira tentativa somente por teclado expirou esperando o resultado; a repetição passou. |
| Chrome 157, larguras 375, 768 e 1280 px | `scrollWidth` não excedeu `clientWidth` nas três verificações. Capturas inspecionadas em 375 e 1280 px. Não houve medição de CLS nem avaliação de todas as larguras ou zoom. |
| Foco após requisição | Identificada perda de foco ao desabilitar o botão; corrigido `frontend/js/app.js`. Na nova imagem temporária, teste por teclado confirmou retorno do foco após HTTP 200 e outro teste com resposta simulada confirmou que mover o foco durante a espera é respeitado. |

Leitor de tela, avaliação integral WCAG AA, CLS, todos os erros e condições de rede permanecem pendentes. O teste de uma letra na interface impede a consulta por falta de seleção; o HTTP 400 foi verificado diretamente na API. Os serviços Docker preexistentes foram mantidos em execução.

## Histórico de andamento

| Data | Participante | Atualização/decisão | Evidência/resultado |
|---|---|---|---|
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Solicitado o início da refatoração; Codex inspecionou a base e preparou diagnóstico e proposta da Task 01. Aprovação do plano e implementação posteriores pendentes. | Leitura estática dos arquivos ativos e cálculo dos contrastes propostos; testes, navegador, Compose e consultas reais não executados. Nenhum código da aplicação alterado. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio autorizou a Task 02. Criados prompt específico e estrutura semântica em `frontend/index.html`, com rótulos, dicas, regiões de anúncio, dimensões mínimas provisórias e preservação das ações existentes. A alternância futura permanece oculta e desabilitada. | `npm run lint` passou; verificação com `HTMLParser` confirmou quatro inputs com labels e descrições, IDs únicos, ações e fechamento estrutural; simulação Node de DOM e fetch confirmou os três caminhos e um atalho. `git diff --check` passou. Navegador, leitor de tela, teclado e dimensões renderizadas não verificados; não houve consultas reais. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio pediu atualização do prompt para incluir cascata UF/município antes da Task 03. Planejamento e critérios de aceite ampliados; nenhuma implementação nova autorizada ou executada nesta etapa. | Leitura das rotas e do arquivo fornecido: limite máximo atual de 100, 25 seções de UF, 4.773 nomes, ausência de Sergipe e Tocantins e 62 nomes na seção de SP. Fonte completa ainda não definida. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio autorizou a Task 03. Criado prompt específico e refatorado `frontend/css/styles.css` com tokens, responsividade, foco, movimento reduzido e estilos preparatórios para resultados e combobox. | `npm run lint` e `git diff --check` passaram; cálculo de pares de contraste e inspeção dos aliases do indicador atual realizados. Navegador, teclado, CLS e lista da combobox não verificados; fonte dos municípios e marcação da combobox pendentes. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio autorizou a Task 04 e pediu a conclusão da Task 03. Criados prompt, estrutura da combobox e lógica de cascata usando diretamente o serviço de localidades do IBGE, já usado pelo backend; implementados renderização, JSON, estados e verificação da UF retornada. | IBGE real: CE 184 municípios, SP 645, DF 1 (Brasília); CE respondeu CORS `*`. Simulação de DOM/fetch validou busca, teclado, troca de UF, resposta atrasada, divergência, health degradado, JSON e nova tentativa. `npm run lint` e `docker compose config --quiet` passaram; Jest: 6 suítes/39 testes passaram fora do sandbox após `listen EPERM` no sandbox. Navegador e integração real de clima não executados. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio solicitou uniformizar a lista de UFs com a lista de municípios. O seletor de UF passou a usar a mesma estrutura visual, com busca e seleção por teclado ou ponteiro; editar a UF invalida a cidade anterior. | `npm run lint` e `git diff --check` passaram. Simulação de DOM verificou as 27 UFs, filtro, teclado, invalidação, respostas atrasadas e atalho de cidade. Teste visual, tecnologias assistivas e consultas reais não executados nesta alteração. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Solicitada a atualização da documentação da implementação; registradas as funcionalidades atuais, separadas as propostas históricas e explicitadas as pendências de validação. | Conferência dos arquivos ativos e dos registros já existentes; esta atualização é documental e não equivale a nova execução da aplicação, de testes ou de consultas reais. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio autorizou a Task 05; executadas validações e corrigida a perda de foco após a consulta. | Lint, 6 suítes/39 testes, cobertura 90,85%, config/build Docker, chamadas reais e cenários Chrome conforme tabela acima. Primeira tentativa de fluxo apenas por teclado expirou; repetição e testes de foco passaram. Avaliação integral de acessibilidade e CLS pendentes. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Checklist atualizado para separar critérios comprovados das pendências de acessibilidade, alinhamento e atualização do container em 8080; limitações das Tasks 02 e 03 identificadas como históricas. | Releitura das evidências registradas nesta tarefa; nenhuma nova validação de código executada. `git diff --check` passou. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Retomada a pendência apontada por Kaio: frontend recriado para aplicar a correção de foco em 8080. | `docker compose up --detach --build --no-deps frontend` passou. `docker compose ps` confirmou os serviços ativos; `/js/app.js` respondeu HTTP 200 e seu conteúdo corresponde ao arquivo local, incluindo a correção. Navegador e suíte não repetidos nesta atualização. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio solicitou alternância claro/escuro; implementados botão, tokens e persistência local, com padrão claro e funcionamento sem armazenamento. | Lint, simulação da alternância e cálculo dos contrastes principais; validação visual e tecnologias assistivas pendentes. Nenhuma atualização do container em 8080 nesta etapa. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio solicitou a reconstrução do frontend em 8080 para disponibilizar o tema. | `docker compose up --detach --build --no-deps frontend` passou; `docker compose ps` mostrou os serviços ativos e o HTML servido corresponde ao arquivo local com o botão de tema. Interação visual não repetida nesta etapa. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | A pedido de Kaio, consolidados os registros da refatoração conforme `Agente.md`, corrigindo resumos que ainda indicavam validações posteriores como pendentes e registrando tema e atualização do frontend Compose. | Revisão documental contra o código e as evidências já existentes; `git diff --check` executado. Nenhum teste, navegador, Compose ou provedor foi reexecutado nesta atualização. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio pediu revisão do encaixe visual, controle de tema discreto com sol/lua no canto superior direito e esclarecimento da barra após a mínima. Ajustados HTML/CSS do controle e a renderização das temperaturas, removendo o separador literal. | `npm run lint`, `node --check` e `git diff --check` passaram; verificação estrutural do HTML e simulação isolada de `renderWeather` confirmaram ícones, rótulos, unidade e ausência da barra. Navegador, dimensões renderizadas, leitor de tela, CLS, Compose e provedores não executados nesta alteração. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio enviou captura do cabeçalho em modo escuro e apontou desalinhamento. CSS ajustado para reservar uma faixa superior para o controle de tema e alinhar título e cartão de status pelo início da mesma linha, sem margem exclusiva no cartão. | A captura fornecida mostrou o desnível anterior. `git diff --check` e lint executados após o ajuste. Renderização da nova posição em navegador e outras larguras ainda não confirmadas. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio pediu cartão de status mais compacto, alinhado à esquerda com o painel de resultados, e botão de tema à direita do cartão na mesma altura. Reorganizados `frontend/index.html` e `frontend/css/styles.css`: cabeçalho e conteúdo usam colunas iguais; o cartão tem largura máxima de 420 px e menor espaçamento vertical. | `npm run lint` e `git diff --check` passaram. Inspeção estrutural confirmou cartão e botão no mesmo grupo e colunas iguais no CSS. Nova renderização no navegador, larguras e Compose ainda não verificados. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Kaio rejeitou o último arranjo e pediu retorno à versão imediatamente anterior. Desfeita somente a reorganização mais recente do cabeçalho: cartão com largura máxima de 440 px, botão no canto superior direito e colunas anteriores. | Conferência do HTML/CSS contra o estado anterior e `git diff --check`; a nova posição não foi verificada em navegador nem publicada no container nesta reversão. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | A versão restaurada do cabeçalho foi disponibilizada no serviço frontend local em 8080; a API permaneceu em execução. | `docker compose up --detach --build --no-deps frontend` passou; `docker compose ps frontend` mostrou o serviço ativo. HTML e CSS obtidos por HTTP em 8080 foram comparados com os arquivos locais por `cmp` e coincidiram. Interação visual em navegador não repetida. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Solicitada resolução das pendências e verificação da versão atual. Revistos os dois temas e o cabeçalho, teclado, cores amostradas e estabilidade do layout; alinhamento da equipe e leitor de tela seguem pendentes. | Chrome headless: capturas clara/escura inspecionadas a 1280 px; sem rolagem horizontal a 320, 375, 768 e 1280 px. Teclado alternou tema, selecionou CE/Fortaleza e consultou clima com HTTP 200 real. A primeira execução de um script anterior falhou porque esperava o campo de URL antes do novo botão de tema; script atualizado passou. Cores renderizadas: texto dos botões 7,60:1 no claro e 8,30:1 no escuro; título 11,52:1 e 15,64:1. CLS 0 no cenário de carregamento, tema e health em 1280 px; árvore de acessibilidade inspecionada, sem execução com leitor de tela. |
| 2026-11-11 | Kaio Bruno Soares dos Santos, com assistência de OpenAI Codex | Repetida a verificação em tamanho móvel. | Capturas do topo da página nos dois temas a 375 px foram inspecionadas; no mesmo percurso de carregamento, tema e health, o CLS medido foi 0. O resultado é restrito aos cenários exercitados. |
| 2026-11-12 | Kaio, com assistência de OpenAI Codex | Smoke test final da interface existente, sem alteração de frontend. | Chrome headless 157: catálogo IBGE real, Fortaleza/CE com previsão HTTP 200, cidades CE com limite 1, health healthy, alternância JSON/tema e ausência de overflow horizontal em 375 px. Capturas em 1280/375 inspecionadas; não houve nova avaliação integral de acessibilidade ou CLS. Ver tarefa 008. |

## Limitações históricas e pendências atuais de validação

Ao final da Task 03, ainda não havia navegador disponível. Na Task 05, Chrome headless verificou fluxos e larguras 375, 768 e 1280 px. A versão atual foi posteriormente verificada nos cenários adicionais registrados no histórico. Permanecem pendentes o teste com leitor de tela, a avaliação completa de contraste e a medição de CLS em outros fluxos e dispositivos. A lista de localidades depende da disponibilidade do IBGE no navegador. O alinhamento da equipe sobre arquivos compartilhados segue sem confirmação registrada.

## Limitações históricas observadas ao final da Task 02

Naquele ponto, estilos, estados e visualização formatada ainda não haviam sido implementados. As Tasks 03 e 04 posteriormente acrescentaram esses comportamentos. O lint não valida HTML, e as verificações estruturais daquela etapa não substituíam teste de navegador ou tecnologias assistivas.
