# Refatoração do Frontend — API Dados Climáticos

## Fontes obrigatórias antes de iniciar

1. `AGENTS.md` — restrições permanentes do repositório.
2. `X/Agente.md` (ou `.github/agents/Agente.md`) — fluxo de trabalho, identidade, proibições e governança.
3. `docs/guia-uso-de-ia.md` — fluxo orientado a especificações, registros e evidências reais.
4. `.agents/skills/frontend/SKILL.md` — diretrizes de identidade visual distinta, tipografia autêntica, copywriting intencional e prevenção de clichês de IA.
5. `.agents/skills/frontend/SKILL_UIUX.md` — regras de UI/UX Pro Max (acessibilidade WCAG AA, alvos de toque, feedback de interação, performance/CLS, hierarquia e tokens).
6. `docs/requisitos-projeto-b.md` — requisitos de entrega do Projeto B, Compose de comando único (B-TEC-01), CI com lint (B-TEC-07).
7. Arquivos ativos de frontend e infraestrutura listados na seção "Código ativo envolvido".
8. `/var/home/devbruno/Downloads/lista_de_munic_pios_do_brasil.md` — material fornecido pelo solicitante para análise da cascata UF/município. Não é código ativo nem fonte completa de dados; verificar procedência e completude antes de qualquer uso operacional.

## Solicitante e responsabilidades

- **Solicitante:** Kaio Bruno Soares dos Santos.
- **Frente:** Interface web do usuário (Frontend estático servido via Nginx no Docker Compose).
- **Atribuição:** Tarefa de melhoria transversal solicitada por Kaio. Toda contribuição, plano e registro de IA desta atividade deve identificar Kaio Bruno Soares dos Santos como solicitante.

> **Aviso de Governança:** Este prompt define o escopo, as diretrizes de design e a decomposição técnica para a refatoração do frontend. A existência deste documento **NÃO** constitui autorização automática para alterar código. Antes de implementar qualquer etapa, deve-se apresentar o diagnóstico e o plano detalhado a Kaio e aguardar sua autorização explícita.

---

## Objetivo da refatoração

Evoluir a interface web originada de um protótipo de teste de rotas para uma experiência de usuário polida, funcional e visualmente distintiva de consulta de dados climáticos e geográficos de cidades brasileiras. A Task 02 já reorganizou o HTML; o resultado ainda é JSON e o CSS/JavaScript de interação aguardam refatoração.

A interface deve:
1. Ter identidade visual temática autêntica ancorada na meteorologia e geografia brasileira, abandonando vícios de design genérico gerado por IA (conforme `.agents/skills/frontend/SKILL.md`).
2. Implementar alto padrão de usabilidade e acessibilidade WCAG AA (contraste >= 4.5:1, navegação por teclado, feedback imediato de loading, alvos de toque >= 44px, estados de erro orientadores, prevenção de layout shifts — conforme `.agents/skills/frontend/SKILL_UIUX.md`).
3. Apresentar os dados de clima (`temperatura_min`, `temperatura_max`, `condicao`), cidades e status do sistema (`health`) em componentes visuais claros e elegantes, mantendo uma visualização opcional de payload JSON técnico para preservar a utilidade de teste de rotas por desenvolvedores.
4. Preservar 100% da arquitetura leve em Vanilla HTML5/CSS3/JavaScript, servida estaticamente por Nginx no Docker Compose (`localhost:8080`), sem adicionar frameworks pesados de build e mantendo conformidade estrita com o linter (`npm run lint` / ESLint).
5. Tornar a cidade de consulta climática dependente da UF selecionada, com lista pesquisável de municípios válidos da UF, percorrível por rolagem e teclado.

## Ampliação solicitada antes da Task 03: localização em cascata

**Pedido de Kaio em 2026-11-11:** acrescentar UF → município à interface e à lógica de seleção. Esta atualização do prompt registra o novo escopo; não implementa a cascata nem autoriza antecipadamente as Tasks 03 e 04.

### Contratos e fonte de dados

