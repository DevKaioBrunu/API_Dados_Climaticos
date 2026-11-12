const responseOutput = document.getElementById("responseOutput");
const rawOutput = document.getElementById("rawOutput");
const requestTitle = document.getElementById("requestTitle");
const responseBadge = document.getElementById("responseBadge");
const connectionLabel = document.getElementById("connectionLabel");
const connectionHint = document.getElementById("connectionHint");
const connectionDot = document.getElementById("connectionDot");
const cityInput = document.getElementById("cityInput");
const cityOptions = document.getElementById("cityOptions");
const cityHint = document.getElementById("cityHint");
const retryCities = document.getElementById("retryCities");
const ufInput = document.getElementById("ufInput");
const ufOptions = document.getElementById("ufOptions");
const ufHint = document.getElementById("ufHint");
const limitInput = document.getElementById("limitInput");
const weatherButton = document.querySelector('[data-action="clima"]');
const actionButtons = document.querySelectorAll("[data-action], [data-city]");
const visualMode = document.getElementById("visualMode");
const jsonMode = document.getElementById("jsonMode");
const resultSection = document.querySelector("section.output");
const themeToggle = document.getElementById("themeToggle");

function applyTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = dark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(dark));
}

let savedTheme = "light";
try {
  savedTheme = localStorage.getItem("clima-theme") || "light";
} catch {
  // O tema continua disponível durante a sessão se o armazenamento estiver bloqueado.
}
applyTheme(savedTheme);
themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  try {
    localStorage.setItem("clima-theme", nextTheme);
  } catch {
    // Sem armazenamento, a escolha permanece apenas até recarregar a página.
  }
});

let cities = [];
let matches = [];
let selectedCity = "";
let activeIndex = -1;
let loadVersion = 0;
let busy = false;
const states = "AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO".split(" ");
let selectedUf = "";
let ufMatches = [];
let activeUfIndex = -1;

function normalize(value) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function closeUfOptions() {
  ufOptions.hidden = true;
  ufInput.setAttribute("aria-expanded", "false");
  ufInput.removeAttribute("aria-activedescendant");
  activeUfIndex = -1;
}

