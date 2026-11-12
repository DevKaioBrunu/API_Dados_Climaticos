# Task 04 — Interação e conclusão da combobox

Kaio Bruno Soares dos Santos autorizou a Task 04 e a conclusão da Task 03 em 2026-11-11. Consultar `AGENTS.md`, `X/Agente.md`, `prompts/refatoracao-frontend.md` e `.spec/tarefas/007-refatoracao-frontend.md`.

Usar a API de localidades do IBGE, provedor já utilizado pelo backend, para obter a lista completa por UF; o acesso direto pelo navegador depende de CORS e conexão ao IBGE. A consulta de CE e o cabeçalho `Access-Control-Allow-Origin: *` foram verificados nesta sessão. Implementar combobox acessível com rolagem, busca sem acentos, seleção válida, proteção contra respostas atrasadas e mensagens de falha. Preservar a consulta de municípios da API. Para clima, conferir a UF retornada e não apresentar como correto resultado divergente.

Implementar carregamento, erros, saúde degradada, renderização segura no DOM, JSON técnico e alternância sem nova requisição. Atualizar marcação, estilos necessários e scripts do frontend; preservar contratos, infraestrutura e backend. Executar lint e testes disponíveis, distinguir simulações de consultas reais e registrar evidências e limitações na tarefa, em `docs/ia.md` e em `CONTRIBUTORS.md`.
