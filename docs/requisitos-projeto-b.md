# Projeto B — Requisitos do projeto final Full Cycle

## 1. Finalidade e limites deste documento

Este documento consolida os requisitos específicos do Projeto B (nível simples) e as regras gerais de entrega e avaliação que também se aplicam a ele.

Fonte: `projeto-fullcycle-final.md`, documento “Projeto final — Full Cycle — Módulo 4 · Encontro 24”.

Regras de leitura para pessoas e assistentes de IA:
- Os identificadores abaixo servem apenas para organização e rastreabilidade desta consolidação; não constam no original.
- Não ampliar o escopo com exigências exclusivas do Projeto A.
- Ferramentas apresentadas como exemplos não são escolhas obrigatórias de implementação.
- Não inventar domínio, endpoints, percentual de cobertura, meta de SLO, limite de p95 ou tecnologias que o original não define.
- As datas são reproduzidas sem ano, porque o documento original não informa o ano.
- As ambiguidades da fonte estão explicitadas na seção 9; não devem ser tratadas como requisitos resolvidos.

## 2. Escopo funcional

| ID | Requisito |
|---|---|
| B-ESC-01 | Implementar uma API de domínio único. O domínio é de livre escolha; pedidos, biblioteca e agenda são apenas exemplos da fonte. |
| B-ESC-02 | Entregar um fluxo principal funcionando de ponta a ponta, de verdade. |
| B-ESC-03 | Manter o escopo simples: sem exigência de decomposição em módulos e sem exigência de volume de dados. |

O projeto final consolida o trabalho já desenvolvido; entregáveis anteriores podem ser reaproveitados. A prioridade é demonstrar engenharia e funcionamento, não tamanho.

## 3. Requisitos técnicos

### 3.1. Base e qualidade

| ID | Origem | Requisito |
|---|---|---|
| B-TEC-01 | M1 | Disponibilizar Compose que permita subir a aplicação com um único comando. |
| B-TEC-02 | M1 | Aplicar SOLID. |
| B-TEC-03 | M1 | Aplicar um pattern e justificar sua escolha. |
| B-TEC-04 | M2 | Implementar testes unitários do domínio. |
| B-TEC-05 | M2 | Implementar um teste de integração. |
| B-TEC-06 | M2 | Declarar e respeitar um mínimo de cobertura de testes. A fonte não fixa um percentual. |
| B-TEC-07 | M3 | Entregar CI verde, com instalação de dependências, lint e testes (`install`, `lint`, `test`). |

### 3.2. Operação e observabilidade

| ID | Origem | Requisito |
|---|---|---|
| B-OPE-01 | M3 | Manter `.env.example` no repositório. |
| B-OPE-02 | M3 | Manter segredos fora do repositório. |
| B-OPE-03 | M3 | Implementar logs estruturados. |
| B-OPE-04 | M3 | Disponibilizar uma métrica. A fonte não define qual. |
| B-OPE-05 | M3 | Declarar um SLO simples. A fonte não define indicador ou meta numérica. |

### 3.3. Documentação e desempenho

| ID | Origem | Requisito |
|---|---|---|
| B-DOC-01 | M4 | Manter README desde o primeiro dia. |
| B-DOC-02 | Regra geral | Declarar o nível Projeto B na primeira linha do README. |
| B-DOC-03 | Entrega | Informar no README o nível, como subir a aplicação e como executar os testes. |
| B-DOC-04 | M4 | Produzir um ADR. |
| B-DOC-05 | M4 | Documentar o endpoint principal em OpenAPI. |
| B-DES-01 | M4 | Executar um smoke test com k6 e medir o p95. A fonte não fixa limite numérico de p95. |
| B-DES-02 | Entrega | Entregar `docs/desempenho.md`. A lista geral de entrega exige esse arquivo e não apresenta dispensa explícita para o Projeto B; ver seção 9. |

### 3.4. Ferramentas citadas apenas como exemplos

| Finalidade | Exemplos apresentados no trecho do Projeto B |
|---|---|
| Base e lint | Docker Compose, ESLint |
| Testes | Vitest ou Jest, Supertest |
| Cobertura | Vitest coverage (v8) |
| CI | GitHub Actions, ESLint |
| Configuração e proteção de segredos | dotenv, gitleaks |
| Observabilidade | pino, prom-client |
| Documentação e ADR | Markdown, template MADR |
| OpenAPI e desempenho | Swagger Editor, Spectral, k6 |