- `GET /api/v1/cidades/:sigla_uf?limite=N` retorna `{ uf, quantidade_retornada, cidades: [{ nome }], consultado_em }` e hoje aceita no máximo **100** itens. O resultado padrão de 10, ou mesmo o limite 100, é insuficiente para uma lista completa de municípios de UFs como CE e SP. Não usar uma resposta parcial como se representasse todas as cidades da UF.
- O arquivo fornecido em Downloads contém 25 seções de UF e 4.773 linhas de municípios. Faltam Sergipe e Tocantins; a seção de São Paulo tem 62 nomes, embora seu índice declare 645. No Ceará, a seção inclui Fortaleza e Forquilha. Esses fatos foram conferidos no arquivo, sem validação da procedência ou atualização dos dados. Não copiá-lo para o produto nem afirmar que é cadastro completo.
- **Decisão pendente antes de implementar a cascata:** escolher e validar uma fonte completa para as 27 UFs, inclusive o tratamento do Distrito Federal/Brasília. Alternativas a avaliar no diagnóstico da etapa: catálogo estático versionado com origem, data e integridade conferidas, ou obtenção dinâmica completa por provedor/endpoint apropriado. Se a escolha exigir alterar o contrato da API ou integrar um novo provedor, apresentar a necessidade e pedir autorização de escopo antes de editar backend. Preservar a rota atual de cidades e seu limite enquanto não houver decisão aprovada.
- A rota de clima recebe **somente o nome** (`/api/v1/clima/:nome_cidade`) e não usa UF para desambiguar. A seleção na interface limita os nomes oferecidos, mas não garante por si só que o resultado climático corresponda à UF escolhida quando houver municípios homônimos. Confirmar `estado` na resposta, informar divergência e não exibir um resultado como se fosse da UF selecionada; caso seja necessária garantia no backend, planejar mudança contratual separada.

### Comportamento esperado

1. Sem UF selecionada, manter a cidade vazia/desabilitada e orientar “Selecione uma UF primeiro”. Desabilitar a consulta climática até uma cidade da UF estar confirmada.
2. Ao escolher uma UF válida, carregar a lista **completa** de municípios daquela UF, sinalizando carregamento, vazio e falha. Habilitar a busca somente quando a lista estiver pronta. Não confundir a quantidade limitada pela consulta de exibição de cidades com o catálogo da combobox.
3. Oferecer combobox/autocomplete pesquisável, não um `<select>` simples: abrir a lista ao acionar o campo, rolar verticalmente, filtrar enquanto a pessoa digita ignorando maiúsculas/minúsculas e acentos, e selecionar uma opção real. Digitação livre sem escolha de opção não autoriza consulta. Ao apagar o texto, voltar à lista completa da UF.
4. Ao trocar ou limpar a UF, limpar imediatamente texto e seleção de cidade, fechar/limpar opções anteriores e carregar somente a nova UF. Ignorar ou cancelar respostas atrasadas da UF anterior para impedir mistura de resultados. Atalhos de cidades devem definir a UF correspondente e selecionar a cidade **após** confirmação na lista carregada.
5. Implementar interação por teclado (setas, Enter, Escape, Tab), foco visível, rótulos, anúncio do número de resultados/estado e atributos ARIA de combobox/listbox/options coerentes com o estado real. A lista deve ter altura limitada e rolagem vertical acessível; estados de carregamento e erro não podem parecer opções selecionáveis.

**Aceite funcional novo:** CE → digitar “For” mostra Fortaleza, Forquilha e demais correspondências da lista completa; apagar a busca e rolar permite escolher outra cidade; CE → SP limpa a seleção e mostra apenas municípios de SP; sem UF a cidade não permite consulta. Verificar também acentos, teclado, resposta atrasada, falha de carregamento e divergência de UF na resposta climática. Não declarar esse aceite concluído antes da implementação e dos testes.

---

## Código ativo envolvido

