# Fechamento do Projeto B — implementação, documentação e apresentação

**Execução nesta conversa:** Kaio autorizou implementar este prompt em
2026-11-12. A autorização veio da conversa, não da existência do arquivo.
Estado, resultados e pendências estão na tarefa
`.spec/tarefas/008-fechamento-apresentacao.md`. As instruções de aprovação
abaixo descrevem o fluxo; não exigem repetir uma autorização já concedida.

## Pedido de Kaio e resultado esperado

O solicitante é Kaio Bruno Soares dos Santos. Quero concluir, com Daniel, a
API Dados Climáticos do Projeto B e preparar os materiais para estudarmos e
gravarmos o vídeo de apresentação em **2026-11-13**, conforme este planejamento.
Priorize as pendências que impedem a entrega, preserve o trabalho existente e
mantenha a solução pequena e explicável pelos dois participantes.

Este prompt foi solicitado para orientar o fechamento. Sua criação e leitura
não autorizam implementar as mudanças propostas. **Comece pelo diagnóstico e
plano; obtenha autorização explícita de Kaio antes de implementar.** Após essa
autorização, conduza as subetapas aprovadas até concluir, resolvendo escolhas
rotineiras sem pedir confirmações repetidas. Apresente necessidades de ampliação
de escopo ou de alinhamento com Daniel antes de executá-las.

## 1. Fontes e inspeção inicial

Leia `AGENTS.md`, `docs/guia-uso-de-ia.md`, `.spec/README.md`,
`.spec/projeto.md`, `docs/requisitos-projeto-b.md` e as tarefas pertinentes em
`.spec/tarefas/`, especialmente 001, 004, 005, 006 e 007. Siga as orientações
de `Agente.md`: na preparação deste prompt ele foi localizado em
`X/Agente.md`. Se estiver em outro caminho, localize-o antes de concluir que
está ausente. Use `X/` somente para essa referência de instruções, nunca
como evidência da implementação atual.

Confira branch, commit, `git status`, alterações locais, `package.json`,
lockfile, código ativo em `backend/src/`, testes, frontend, Dockerfiles,
Compose, configuração do Prometheus, Jest, lint e CI. Leia README,
CONTRIBUTORS e a documentação pertinente em `docs/`.

Daniel responde pela área geográfica, provedores e preparação Docker;
Kaio, pela área climática e inicialização. Proponha a responsabilidade pela
tarefa transversal de fechamento sem declarar consenso ainda não registrado.
Explique impactos em arquivos compartilhados e obtenha o alinhamento exigido
antes de alterar a frente de Daniel.

Use estes pontos apenas como **referências anteriores a confirmar**:

- As tarefas 005 e 006 registram observabilidade, documentação e smoke test.
- Há registro de 7 suítes/42 testes, 89,47% de declarações e mínimo global de
  80%; os números descrevem aquela execução, não uma nova validação.
- O relatório k6 registra p95 de 1,47 s, com 1 VU e 10 requisições reais.
- O SLO declarado é 95% em janela móvel de 7 dias; não há comprovação de
  cumprimento dessa janela nos registros consultados.
- SOLID, pattern, `.env.example`, verificação de segredos e scrape em Compose
  precisam ter seu estado atual confirmado. Há resumos documentais antigos.
- Kaio forneceu uma conclusão que informa CI #5 verde no commit `d6ae88d`:
  `https://github.com/DevKaioBrunu/API_Dados_Climaticos/actions/runs/43300946340`.
  Confirme a execução antes de apresentá-la como verificação própria; ela
  não comprova alterações posteriores ao commit indicado.

## 2. Primeira entrega: diagnóstico e plano para autorização

Apresente uma matriz curta com requisito, estado observado, evidência,
pendência, solução mínima, arquivos afetados, responsável proposto e
validação prevista. Diferencie requisito do curso, decisão da equipe,
resultado anterior, fato observado e hipótese.

Organize o plano em: pendências técnicas, validação final, documentação,
estudo/apresentação e entrega externa. Indique o que exige código, o que
pode ser resolvido documentando código existente e o que é uma limitação
declarada. Priorize o necessário para a gravação planejada.

Proponha uma especificação única de fechamento em `.spec/tarefas/`, com
numeração livre confirmada, checklist e histórico. Liste os artefatos de
estudo e roteiro previstos abaixo. Nesta primeira etapa não edite arquivos,
instale ferramentas, inicie serviços nem execute consultas reais.

Peça autorização para o plano concreto, incluindo as verificações locais,
subida do Compose e consultas reais de baixo volume previstas. A exigência
de autorização vem de `AGENTS.md` e de `Agente.md`; explique isso brevemente.

## 3. Subetapas a executar após autorização

### A. SOLID e um pattern com evidência no código

- Relacione os princípios SOLID a arquivos e funções concretos, com uma
  explicação curta do benefício e dos limites. Não atribua ao código
  propriedades que ele não possui; justifique princípios sem aplicação
  pertinente neste escopo e apresente lacunas reais.
