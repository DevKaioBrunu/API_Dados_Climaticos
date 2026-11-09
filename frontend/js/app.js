const responseOutput = document.getElementById("responseOutput");
const requestTitle = document.getElementById("requestTitle");
const responseBadge = document.getElementById("responseBadge");
const connectionLabel = document.getElementById("connectionLabel");
const connectionHint = document.getElementById("connectionHint");
const connectionDot = document.getElementById("connectionDot");
const cityInput = document.getElementById("cityInput");
const ufInput = document.getElementById("ufInput");
const limitInput = document.getElementById("limitInput");

function setStatus(state, label, hint) {
  connectionLabel.textContent = label;
  connectionHint.textContent = hint;
  connectionDot.style.background = state === "success" ? "var(--success)" : state === "error" ? "var(--danger)" : "var(--muted)";
}

function render(title, statusLabel, data, state = "success") {
  requestTitle.textContent = title;
  responseBadge.textContent = statusLabel;
  responseOutput.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  setStatus(state, statusLabel, `Base URL ativa: ${ApiClient.getBaseUrl()}`);
}

function buildErrorHint(error) {
  if (error.status === 503) {
    const service = error.data?.servico ? ` Servico: ${error.data.servico}.` : "";
    return `Servico externo indisponivel.${service} Tente novamente em instantes ou verifique /api/v1/health.`;
  }

  if (error.status === 404) {
    return error.data?.mensagem || "Recurso nao encontrado.";
  }

  if (error.status === 400) {
    return error.data?.mensagem || "Requisicao invalida. Verifique os dados enviados.";
  }

  if (error.data?.mensagem) {
    return error.data.mensagem;
  }

  return "Verifique se a API esta rodando em localhost:3000.";
}

function renderError(title, error) {
  requestTitle.textContent = title;
  responseBadge.textContent = `HTTP ${error.status || "ERR"}`;
  responseOutput.textContent = JSON.stringify(error.data || { mensagem: "Erro inesperado" }, null, 2);
  setStatus("error", "Falha na requisição", buildErrorHint(error));
}

async function runRequest(type) {
  try {
    if (type === "health") {
      const data = await ApiClient.request("/api/v1/health");
      render("GET /api/v1/health", "HTTP 200", data);
      return;
    }

    if (type === "clima") {
      const cidade = cityInput.value.trim();
      const path = `/api/v1/clima/${encodeURIComponent(cidade)}`;
      const data = await ApiClient.request(path);
      render(`GET ${path}`, "HTTP 200", data);
      return;
    }

    if (type === "cidades") {
      const uf = ufInput.value.trim().toUpperCase();
      const limite = limitInput.value ? `?limite=${encodeURIComponent(limitInput.value)}` : "";
      const path = `/api/v1/cidades/${encodeURIComponent(uf)}${limite}`;
      const data = await ApiClient.request(path);
      render(`GET ${path}`, "HTTP 200", data);
    }
  } catch (error) {
    renderError(`GET ${type}`, error);
  }
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => runRequest(button.dataset.action));
});

document.getElementById("quickCities").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-city]");
  if (!button) return;

  cityInput.value = button.dataset.city;
  ufInput.value = button.dataset.uf;
  runRequest("clima");
});

setStatus("neutral", "Pronto para testar", "A API usa o mesmo endereço da página por padrão.");