| Arquivo | Papel atual | Impacto previsto na refatoração |
|---|---|---|
| `frontend/index.html` | Estrutura semântica da Task 02, ainda com campos de texto e visualizador JSON | Ajuste posterior, mediante escopo autorizado, para controle de UF, combobox de cidade, lista de opções e mensagens acessíveis. |
| `frontend/css/styles.css` | Folha de estilos com tema escuro genérico e classes do "SaaS-card kit" | Refatoração completa baseada em tokens CSS (`:root`), paleta temática com contraste WCAG AA, tipografia com escala e hierarquia intencionais, estados interativos, combobox, loading e layout responsivo mobile-first. |
| `frontend/js/api.js` | Cliente HTTP fetch com helper de URL base | Preservação da lógica de chamada com robustez em timeout, tratamento de erros HTTP e conformidade estrita com o ESLint (`/* exported ApiClient */`). |
| `frontend/js/app.js` | Manipulação DOM simplificada que apenas formata JSON em `<output>` | Implementação de componentes de renderização, estados assíncronos, alternância de visualização e cascata UF/município com seleção validada. |
| `frontend/Dockerfile` | Imagem Alpine Nginx copiando assets estáticos | Preservação da imagem e garantia de que nenhum asset essencial deixe de ser copiado. |
| `frontend/nginx.conf` | Configuração Nginx com proxy reverso de `/api/` para a API Node.js | Preservação integral do roteamento e dos headers HTTP. |
| `docker-compose.yml` | Orquestração Compose com API na 3000 e Frontend na 8080 | Validação da integração sem alteração necessária de portas ou serviços. |
| `eslint.config.cjs` | Configuração ESLint com regras para `frontend/js/**/*.js` | Garantia de que qualquer alteração em JS passe com zero erros em `npm run lint`. |

---

## Diretrizes das SKILLs integradas

### 1. Da `SKILL.md` (Frontend Design)
- **Ancoragem no tema:** O design deve respirar dados meteorológicos e espaciais do Brasil (céu, temperatura, clima tropical/temperado, estados e municípios brasileiros), em vez de parecer um SaaS financeiro ou corporativo genérico.
- **Antipadrões de IA a eliminar:**
  - Não utilizar rótulos *eyebrow* em caixa alta com espaçamento exagerado (*tracked ALL-CAPS*) sobre cada título.
  - Não utilizar o padrão repetitivo de *SaaS-card kit* (múltiplos cartões idênticos com o mesmo `border-radius: 24px`, mesma sombra cinza `rgba(0,0,0,.1)` e gradientes puramente decorativos).
  - Não usar construções de texto como `PALAVRA — fragmento` ou setas `→` mecânicas em links e botões.
  - Evitar paletas clichês de IA (fundo escuro azulado com brilho neon excessivo e sem função).
- **Sistema de tokens compacto:**
  - Paleta base com 4 a 6 valores hex nomeados em variáveis CSS (`--bg`, `--surface`, `--text`, `--text-muted`, `--primary`, `--border`, cores de estado semânticas).
  - Tipografia intencional: definir papéis claros para títulos e corpo, limitando o comprimento de linhas de leitura a menos de 80 caracteres.
- **Contenção e auto-crítica:** Gastar a ousadia visual no ponto focal da interface (o resultado do clima da cidade e o mapa conceitual de cidades), mantendo o formulário de controle quieto, limpo e direto.
- **Copywriting intencional:**
  - Textos sob a perspectiva do usuário e em voz ativa ("Consultar clima", "Buscar cidades", "Verificar disponibilidade").
  - Mensagens de erro orientadoras: explicar com clareza o que houve e como solucionar, sem jargões indecifráveis ou pedidos de desculpa vazios.
  - Estado vazio (*empty state*) acolhedor que convida à ação e sugere cidades de partida.

### 2. Da `SKILL_UIUX.md` (UI/UX Pro Max)
- **Prioridade 1 — Acessibilidade (WCAG AA):**
  - Relação de contraste mínima de 4.5:1 para texto normal e 3:1 para texto grande e componentes visuais essenciais.
  - Vínculo obrigatório entre `<label for="...">` e `<input id="...">`.
  - Indicador de foco evidente (`:focus-visible`) em todos os elementos interativos; **proibido remover o outline de foco**.
  - Notificação acessível para leitores de tela em atualizações dinâmicas através de `aria-live="polite"` e atributos de estado `aria-busy`.
  - Ícones semânticos inline (SVG com `aria-hidden="true"` quando decorativos, ou com `aria-label` quando acionáveis).
- **Prioridade 2 — Toque e Interação:**
  - Dimensão mínima de 44×44px para botões, inputs e chips clicáveis.
  - Espaçamento de respiro mínimo de 8px entre controles para evitar cliques acidentais.
  - Feedback tátil/visual imediato em qualquer clique (estados `:hover`, `:active`, indicador de carregamento e estado `disabled` enquanto a requisição estiver pendente para evitar submissões duplicadas).
