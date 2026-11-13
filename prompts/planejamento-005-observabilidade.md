# Planejamento — tarefa 005: observabilidade

Leia `AGENTS.md`, `.spec/README.md`, `.spec/projeto.md`,
`.spec/tarefas/005-observabilidade.md`, `docs/guia-uso-de-ia.md` e os
requisitos B-OPE-03, B-OPE-04 e B-OPE-05 em `docs/requisitos-projeto-b.md`.
Use somente os arquivos ativos do projeto; `x/` é material de referência,
não fonte da implementação atual. Se algum caminho citado estiver ausente,
registre isso como fato observado e não presuma seu conteúdo.

Daniel declarou ser responsável pelas escolhas desta tarefa. Preserve a
responsabilidade decisória dele: apresente alternativas e uma recomendação
fundamentada para decisão, mas não transforme a recomendação em decisão da
equipe nem altere o estado da tarefa como se as escolhas estivessem alinhadas.

Inspecione o estado do Git, `package.json` e `package-lock.json`, configuração
de execução e implantação (incluindo Docker/Compose), código ativo em
`backend/src/`, testes existentes, documentação e qualquer configuração de
monitoramento já presente. Verifique como a aplicação inicia, como as rotas
respondem a falhas dos provedores e quais dados podem aparecer nos logs.
Separe claramente requisito da fonte, fato observado, hipótese e decisão
pendente. A fonte não escolhe biblioteca, métrica, indicador de SLO, janela
ou meta numérica; exemplos de ferramentas não são obrigações.

## Entrega do planejamento

Apresente um diagnóstico curto e uma comparação de opções que cubra:

1. Logs estruturados: formato e biblioteca (incluindo a opção de não adicionar
   dependência), contexto útil, correlação de requisições, níveis, tratamento
   de erros e impacto em rotas, serviços e testes.
2. Segurança e privacidade: quais campos podem ser registrados, quais devem
   ser omitidos ou mascarados (por exemplo, query strings, nomes de cidades,
   coordenadas, cabeçalhos, corpos e mensagens que possam conter URLs), risco
   de vazamento de segredos, volume, cardinalidade e custo. Não proponha
   registrar payloads ou dados pessoais sem necessidade demonstrada.
3. Métrica: pelo menos duas opções proporcionais ao projeto, como contadores
   internos ou exposição em endpoint compatível com Prometheus. Explique para
   cada uma o que mede, como será lida/coletada na implantação atual, limitações
   de processo único ou múltiplas réplicas, custo e se requer serviço externo.
   Diferencie métrica exposta pela aplicação de métrica efetivamente coletada.
   Proponha labels de baixa cardinalidade (por exemplo, método, rota
   normalizada e classe de status) e evite valores de usuário como labels.
4. SLO: proponha indicadores candidatos, modo de cálculo, fonte de dados e
   janelas possíveis. Explique o que a métrica escolhida consegue sustentar e
   quais evidências seriam necessárias. Não invente disponibilidade, latência,
   taxa de erro, período ou meta numérica: liste as decisões que Daniel precisa
   tomar antes de declarar o SLO.
5. Opções recomendadas: compare alternativas por simplicidade, segurança,
   confiabilidade, custo operacional, compatibilidade com Node/Express e
   adequação ao Compose existente. Recomende um caminho mínimo e explique
   trade-offs e por que alternativas mais complexas não se justificam (ou em
   que condição passariam a fazer sentido). Não adicione serviços ou dependências
   como se fossem requisitos.
6. Escopo de impacto: liste arquivos prováveis, mudanças em rotas/serviços,
   configuração e testes; identifique impactos nas frentes geográfica e
   climática e a necessidade de alinhamento, sem editar arquivos.
7. Plano verificável: critérios de aceite observáveis, validações locais e
   evidências a registrar. Inclua testes para campos estruturados, mascaramento,
   contagem/leitura da métrica e respostas sob sucesso/erro, conforme a opção
   recomendada. Distinga testes mockados de consultas reais a provedores e não
   execute carga nem prometa disponibilidade contínua.

Considere no diagnóstico, sem pressupor que devam ser alterados: `app.js` tem
`/api/v1/health` que chama o IBGE e responde HTTP 200 tanto em `healthy` quanto
em `degraded`; a rota climática registra erros com `console.log`; os serviços
IBGE e Open-Meteo também registram erros diretamente; `httpClient.js` faz
retentativas; o Compose atual declara API e frontend, sem coletor de métricas.
Confirme esses fatos no código antes de usá-los e examine se logs ou métricas
podem expor URLs, entradas de usuário ou dados sensíveis.

Não edite código, dependências, configuração, documentação da tarefa ou
decisões da equipe durante esta etapa de planejamento. Não execute testes,
instale pacotes, consulte provedores ou faça alterações externas. Entregue o
diagnóstico, as opções comparadas, a recomendação, as decisões ainda abertas e
os arquivos previstos; aguarde a decisão e autorização explícita de Daniel
antes de qualquer implementação. Não registre planejamento como implementação
ou validação concluída.