A presença nesta tabela não transforma uma ferramenta em obrigação. Compose, OpenAPI e smoke test com k6, por outro lado, aparecem expressamente nos requisitos da fonte.

## 4. Autoria e organização do trabalho

| ID | Requisito ou regra |
|---|---|
| B-AUT-01 | O trabalho pode ser individual ou em grupo de até três pessoas. |
| B-AUT-02 | O escopo exigido é o mesmo para trabalho individual e em grupo. |
| B-AUT-03 | A nota é individual. Commits e PRs no nome de cada participante são evidências de autoria. |
| B-AUT-04 | Entregar `CONTRIBUTORS.md`, informando quem fez o quê. |
| B-AUT-05 | Se houver apresentação, cada participante deve defender sua própria parte. |

A orientação geral para grupos é dividir o trabalho por módulo do sistema, e não por tarefa de nota. Isso não deve ser usado para impor decomposição modular ao Projeto B; ver seção 9.

## 5. Entrega e prazos

### 5.1. Cronograma

| Evento | Data informada na fonte |
|---|---|
| Diretrizes e escolha do nível | 05/11 |
| Entrega oficial pelo Moodle | Até 13/11 |
| Envio de vídeo, caso essa modalidade opcional seja escolhida | Até 13/11 |
| Apresentações ao vivo | 16/11 |

Commits posteriores a 13/11 não são avaliados. O original não informa ano, horário-limite ou fuso horário.

### 5.2. Itens exigidos na entrega

| ID | Item |
|---|---|
| B-ENT-01 | Link do repositório ou convite de acesso, caso seja privado. |
| B-ENT-02 | README com nível, instruções para subir e instruções para testar. |
| B-ENT-03 | Link de uma execução verde do CI. |
| B-ENT-04 | `docs/desempenho.md`. |
| B-ENT-05 | `CONTRIBUTORS.md`. |

A entrega oficial deve ser feita diretamente pelo Moodle até 13/11.

### 5.3. Artefatos e caminhos citados

| Artefato ou caminho | Situação na fonte |
|---|---|
| `docker-compose.yml` | Consta na estrutura esperada. |
| `README.md` | Consta na raiz da estrutura esperada; contém a identificação do nível e as instruções de execução e testes. |
| `.env.example` | Exigido explicitamente para o Projeto B. |
| `docs/adr/0001-decisao.md` | Caminho de ADR apresentado na estrutura esperada; o Projeto B exige um ADR. |
| `docs/openapi.yaml` | Consta na estrutura esperada e na observação específica do Projeto B. |
| `docs/desempenho.md` | Exigido na lista geral de entrega. |
| `CONTRIBUTORS.md` | Exigido nas regras de autoria e na lista de entrega. |
| `docs/ia.md` | Exigido para declarar os prompts relevantes utilizados com IA. |
| `src/` | Diretório apresentado na estrutura esperada. |
| `tests/` | Diretório apresentado na estrutura esperada. |
| `.github/workflows/ci.yml` | Caminho de CI apresentado na estrutura esperada; GitHub Actions também é citado como exemplo de ferramenta. |

A fonte também menciona README dentro de `docs/` para o Projeto B, embora a árvore geral apresente `README.md` na raiz. Ver seção 9 antes de interpretar isso como obrigação de duplicar o arquivo.

## 6. Uso de inteligência artificial

| ID | Requisito ou regra |
|---|---|
| B-IA-01 | O uso de IA é permitido e esperado. |
| B-IA-02 | Declarar em `docs/ia.md` os prompts que tiveram importância no desenvolvimento. |
| B-IA-03 | A responsabilidade pelas decisões continua sendo do autor do projeto. |
| B-IA-04 | O autor deve saber explicar o código: código que não sabe explicar não conta como seu para avaliação. |

## 7. Apresentação opcional

A apresentação não é requisito obrigatório de entrega. Pode gerar bônus de até 10 pontos.

Modalidades:
- Ao vivo, em 16/11.
- Vídeo enviado pelo Moodle até 13/11.

Roteiro de 10 minutos informado na fonte:

| Tempo | Conteúdo |
|---|---|
| 1 minuto | Problema e nível escolhido. |
| 3 minutos | Demonstração: subir a aplicação, executar e mostrar respostas. |
| 3 minutos | Uma decisão técnica e a alternativa descartada. |
| 3 minutos | Números obtidos e o que faria diferente. |