- **Prioridade 3 — Performance e Layout Stability (CLS):**
  - Evitar Cumulative Layout Shift (CLS < 0.1) reservando espaço mínimo estruturado para a área de resultados.
  - Sem layout thrashing no JavaScript; manipulação de DOM agrupada e limpa.
- **Prioridade 5 — Layout & Responsividade:**
  - Abordagem Mobile-First, assegurando visualização sem quebras e sem rolagem horizontal em telas de 320px até 4K.
- **Prioridade 7 — Animações e Movimento:**
  - Transições curtas e contextuais (150ms a 250ms, curvas de desaceleração naturais).
  - Obrigatoriedade de honrar `@media (prefers-reduced-motion: reduce)`.
- **Prioridade 8 — Formulários e Feedback:**
  - Validação clara na interface antes do disparo (ex.: validação de mínimo de 2 caracteres para cidade e sigla de UF válida de 2 letras).
  - Feedback visual distinto para sucesso (HTTP 200), erro de validação (HTTP 400), não encontrado (HTTP 404) e serviço indisponível (HTTP 503).

---

## Decomposição em 5 tasks sequenciais

### Task 01 — Diagnóstico e Especificação do Design System Temático

**Objetivo:** Elaborar e documentar o inventário visual, tokens CSS, paleta de cores, tipografia, wireframe e diretrizes de cópia sem alterar código ainda.

1. Inspecionar as respostas reais dos endpoints:
   - `/api/v1/clima/:cidade` → `{ nome, estado, clima: { temperatura_min, temperatura_max, condicao, unidades: { temperatura: "°C" } }, consultado_em }`.
   - `/api/v1/cidades/:sigla_uf?limite=10` → `{ uf, quantidade_retornada, cidades: [...], consultado_em }`.
   - `/api/v1/health` → `{ status: "healthy" | "degraded", versao, timestamp, motivo? }`.
2. Definir a paleta de 4 a 6 tokens semânticos (com contraste WCAG AA testado).
3. Desenhar o conceito de layout em wireframe ASCII com alinhamento, hierarquia e zonas de conteúdo:
   - Topo: Identificação do serviço com status de conexão discreto.
   - Painel de Ação: seleção de UF antes da cidade pesquisável, limite para a consulta de listagem e atalhos rápidos (*quick cities*) coerentes com a cascata.
   - Área Central de Resultado:
     - Visão Climática: destaque da cidade, temperatura mínima/máxima, condição com ilustração/ícone representativo.
     - Visão de Cidades: lista estruturada e escaneável com badge de total retornado; não confundir essa listagem limitada com a fonte completa da combobox.
     - Visão de Sistema: status de saúde com indicador visual claro.
     - Alternador (Toggle) de Visualização: Modo Amigável (Visual Formatado) vs. Modo Desenvolvedor (JSON Bruto).
4. Redigir o guia de copywriting para estados vazios, dicas nos inputs e mensagens de erro específicas para cada status HTTP (400, 404, 500, 503).

**Critérios de aceite:**
- [ ] Tokens de cores possuem contraste documentado compatível com WCAG AA.
- [ ] Wireframe ASCII apresentado com hierarquia clara e modo dual (Visual / JSON).
- [ ] Nenhum arquivo de código foi alterado nesta etapa.
- [ ] Plano aprovado explicitamente por Kaio antes de prosseguir para a Task 02.

---

### Task 02 — Refatoração Semântica e Acessibilidade do HTML

**Arquivo envolvido:** `frontend/index.html`

1. Estruturar o documento com elementos semânticos HTML5 (`<header>`, `<main>`, `<section>`, `<form>`, `<output>`).
2. Remover o rótulo genérico *eyebrow* em caixa alta.
3. Vincular explicitamente todos os campos `<input>` aos seus respectivos `<label>` por meio de `for` e `id`.
4. Incluir textos de ajuda acessíveis (`<small>` ou `<span class="hint">`) com `aria-describedby` para orientar formatos aceitos (ex: "Sigla com 2 letras, ex: CE, SP").
5. Configurar alvos de toque com dimensão mínima de 44×44px nos botões e nos seletores rápidos de cidades.
6. Adicionar regiões dinâmicas acessíveis:
   - `aria-live="polite"` e `aria-atomic="true"` na área de status e de resultados para anúncio adequado a leitores de tela.
   - Atributos `aria-busy` durante carregamentos.
