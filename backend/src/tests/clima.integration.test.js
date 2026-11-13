const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../index");

// Teste de integração interna da aplicação Express (evidência para B-TEC-05).
//
// Classificação obrigatória:
// - Tipo: Teste de integração interna com provedores simulados.
// - Abrangência: Atravessa a pilha completa da aplicação (Express, middlewares,
//   roteamento, camada de serviços ibge.js e weather.js, cliente HTTP getWithRetry).
// - Isolamento: Utiliza mocks determinísticos no nível da biblioteca Axios.
// - Rede e portas: Supertest usa uma porta TCP local temporária, sem servidor
//   persistente e sem chamadas reais aos provedores externos.
// - Distinção: Não equivale à verificação de ponta a ponta com provedores reais
//   (esta última realizada via scripts com ambiente ativo, sujeita à conectividade).
// - A aceitação formal deste teste para B-TEC-05 ainda depende da equipe/curso.

describe("Integração da API — Fluxo Climático (B-TEC-05)", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("executa o fluxo interno completo com provedores simulados (IBGE -> Geocoding -> Forecast)", async () => {
    // 1ª etapa da cadeia: IBGE retorna o município e a UF
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 2304400,
          nome: "Fortaleza",
          microrregiao: {
            mesorregiao: {
              UF: {
                sigla: "CE",
                regiao: { nome: "Nordeste" },
              },
            },
          },
        },
      ],
    });

    // 2ª etapa da cadeia: Open-Meteo Geocoding converte município em coordenadas
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            name: "Fortaleza",
            latitude: -3.7172,
            longitude: -38.5433,
            country: "Brazil",
            admin1: "Ceará",
          },
        ],
      },
    });

    // 3ª etapa da cadeia: Open-Meteo Forecast fornece as métricas climáticas
    axios.get.mockResolvedValueOnce({
      data: {
        daily: {
          weather_code: [1], // Predominantemente Limpo
          temperature_2m_min: [24.3],
          temperature_2m_max: [31.8],
        },
      },
    });

    // Execução da requisição HTTP na rota agregada
    const response = await request(app).get("/api/v1/clima/Fortaleza");

    // Validação da resposta HTTP e headers
    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);

    // Validação do payload final entregue pela API
    expect(response.body).toEqual({
      nome: "Fortaleza",
      estado: "CE",
      clima: {
        temperatura_min: 24,
        temperatura_max: 32,
        condicao: "Predominantemente Limpo",
        unidades: {
          temperatura: "°C",
        },
      },
      consultado_em: expect.any(String),
    });

    // Validação do formato ISO da data de consulta
    expect(new Date(response.body.consultado_em).toISOString()).toBe(
      response.body.consultado_em
    );

    // Confirmação da quantidade e da ordem das chamadas da cadeia
    expect(axios.get).toHaveBeenCalledTimes(3);
    expect(axios.get.mock.calls.map(([url]) => url)).toEqual([
      "https://servicodados.ibge.gov.br/api/v1/localidades/municipios?nome=Fortaleza",
      "https://geocoding-api.open-meteo.com/v1/search",
      "https://api.open-meteo.com/v1/forecast",
    ]);
  });

  test("assegura degradação graciosa quando etapa final da cadeia (Forecast) falha", async () => {
    // 1ª etapa: IBGE responde normalmente
    axios.get.mockResolvedValueOnce({
      data: [
        {
          id: 2304400,
          nome: "Fortaleza",
          microrregiao: {
            mesorregiao: {
              UF: {
                sigla: "CE",
                regiao: {},
              },
            },
          },
        },
      ],
    });

    // 2ª etapa: Geocoding responde normalmente
    axios.get.mockResolvedValueOnce({
      data: {
        results: [
          {
            latitude: -3.7172,
            longitude: -38.5433,
          },
        ],
      },
    });

    // 3ª etapa: Forecast falha com erro 500
    axios.get.mockRejectedValueOnce({
      response: { status: 500, data: "Service Error" },
    });

    const response = await request(app).get("/api/v1/clima/Fortaleza");

    expect(response.status).toBe(503);
    expect(response.body).toEqual({
      erro: true,
      codigo: "SERVICO_EXTERNO_INDISPONIVEL",
      mensagem:
        "Nao foi possivel obter dados do servico externo. Tente novamente em alguns instantes",
      servico: "OPEN_METEO",
    });
  });
});