function showUfOptions() {
  if (ufInput.disabled) return;
  const query = normalize(ufInput.value.trim());
  ufMatches = states.filter((uf) => normalize(uf).includes(query));
  ufOptions.replaceChildren();
  activeUfIndex = -1;
  ufMatches.forEach((uf, index) => {
    const option = document.createElement("li");
    option.id = `uf-option-${index}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.index = String(index);
    option.textContent = uf;
    ufOptions.append(option);
  });
  ufOptions.hidden = ufMatches.length === 0;
  ufInput.setAttribute("aria-expanded", String(ufMatches.length > 0));
  ufInput.removeAttribute("aria-activedescendant");
  ufHint.textContent = ufMatches.length ? `${ufMatches.length} UFs encontradas.` : "Nenhuma UF encontrada para esta busca.";
}

function chooseUf(uf, quickCity = "") {
  if (!states.includes(uf)) return;
  selectedUf = uf;
  ufInput.value = uf;
  ufHint.textContent = `${uf} selecionada.`;
  closeUfOptions();
  return loadCities(uf, quickCity);
}

function setStatus(state, label, hint) {
  connectionLabel.textContent = label;
  connectionHint.textContent = hint;
  connectionDot.style.background = state === "success" ? "var(--success)" : state === "error" ? "var(--danger)" : "var(--muted)";
}

function updateControls() {
  actionButtons.forEach((button) => { button.disabled = busy; });
  weatherButton.disabled = busy || !selectedCity;
  ufInput.disabled = busy;
  limitInput.disabled = busy;
  retryCities.disabled = busy;
  cityInput.disabled = busy || cities.length === 0;
}

function closeOptions() {
  cityOptions.hidden = true;
  cityInput.setAttribute("aria-expanded", "false");
  cityInput.removeAttribute("aria-activedescendant");
  activeIndex = -1;
}

function showOptions() {
  if (cityInput.disabled) return;
  const query = normalize(cityInput.value.trim());
  matches = cities.filter((city) => normalize(city).includes(query));
  cityOptions.replaceChildren();
  activeIndex = -1;
  matches.forEach((city, index) => {
    const option = document.createElement("li");
    option.id = `city-option-${index}`;
    option.setAttribute("role", "option");
    option.setAttribute("aria-selected", "false");
    option.dataset.index = String(index);
    option.textContent = city;
    cityOptions.append(option);
  });
  cityOptions.hidden = matches.length === 0;
  cityInput.setAttribute("aria-expanded", String(matches.length > 0));
  cityInput.removeAttribute("aria-activedescendant");
  cityHint.textContent = matches.length ? `${matches.length} municípios encontrados.` : "Nenhum município encontrado para esta busca.";
}

function chooseCity(city) {
  if (!cities.includes(city)) return;
  selectedCity = city;
  cityInput.value = city;
  cityHint.textContent = `${city} selecionada.`;
  closeOptions();
  updateControls();
}

async function loadCities(uf, quickCity = "") {
  const version = ++loadVersion;
  cities = [];
  retryCities.hidden = true;
  selectedCity = "";
  cityInput.value = "";
  closeOptions();
  cityInput.placeholder = uf ? "Carregando municípios..." : "Selecione uma UF primeiro";
  cityHint.textContent = uf ? "Carregando municípios do IBGE..." : "Selecione uma UF primeiro.";
  updateControls();
  if (!uf) return;
  try {
    const data = await ApiClient.municipalities(uf);
    if (version !== loadVersion) return;
    if (!Array.isArray(data) || data.some((item) => typeof item.nome !== "string")) throw new Error("Lista inválida");
    cities = data.map((item) => item.nome).sort((a, b) => a.localeCompare(b, "pt-BR"));
    cityInput.placeholder = cities.length ? "Digite ou escolha uma cidade" : "Nenhum município disponível";
    cityHint.textContent = cities.length ? `${cities.length} municípios disponíveis. Digite ou abra a lista.` : "Nenhum município disponível para esta UF.";
    updateControls();
    if (quickCity && cities.includes(quickCity)) {
      chooseCity(quickCity);
      await runRequest("clima");
    } else if (quickCity) {
      cityHint.textContent = "A cidade do atalho não foi encontrada nesta UF.";
    }
  } catch (error) {
    if (version !== loadVersion) return;
    cityInput.placeholder = "Municípios indisponíveis";
    cityHint.textContent = error.name === "AbortError" ? "A consulta ao IBGE demorou demais. Tente novamente." : "Não foi possível carregar municípios do IBGE. Tente novamente.";
    retryCities.hidden = false;
    updateControls();
  }
}

function element(tag, text, className) {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  if (className) node.className = className;
  return node;
}

function dateText(value) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Data indisponível" : date.toLocaleString("pt-BR");
}

function renderWeather(data) {
  const card = element("div", undefined, "weather-result");
  card.append(element("h3", `${data.nome}, ${data.estado}`));
  card.append(element("p", data.clima.condicao));
  const unit = data.clima.unidades?.temperatura || "°C";
  const temperatures = element("dl", undefined, "weather-temperatures");
  [["Mínima", data.clima.temperatura_min], ["Máxima", data.clima.temperatura_max]].forEach(([label, value]) => {
    const item = element("div");
    item.append(element("dt", label), element("dd", `${value} ${unit}`, "weather-temperature"));
    temperatures.append(item);
  });
  card.append(temperatures);
  card.append(element("small", `Consultado em ${dateText(data.consultado_em)}`));
  return card;
}

function renderCities(data) {
  const card = element("div");
  card.append(element("h3", `Municípios de ${data.uf}`));
  card.append(element("p", `${data.quantidade_retornada} municípios retornados`));
  const list = element("ul", undefined, "city-results");
  data.cidades.forEach((city) => list.append(element("li", city.nome)));
  card.append(list, element("small", `Consultado em ${dateText(data.consultado_em)}`));
  return card;
}

function renderHealth(data) {
  const card = element("div", undefined, "health-result");
  const label = data.status === "healthy" ? "API disponível" : data.status === "degraded" ? "API com serviço externo indisponível" : "Estado da API desconhecido";
  card.append(element("h3", label));
  if (data.motivo) card.append(element("p", data.motivo));
  card.append(element("p", `Versão: ${data.versao} | Verificado em ${dateText(data.timestamp)}`));
  return card;
}

function errorHint(error) {
  if (error.name === "AbortError") return "A consulta demorou demais. Tente novamente.";
  if (error.status === 400) return "Confira os dados informados e tente novamente.";
  if (error.status === 404) return "Não encontramos o resultado. Confira o nome ou a sigla.";
  if (error.status === 503) return `Um serviço externo está indisponível${error.data?.servico ? ` (${error.data.servico})` : ""}. Tente novamente em instantes.`;
  if (error.status) return "Não foi possível concluir a consulta. Tente novamente em instantes.";
  return "Não foi possível conectar à API. Verifique o endereço e se o serviço está em execução.";
}

async function runRequest(type) {
  if (busy) return;
  if (type === "clima" && (!selectedCity || !cities.includes(selectedCity) || cityInput.value !== selectedCity)) {
    cityHint.textContent = "Selecione um município da lista antes de consultar.";
    return;
  }
  if (type === "cidades" && (!selectedUf || ufInput.value !== selectedUf || !Number.isInteger(Number(limitInput.value)) || Number(limitInput.value) < 1 || Number(limitInput.value) > 100)) {
    setStatus("error", "Confira os dados", "Escolha uma UF e um limite inteiro de 1 a 100.");
    return;
  }
  const uf = selectedUf;
  const path = type === "health" ? "/api/v1/health" : type === "clima" ? `/api/v1/clima/${encodeURIComponent(selectedCity)}` : `/api/v1/cidades/${uf}?limite=${encodeURIComponent(limitInput.value)}`;
  const focusedControl = document.activeElement;
  const restoreFocus = focusedControl?.matches("[data-action], [data-city]");
  busy = true;
  updateControls();
  resultSection.setAttribute("aria-busy", "true");
  setStatus("neutral", "Consultando dados", "Aguarde a resposta da consulta.");
  try {
    const data = await ApiClient.request(path);
    rawOutput.textContent = JSON.stringify(data, null, 2);
    requestTitle.textContent = type === "clima" ? "Previsão do clima" : type === "cidades" ? "Municípios" : "Disponibilidade";
    responseBadge.textContent = "HTTP 200";
    if (type === "clima" && data.estado !== uf) {
      responseOutput.replaceChildren(element("p", `A API retornou ${data.nome}, ${data.estado}; a UF selecionada é ${uf}. Não foi possível confirmar esta cidade.`));
      setStatus("error", "UF divergente", "Confira a UF retornada no JSON técnico.");
    } else {
      responseOutput.replaceChildren(type === "clima" ? renderWeather(data) : type === "cidades" ? renderCities(data) : renderHealth(data));
      const degraded = type === "health" && data.status !== "healthy";
      setStatus(degraded ? "error" : "success", degraded ? "Disponibilidade limitada" : "Consulta concluída", degraded ? "Confira o estado dos serviços no resultado." : "Dados recebidos com sucesso.");
    }
  } catch (error) {
    const hint = errorHint(error);
    requestTitle.textContent = "Consulta não concluída";
    responseBadge.textContent = error.status ? `HTTP ${error.status}` : "Falha";
    responseOutput.replaceChildren(element("p", hint));
    rawOutput.textContent = JSON.stringify(error.data || { mensagem: hint }, null, 2);
    setStatus("error", "Falha na consulta", hint);
  } finally {
    busy = false;
    resultSection.setAttribute("aria-busy", "false");
    updateControls();
    if (restoreFocus && document.activeElement === document.body && !focusedControl.disabled) focusedControl.focus();
  }
}

document.querySelector("form").addEventListener("submit", (event) => event.preventDefault());
ufInput.addEventListener("input", () => {
  selectedUf = "";
  loadCities("");
  showUfOptions();
});
ufInput.addEventListener("click", showUfOptions);
ufInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (ufOptions.hidden) showUfOptions();
    if (!ufMatches.length) return;
    activeUfIndex = event.key === "ArrowDown" ? Math.min(activeUfIndex + 1, ufMatches.length - 1) : Math.max(activeUfIndex - 1, 0);
    Array.from(ufOptions.children).forEach((option, index) => option.classList.toggle("is-active", index === activeUfIndex));
    const active = ufOptions.children[activeUfIndex];
    ufInput.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter" && !ufOptions.hidden && activeUfIndex >= 0) {
    event.preventDefault();
    chooseUf(ufMatches[activeUfIndex]);
  } else if (event.key === "Escape") {
    closeUfOptions();
  }
});
ufOptions.addEventListener("pointerdown", (event) => event.preventDefault());
ufOptions.addEventListener("click", (event) => {
  const option = event.target.closest('[role="option"]');
  if (option) chooseUf(ufMatches[Number(option.dataset.index)]);
});
ufInput.addEventListener("blur", closeUfOptions);
retryCities.addEventListener("click", () => loadCities(selectedUf));
cityInput.addEventListener("input", () => { selectedCity = ""; updateControls(); showOptions(); });
cityInput.addEventListener("click", showOptions);
cityInput.addEventListener("keydown", (event) => {
  if (event.key === "ArrowDown" || event.key === "ArrowUp") {
    event.preventDefault();
    if (cityOptions.hidden) showOptions();
    if (!matches.length) return;
    activeIndex = event.key === "ArrowDown" ? Math.min(activeIndex + 1, matches.length - 1) : Math.max(activeIndex - 1, 0);
    Array.from(cityOptions.children).forEach((option, index) => option.classList.toggle("is-active", index === activeIndex));
    const active = cityOptions.children[activeIndex];
    cityInput.setAttribute("aria-activedescendant", active.id);
    active.scrollIntoView({ block: "nearest" });
  } else if (event.key === "Enter" && !cityOptions.hidden && activeIndex >= 0) {
    event.preventDefault();
    chooseCity(matches[activeIndex]);
  } else if (event.key === "Escape") {
    closeOptions();
  }
});
cityOptions.addEventListener("pointerdown", (event) => event.preventDefault());
cityOptions.addEventListener("click", (event) => {
  const option = event.target.closest('[role="option"]');
  if (option) chooseCity(matches[Number(option.dataset.index)]);
});
cityInput.addEventListener("blur", () => closeOptions());
document.querySelectorAll("[data-action]").forEach((button) => button.addEventListener("click", () => runRequest(button.dataset.action)));
document.getElementById("quickCities").addEventListener("click", (event) => {
  const button = event.target.closest("button[data-city]");
  if (!button || busy) return;
  chooseUf(button.dataset.uf, button.dataset.city);
});
function setView(json) {
  responseOutput.hidden = json;
  rawOutput.hidden = !json;
  visualMode.setAttribute("aria-pressed", String(!json));
  jsonMode.setAttribute("aria-pressed", String(json));
}
visualMode.addEventListener("click", () => setView(false));
jsonMode.addEventListener("click", () => setView(true));
updateControls();