7. Implementar o container de controle da alternância entre "Visual Formatado" e "JSON Bruto".
8. Inserir SVGs semânticos e inline para as principais condições climáticas e ícones de navegação (evitando emojis crus como elementos estruturais de interface).

**Critérios de aceite:**
- [ ] HTML válido e semântico sem dependências de frameworks externos.
- [ ] 100% dos inputs possuem labels devidamente associados.
- [ ] Teclado navega por todos os elementos interativos na ordem lógica de tabulação.
- [ ] Controles e chips possuem área clicável >= 44×44px.
- [ ] Regiões dinâmicas possuem atributos ARIA apropriados.

---

### Task 03 — Refatoração de Estilos, Responsividade e Estrutura da Combobox

**Arquivos envolvidos:** `frontend/css/styles.css` e, se a fonte completa estiver definida e aprovada, ajuste estritamente necessário de `frontend/index.html` para a combobox. A Task 02 foi concluída antes do pedido de cascata; sua marcação atual não contém lista de opções. A implementação de lógica permanece na Task 04.

1. Declarar o sistema de tokens CSS em `:root`:
   - `--bg-primary`, `--bg-surface`, `--bg-surface-hover`;
   - `--text-primary`, `--text-secondary`, `--text-muted`;
   - `--brand-primary`, `--brand-focus`;
   - `--status-ok`, `--status-warning`, `--status-error`;
   - `--radius-sm`, `--radius-md`, `--radius-lg`;
   - Escala de espaçamento sistemática (8px, 12px, 16px, 24px, 32px).
2. Definir tipografia legível, com tamanho base de 16px e altura de linha de 1.5, garantindo que textos descritivos não ultrapassem 80 caracteres por linha.
3. Estilizar estados interativos completos:
   - `:hover` com feedback sutil e natural.
   - `:focus-visible` com anel de foco destacado e contrastante (nunca usar `outline: none` sem substituto visível).
   - `:disabled` para botões durante carregamento com cursor indicativo (`not-allowed`).
4. Criar componentes estilizados para os resultados:
   - **Card de Clima:** Destaque tipográfico para a temperatura atual/máxima/mínima, badge estilizado para a condição meteorológica, nome do município e estado em evidência.
   - **Grid de Cidades:** Lista em grade responsiva, com visualização em chips ou cartões compactos de fácil leitura.
   - **Painel de Health:** Emblema com pulso discreto e indicador de status de saúde da API.
   - **Visualizador JSON:** Área de código limpa, com tipografia monoespaçada legível, bordas suaves e controle de rolagem interno sem estourar o layout da página.
5. Construir layout responsivo mobile-first:
   - 320px–768px: coluna única vertical, botões e inputs confortáveis para toque, chips de cidades com wrap fluido.
   - 769px–1024px: grade de duas colunas balanceada (controles à esquerda, visualização à direita).
   - 1025px+: layout centralizado com largura máxima controlada e respiro visual.
6. Aplicar regra `@media (prefers-reduced-motion: reduce)` anulando transições e transformações para usuários com sensibilidade a movimento.
7. Definir a estrutura HTML da futura combobox e seus estilos: lista com altura máxima e `overflow-y: auto`, item ativo/selecionado distinguível, foco visível, estados desabilitado/carregando/vazio/erro e posicionamento sem corte ou rolagem horizontal em 320px. Manter a interface atual utilizável durante a etapa; não declarar a cascata funcional após editar marcação e estilos.

**Critérios de aceite:**
- [ ] Nenhum valor de cor hexadecimal cru espalhado pelas classes (uso exclusivo de variáveis CSS semânticas).
- [ ] Contraste visual de textos e componentes atende à norma WCAG AA (>= 4.5:1).
- [ ] Layout fluido e estável (CLS < 0.1), sem surgimento de barra de rolagem horizontal em nenhuma resolução entre 320px e 2560px.
- [ ] `:focus-visible` claramente perceptível em todos os elementos focáveis via teclado.
- [ ] `@media (prefers-reduced-motion)` respeitado.
- [ ] Estrutura e lista da combobox preparadas visualmente sem corte e com rolagem vertical, depois de definida a marcação compatível.

---

### Task 04 — Refatoração de Interação, UX e Estados no JavaScript

