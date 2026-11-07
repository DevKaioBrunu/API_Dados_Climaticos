const { getWithRetry } = require("./httpClient");

function logExternalError(service, error, url) {
  const status = error.response?.status;
  const code = error.code;
  const message = error.message;
  console.log(`[${service}] external error`, { status, code, message, url });
}

async function buscarCoordenadasCidade(nomeCidade, siglaUF) {
  const url = "https://geocoding-api.open-meteo.com/v1/search";
  try {
    const response = await getWithRetry(url, {
      params: {
        name: nomeCidade,
        count: 1,
        language: "pt",
        format: "json",
        country: "BR",
        admin1: siglaUF,
      },
    });

    const resultado = response.data?.results?.[0];

    if (!resultado || resultado.latitude == null || resultado.longitude == null) {
      return null;
    }

    return {
      lat: resultado.latitude,
      lon: resultado.longitude,
    };
  } catch (error) {
    logExternalError("OPEN_METEO_GEOCODING", error, url);
    throw { tipo: "SERVICO_EXTERNO", servico: "OPEN_METEO_GEOCODING" };
  }
}

async function buscarCidade(nomeCidade) {
  const url =
    "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=" +
    encodeURIComponent(nomeCidade);
  try {
    const response = await getWithRetry(url);
    const cidades = response.data;

    if (!cidades || cidades.length === 0) {
      return null;
    }

    // Exige correspondencia exata do nome
    const cidadeExata = cidades.find(
      (c) => c.nome.toLowerCase() === nomeCidade.toLowerCase()
    );

    if (!cidadeExata) {
      return null;
    }

    const cidade = cidadeExata;
    const uf = cidade.microrregiao.mesorregiao.UF;

    const siglaUF = uf.sigla;
    const coordenadas = await buscarCoordenadasCidade(cidade.nome, siglaUF);

    if (!coordenadas) {
      return null;
    }

    const lat = coordenadas.lat;
    const lon = coordenadas.lon;

    return {
      nome: cidade.nome,
      estado: siglaUF,
      codigo_ibge: cidade.id,
      latitude: lat,
      longitude: lon,
    };

  } catch (error) {
    if (error && error.tipo === "SERVICO_EXTERNO") {
      throw error;
    }
    if (error.response && error.response.status === 404) {
      return null;
    }
    logExternalError("IBGE", error, url);
    throw { tipo: "SERVICO_EXTERNO", servico: "IBGE" };
  }
}

async function buscarCidadesPorUF(siglaUF) {
  const url =
    "https://servicodados.ibge.gov.br/api/v1/localidades/estados/" +
    encodeURIComponent(siglaUF) +
    "/municipios";
  try {
    const response = await getWithRetry(url);
    const cidades = response.data;

    if (!Array.isArray(cidades) || cidades.length === 0) {
      return null;
    }

    return cidades.map((cidade) => ({ nome: cidade.nome }));
  } catch (error) {
    if (error && error.tipo === "SERVICO_EXTERNO") {
      throw error;
    }
    if (error.response && error.response.status === 404) {
      return null;
    }
    logExternalError("IBGE", error, url);
    throw { tipo: "SERVICO_EXTERNO", servico: "IBGE" };
  }
}

module.exports = { buscarCidade, buscarCidadesPorUF };