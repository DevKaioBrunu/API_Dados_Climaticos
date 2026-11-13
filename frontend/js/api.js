/* exported ApiClient */
const ApiClient = (() => {
  function getBaseUrl() {
    const configuredUrl = document.getElementById("baseUrl")?.value?.trim();
    if (configuredUrl) return configuredUrl.replace(/\/$/, "");
    return window.location.protocol === "file:" ? "http://localhost:3000" : window.location.origin;
  }

  async function fetchData(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);
    try {
      const response = await fetch(url, { signal: controller.signal });
      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json") ? await response.json() : await response.text();
      if (!response.ok) {
        const error = new Error("Request failed");
        error.status = response.status;
        error.data = data;
        throw error;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  function request(path) {
    return fetchData(`${getBaseUrl()}${path}`);
  }

  function municipalities(uf) {
    return fetchData(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${encodeURIComponent(uf)}/municipios`);
  }

  return { request, getBaseUrl, municipalities };
})();