**Arquivos envolvidos:** `frontend/js/app.js` e `frontend/js/api.js`; ajuste pontual de `frontend/index.html` se a implementação da combobox revelar necessidade semântica não prevista na Task 03.

1. **Requisitos de conformidade com Linter (ESLint):**
   - Manter declaração de escopo em `frontend/js/api.js` (`/* exported ApiClient */`).
   - Manter `ApiClient` como global no `frontend/js/app.js` (conforme definido em `eslint.config.cjs`).
   - Não introduzir variáveis não utilizadas ou funções não declaradas.
   - Executar sem advertências no comando `npm run lint`.
2. **Gerenciamento de Estados de Requisição:**
   - Implementar estado de *loading*: desabilitar temporariamente os botões de ação e exibir indicador visual de carregamento (spinner sutil ou texto de status "Consultando provedores...") para dar feedback imediato à pessoa usuária.
   - Liberar os botões assim que a requisição for concluída ou falhar.
3. **Renderização Rica e Modular:**
   - Função `renderWeather(data)`: monta o template visual do clima (cidade, estado, temperaturas mínima e máxima, condição climática e data/hora da consulta formatada em padrão brasileiro).
   - Função `renderCities(data)`: monta a listagem amigável de municípios, exibindo o total retornado e badges/itens individuais para cada cidade.
   - Função `renderHealth(data)`: exibe o status de saúde da aplicação de forma amigável, destacando se o serviço está operando normalmente ou em estado degradado.
   - Função `renderRawJson(data)`: atualiza o bloco de JSON técnico formatado com indentação de 2 espaços.
4. **Alternância Dinâmica entre Modos:**
   - Adicionar listener no controle de abas/toggle ("Visão Formatada" vs. "JSON Técnico"), permitindo alternar a exibição sem necessidade de refazer a requisição HTTP.
5. **Tratamento Resiliente e Construtivo de Falhas:**
   - Traduzir os códigos de erro da API (conforme `buildErrorHint`) em orientações claras para o usuário na interface:
     - `400`: Alerta sobre dados de entrada inválidos (ex.: nome de cidade com menos de 2 letras ou UF diferente de 2 caracteres).
     - `404`: Informação amigável de cidade ou UF não localizada.
     - `503`: Alerta específico indicando se o serviço do IBGE ou Open-Meteo está temporariamente indisponível, orientando nova tentativa em instantes.
     - Falha de conexão: Instrução para verificar se a API está em execução no endereço indicado.
6. **Cascata UF/município:** após resolver a fonte completa e a marcação necessária, carregar os municípios da UF, filtrar sem diferenciar caixa/acentos, controlar seleção real, limpar seleção ao mudar UF, proteger contra respostas atrasadas e adaptar os atalhos rápidos. Antes da consulta climática, confirmar cidade selecionada e UF; após a resposta, verificar `estado` para não apresentar uma UF divergente como correta. Implementar teclado e ARIA da combobox junto ao comportamento, sem usar os 10/100 primeiros municípios como catálogo completo.

**Critérios de aceite:**
- [ ] Feedback visual de carregamento disparado imediatamente após o clique.
- [ ] Botões desabilitados durante o trânsito da requisição para evitar requisições redundantes.
- [ ] Dados de clima, cidades e health renderizados em componentes visuais dedicados.
- [ ] Modo JSON técnico acessível a qualquer momento com o clique de um botão/aba.
- [ ] Mensagens de erro orientam o usuário sem jargões indecifráveis.
- [ ] `npm run lint` executa sem nenhum erro ou aviso no código JavaScript do frontend.
- [ ] Combobox permite busca, rolagem, teclado e seleção válida; troca de UF elimina seleção e resultados antigos, inclusive diante de respostas fora de ordem.

---

### Task 05 — Validação Visual, Execução com Docker e Registros

**Objetivo:** Validar o funcionamento de ponta a ponta na infraestrutura do projeto, assegurar que nenhum contrato foi quebrado e registrar os resultados reais.

1. **Validação de Código e Linter:**
   ```bash
   npm run lint
   ```
2. **Validação de Testes do Backend:**
   Garantir que a refatoração do frontend não afetou nenhuma suíte de testes da API:
   ```bash
   npm test -- --runInBand
   ```