- Identifique um pattern reconhecível, seus participantes, o problema
  resolvido, a alternativa considerada e o custo. Avalie Adapter ou Facade
  somente se o comportamento atual sustentar essa classificação. A simples
  presença de pastas de rotas e serviços não comprova um pattern específico.
- Aproveite soluções existentes. Se faltar implementação, proponha o menor
  ajuste necessário no plano, com testes de comportamento pertinentes.
  Preserve contratos HTTP e evite abstrações criadas apenas para a avaliação.
- Documente as evidências em `docs/design.md`, ou em documento equivalente
  já existente, e vincule ao README. Preserve o ADR de observabilidade;
  registre outra decisão somente se ela realmente ocorrer.

### B. `.env.example` utilizável e configuração reproduzível

- Levante as variáveis realmente lidas pela aplicação e usadas na execução.
  Crie o exemplo somente com valores públicos e comentários úteis.
- Confira defaults, portas e diferenças entre Node local e Compose.
  Documente como configurar e carregar as variáveis no ambiente suportado;
  não presuma que copiar `.env.example` para `.env` faça o Node carregá-lo.
- Diferencie interpolação do Compose de variáveis recebidas pelo container.
  Preserve a execução padrão com um comando e verifique a exceção de
  `.env.example` no `.gitignore`. Prefira os recursos já disponíveis.
- Verifique o efeito de uma configuração pública alternativa e a execução
  padrão quando aplicável, sem adicionar testes que apenas repitam o arquivo.

### C. Verificação de segredos com resultado documentado

- Examine arquivos versionados e histórico/refs disponíveis usando ferramenta
  adequada já disponível. Caso falte ferramenta, explique a alternativa e
  suas limitações; justifique qualquer instalação antes de realizá-la.
- Mantenha valores sensíveis fora de terminal compartilhado, relatório e
  prompt. Registre método, escopo, referências examinadas e achados redigidos.
  Não leia arquivos pessoais ignorados sem necessidade e autorização.
- Diferencie suspeitas e falsos positivos; informe limitações como clone
  raso ou refs ausentes. Uma busca parcial não prova ausência universal.
- Se encontrar credencial, comunique a necessidade de revogação/rotação ao
  responsável. Não reescreva histórico, apague evidências ou altere segredos.

### D. Compose, fluxo real e observabilidade

- Confirme o estado dos serviços existentes antes de iniciar processos.
  Valide a configuração e suba API, frontend e Prometheus conforme o plano.
- Demonstre o fluxo climático no navegador, uma consulta de cidades e o
  health. Verifique os corpos das respostas: health HTTP 200 com `degraded`
  representa disponibilidade limitada. Se o navegador não estiver disponível,
  registre a lacuna e forneça um checklist manual; chamadas HTTP não comprovam
  cliques e renderização.
- Confirme o alvo `api` como `UP` no Prometheus e o incremento de
  `api_http_requests_total` após requisições, com dados efetivamente coletados.
  Confira um log JSON da requisição e documente o resultado sem dados sensíveis.
- Preserve a porta de métricas interna e a interface do Prometheus local.
- Explique indicador, fórmula, exclusão de `4xx` e health, inclusão de `503`,
  janela e meta do SLO. O requisito pede declarar o SLO: não espere sete dias
  para concluir a entrega nem apresente uma amostra curta como meta cumprida.
- Preserve volumes e serviços preexistentes. Registre o que foi iniciado e
  encerre somente processos temporários pertinentes, sem apagar dados.

### E. Verificação final e evidências

Confira os scripts atuais e execute as verificações aprovadas, normalmente:

```bash
npm run lint
npm run test:coverage -- --ci --runInBand
docker compose config --quiet
git diff --check
```

Execute `npm ci` se necessário para uma instalação reproduzível pelo lockfile.
Para as consultas reais, confira antes o conteúdo de `npm run check-routes`.
Use o smoke test existente `k6 run scripts/k6-smoke.js` quando uma alteração
afetar o caminho medido ou houver motivo concreto para atualizar a medição.
Evite carga adicional sem necessidade.

Registre comandos, ambiente, data, resultados, falhas e limitações. Preserve
Jest/Supertest, mocks na suíte padrão, o piso aprovado e as exclusões
justificadas. Adapte testes somente quando necessários para alterações de
comportamento; não reduza o piso para obter aprovação.

Vincule a evidência remota de CI ao commit correspondente. Se o trabalho
local ainda não estiver no GitHub, mantenha a validação remota dessa versão
pendente e deixe instruções concretas para o responsável após o envio
autorizado. Reúna commits/PRs existentes por participante sem inventar autoria
ou exigir PR adicional sem confirmação da regra do curso.

### F. Documentação de fechamento

- Atualize README, `.spec/projeto.md`, tarefas afetadas, `CONTRIBUTORS.md` e
  `docs/ia.md`, preservando o histórico e os créditos da base acadêmica.
- Separe resultados históricos dos atuais: 90,85% e 89,47% pertencem a
  execuções diferentes. Inclua data, contexto e link do CI quando confirmado.
- Confira coerência entre OpenAPI, código, comandos de execução,
  observabilidade, ADR e relatório de desempenho. Atualize somente o necessário.
