# 001 — Execução com Docker Compose

**Estado:** rascunho para alinhamento; implementação não iniciada.  
**Responsável informado:** Daniel.  
**Requisito:** B-TEC-01.  
**Dependências:** confirmar comportamento de inicialização, porta configurável e arquivos necessários ao runtime; revisar instruções Docker da equipe.

## Objetivo

Permitir subir a API com um único comando via Docker Compose e documentar o uso observado.

## Escopo previsto

- Inspecionar `package.json`, entrada do servidor, configuração de porta e arquivos necessários à instalação/execução.
- Propor e, após autorização específica, criar Dockerfile, Compose e `.dockerignore` mínimos.
- Atualizar instruções de execução para refletir o comportamento realmente validado.
- Verificar build, inicialização e resposta da API no container, distinguindo isso de integração real com provedores.

## Fora do escopo

- Alterar lógica de clima, geografia ou health sem necessidade demonstrada e alinhamento com o responsável.
- Acrescentar banco de dados, ambientes ou ferramentas não exigidos.
- Declarar fluxo externo ponta a ponta validado apenas porque o container iniciou.

## Arquivos previstos

`Dockerfile`, `docker-compose.yml`, `.dockerignore`, `docs/execucao-docker.md` e, se justificado após inspeção, ajustes localizados de configuração/README. Nenhum desses arquivos foi criado nesta etapa.

## Critérios de aceite

- Compose inicia a aplicação com um único comando documentado.
- A API responde no container em verificação local reproduzível.
- Arquivos de referência, testes e segredos locais desnecessários não entram na imagem.
- Documentação registra pré-requisitos, comando, porta e limites da validação.

## Validação planejada

Após autorização: executar build e `docker compose up`/verificação HTTP apropriada, registrar comandos e resultados. Não executar testes ou chamadas reais a provedores sem planejar sua natureza e dependências.

## Riscos e decisões pendentes

- A porta está fixa em `3000` no código lido; definir se configuração por ambiente é necessária antes de codificar.
- Revisar `.gitignore` e o conteúdo real do runtime para não excluir configuração compartilhada nem copiar material antigo de `x/`.
- Esta especificação não autoriza iniciar a implementação Docker.