3. **Validação no Docker Compose:**
   Verificar a integridade do build do Nginx e a entrega dos arquivos estáticos:
   ```bash
   docker compose config
   docker compose build frontend
   ```
4. **Verificação no Navegador:**
   - Testar o fluxo completo em `http://localhost:8080/`:
     - Consulta de Health (`GET /api/v1/health`);
     - Consulta de Clima (`GET /api/v1/clima/Fortaleza` e via chips rápidos);
     - Consulta de Cidades (`GET /api/v1/cidades/CE?limite=10`);
     - Cascata CE → “For” → Fortaleza/Forquilha; limpar busca, rolar e selecionar; trocar para SP; testar ausência de UF, acentos, teclado e resposta atrasada.
     - Alternância para o modo "JSON Técnico";
     - Responsividade em dimensões mobile (375px), tablet (768px) e desktop (1280px);
     - Navegação exclusiva via teclado (`Tab`, `Shift+Tab`, `Enter`, `Space`);
     - Simulação de erro (ex.: cidade com 1 letra para HTTP 400).
5. **Atualização de Documentação e Registros:**
   - Atualizar `docs/ia.md` registrando o uso das SKILLs de frontend e UI/UX, as decisões visuais tomadas, as validações executadas e as limitações observadas.
   - Manter coerência com `CONTRIBUTORS.md` atribuindo a Kaio Bruno Soares dos Santos a iniciativa e aprovação da refatoração.

**Critérios de aceite:**
- [ ] `npm run lint` passa com 0 erros.
- [ ] Toda a suíte de testes do Jest permanece verde (100% de aprovação e cobertura inalterada).
- [ ] Docker Compose compila e executa o container de frontend estático sem falhas.
- [ ] Fluxo ponta a ponta no navegador opera com sucesso para todas as 3 rotas.
- [ ] Registros em `docs/ia.md` atualizados com dados fáticos, comandos e limitações.

---

## O que está FORA do escopo

- Não adicionar frameworks ou bibliotecas pesadas de frontend (React, Vue, Angular, Svelte, Tailwind CSS via npm build, Bootstrap, jQuery, etc.); a aplicação deve permanecer em Vanilla HTML5, CSS3 puro e JavaScript nativo, servida por Nginx.
- Não alterar as rotas da API, seus parâmetros, verbos HTTP ou payloads JSON retornados pelo backend.
- Não presumir que o arquivo em Downloads ou a rota limitada de cidades sejam uma fonte completa para a combobox. Eventual mudança de contrato ou provedor exige decisão e escopo próprios.
- Não modificar a porta do Nginx (`8080`) nem a porta da API Node.js (`3000`).
- Não alterar testes automatizados do backend nem serviços de integração (`ibge.js`, `weather.js`, `httpClient.js`).
- Não remover a capacidade de visualização técnica do JSON bruto.
- Não executar commits, push ou merge sem autorização prévia e explícita de Kaio.
- Não tratar este prompt como autorização para alterar código — aguardar aprovação explícita de Kaio para cada etapa.

---

## Fluxo de execução por etapa

Para cada uma das tasks acima, deve-se obrigatoriamente:
1. Inspecionar o código ativo relevante e confirmar o estado atual.
2. Apresentar o diagnóstico e o plano detalhado da task a Kaio.
3. Aguardar a autorização explícita de Kaio para implementar.
4. Realizar alterações cirúrgicas e estritamente limitadas ao escopo da task.
5. Executar as validações disponíveis e coletar evidências reais.
6. Apresentar os resultados, limitações e pendências.

## Formato obrigatório da resposta ao concluir cada task

1. **O que foi analisado:** arquivos e comportamentos inspecionados.
2. **O que foi alterado:** arquivos modificados e justificativa (somente se autorizado).
3. **Arquivos envolvidos:** listagem com caminhos relativos ao workspace.
4. **Validações executadas:** comandos executados com parâmetros e saídas reais.
5. **Resultados reais:** dados observados (sem inventar métricas ou aprovações).
6. **Limitações:** o que não foi possível testar ou validar no ambiente.
7. **Pendências:** decisões abertas ou próximas ações necessárias.
8. **Próximos passos:** sugestão da próxima task da sequência.

Se algo não foi validado, declarar textualmente: "não executado", "não confirmado", "hipótese" ou "pendente de validação".
Nunca apresentar intenção ou planejamento como resultado concluído.