- Registre o método e resultado da verificação de segredos sem valores
  sensíveis. Marque aceite somente com evidência; limitações permanecem visíveis.
- Relacione cada requisito às evidências em uma matriz compacta na
  especificação de fechamento, evitando repetir toda a documentação.

## 4. Material de estudo para Kaio e Daniel

Prepare `docs/guia-estudo-apresentacao.md`, com explicações claras e referências
aos arquivos reais, contendo:

1. Mapa do fluxo: navegador → Nginx → Express → IBGE → geocodificação
   Open-Meteo → previsão → resposta. Explique separadamente o catálogo de
   municípios que o frontend busca diretamente no IBGE, se isso for confirmado.
2. Parte de Kaio: clima, inicialização, integração e contribuições de
   frontend, testes e CI que tenham autoria comprovada.
3. Parte de Daniel: geografia, provedores, cliente HTTP, Docker,
   observabilidade e documentação/desempenho conforme evidências de autoria.
4. Conceitos que ambos devem compreender: SOLID, pattern, ADR, mocks versus
   integração interna versus consulta real, cobertura, CI, logs, contador,
   SLI/SLO, p95 e limitações de uma amostra de dez requisições.
5. Perguntas prováveis da avaliação, respostas curtas e arquivo/trecho que
   sustenta cada resposta. Inclua uso de IA e o que veio da base reaproveitada.
6. Limitações confirmadas, incluindo dependência de provedores e consulta de
   clima por nome com possível divergência de UF para cidades homônimas.
7. Plano de estudo e ensaio para a dupla, com ordem de leitura, revisão
   individual, explicação recíproca e um ensaio cronometrado. Indique estimativas
   de duração como sugestões, sem inventar disponibilidade dos participantes.

## 5. Roteiro de vídeo de dez minutos

Prepare `docs/roteiro-apresentacao.md`, com tempo, participante proposto,
fala sugerida, ação/comando, tela a mostrar e evidência. Distribua a fala para
que cada participante defenda sua contribuição; a dupla confirma a divisão.
Use este roteiro do curso:

| Tempo | Conteúdo | Divisão proposta, sujeita às evidências |
|---|---|---|
| 00:00–01:00 | Problema, Projeto B, equipe e reaproveitamento | Kaio abre; ambos se identificam. |
| 01:00–04:00 | Subir aplicação e demonstrar respostas | Daniel mostra Compose e cidades; Kaio mostra clima e JSON pela interface. |
| 04:00–07:00 | Uma decisão técnica, alternativa e trade-offs | Daniel apresenta o ADR de observabilidade; Kaio conecta o fluxo, SOLID e pattern comprovados. |
| 07:00–10:00 | Números, limites e o que fariam diferente | Kaio mostra testes/cobertura e CI; Daniel explica p95, métrica e SLO; ambos concluem suas contribuições. |

O roteiro deve ser executável com comandos conferidos, links e telas na ordem
de uso. Reserve os detalhes de estudo para o guia, mantendo a fala dentro do
tempo total. Use somente números com evidência; uma nova execução pode mudar
o resultado. Para builds demorados, proponha imagens preparadas antes da
gravação e explicite essa preparação ao demonstrar o comando de subida.

Inclua checklist antes da gravação: versão/commit, serviços e internet,
consulta real prévia, áudio, legibilidade, janelas sem credenciais, divisão
de falas e cronômetro. Prepare uma alternativa transparente se o provedor
falhar: mostrar o tratamento de erro e evidência anterior com data/contexto,
identificando-a como anterior. Preserve a exigência de demonstrar o fluxo real;
uma simulação ou evidência antiga não comprova nova execução bem-sucedida.

## 6. Entrega e encerramento

Prepare `docs/checklist-entrega.md`, com links do repositório, README, CI
verde, desempenho, CONTRIBUTORS, documentação relevante e vídeo quando houver.
Separe fechamento técnico, revisão humana, integração autorizada no GitHub,
conferência do CI final, gravação e envio oficial ao Moodle.

O consolidado informa entrega/vídeo até 13/11, sem ano, horário-limite ou fuso.
Registre a necessidade de a dupla confirmar esses detalhes no Moodle. A data
de gravação planejada acima não comprova o prazo oficial. A apresentação é
opcional nos requisitos, mas a dupla escolheu preparar o vídeo.

Não faça commit, push, merge, publicação nem envio ao Moodle sem autorização
específica. Não invente PRs, métricas ou autoria. Não amplie o Projeto B nem
execute refatorações amplas, trocas de ferramentas ou correções automáticas
de dependências sem necessidade e aprovação.

Ao terminar as subetapas autorizadas, informe: o que foi analisado, alterações
realizadas, arquivos envolvidos, comandos/resultados, limitações, pendências
e próximas ações humanas. Diga explicitamente se o fechamento técnico está
completo ou quais critérios faltam, e se o material de estudo e vídeo está
pronto para revisão. Use links dos arquivos; não registre a preparação deste
prompt como implementação, ensaio, gravação ou entrega concluídos.