A alternativa descartada aparece expressamente nesse roteiro de apresentação. O trecho de requisitos técnicos do Projeto B pede um ADR, mas não detalha seu conteúdo obrigatório.

## 8. Avaliação

### 8.1. Rubrica aplicável ao Projeto B

| Critério | Peso informado |
|---|---|
| M1 — Funcionamento, código e design | 35 |
| M2 — Testes e CI verde | 20 |
| M3 — Ambientes, segredos e observabilidade | 15 |
| M4 — Arquitetura, documentação e desempenho | 30 |

A rubrica mantém o rigor de avaliação, mas deve ser aplicada às evidências exigidas para o Projeto B. O nome de um critério não acrescenta, por si só, exigências técnicas ausentes da seção específica desse nível.

### 8.2. Problemas destacados na fonte que prejudicam a nota

- Escopo inflado sem funcionamento real.
- CI vermelha ou inexistente.
- README que não permite subir a aplicação.
- Segredos commitados no repositório.
- Testes sem asserção e números sem medição.

## 9. Ambiguidades e limites de interpretação da fonte

### 9.1. Localização do README e conteúdo de `docs/`

A árvore geral coloca `README.md` na raiz. Logo abaixo, a observação específica diz: “No Projeto B, `docs/` tem README, 1 ADR e `openapi.yaml`, sem `c4/`.”

Isso deixa a localização do README ambígua. Esta consolidação preserva a exigência de README, mas não cria como obrigação definitiva a existência de dois READMEs.

### 9.2. Relatório de desempenho

A lista geral de entrega exige `docs/desempenho.md`. A observação sobre `docs/` do Projeto B não menciona esse arquivo, mas também não o dispensa expressamente.

Por esse motivo, o arquivo permanece nesta consolidação como item da lista geral de entrega. A fonte não define um modelo específico de relatório para o Projeto B. Não importar exigências de relatórios de outro nível.

### 9.3. Organização em grupo

A regra geral orienta dividir por módulo do sistema; o trecho específico do Projeto B dispensa decomposição em módulos. Preservar a identificação da contribuição individual sem transformar essa orientação geral em exigência de arquitetura modular.

### 9.4. Detalhes não definidos

A fonte não fixa:
- Domínio de negócio, rotas, payloads ou regras funcionais concretas.
- Linguagem, framework, banco de dados ou provedor de hospedagem.
- Percentual mínimo numérico de cobertura.
- Indicador e meta numérica do SLO.
- Qual métrica deve ser exposta.
- Limite de aprovação do p95.
- Duração, quantidade de usuários virtuais ou carga do smoke test.
- Versão obrigatória de OpenAPI para o Projeto B.
- Ano, horário-limite e fuso horário dos prazos.

Essas lacunas não autorizam uma IA a apresentar escolhas próprias como requisitos do curso.

## 10. Checklist consolidado

### Escopo e implementação
- [ ] API de domínio único.
- [ ] Um fluxo principal funcionando de ponta a ponta.
- [ ] Aplicação sobe por Compose com um comando.
- [ ] SOLID aplicado.
- [ ] Um pattern aplicado e justificado.

### Testes e CI
- [ ] Testes unitários do domínio.
- [ ] Um teste de integração.
- [ ] Mínimo de cobertura declarado e respeitado.
- [ ] CI verde com instalação, lint e testes.
- [ ] Link da execução verde separado para entrega.

### Operação e documentação
- [ ] `.env.example` versionado e segredos fora do repositório.
- [ ] Logs estruturados.
- [ ] Uma métrica.
- [ ] Um SLO simples declarado.
- [ ] README mantido desde o primeiro dia.
- [ ] Projeto B declarado na primeira linha do README.
- [ ] README explica como subir e testar.
- [ ] Um ADR.
- [ ] OpenAPI do endpoint principal.
- [ ] Um smoke test k6 executado, com p95 medido.
- [ ] `docs/desempenho.md` preparado, conforme lista geral de entrega.
- [ ] `CONTRIBUTORS.md` com as contribuições.
- [ ] Autoria individual demonstrável por commits e PRs.
- [ ] Prompts relevantes utilizados com IA registrados em `docs/ia.md`.

### Submissão
- [ ] Link do repositório ou convite de acesso disponível.
- [ ] Entrega feita no Moodle até 13/11.
- [ ] Participantes respeitam o limite de três pessoas, se houver grupo.
- [ ] Se houver apresentação, cada participante consegue defender sua parte.
- [ ] Se a apresentação opcional for em vídeo, envio pelo Moodle até 13/11.
