const { getWithRetry } = require("../services/httpClient");
const { buscarClima } = require("../services/weather");

jest.mock("../services/httpClient");

// Testes unitários do serviço climático (weather.js).
// Mock: jest.mock("../services/httpClient") — isola a lógica de weather.js
// do cliente HTTP. Diferente dos demais testes que mockam axios diretamente.
// Nenhum destes testes faz chamada de rede.

describe("buscarClima — testes unitários do serviço climático", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna dados climáticos transformados com arredondamento e tradução", async () => {
    getWithRetry.mockResolvedValueOnce({
      data: {
        daily: {
          weather_code: [53],
          temperature_2m_min: [23.2],
          temperature_2m_max: [31.7],
        },
      },
    });

    const resultado = await buscarClima(-3.7172, -38.5433);

    expect(resultado).toEqual({
      temperatura_min: 23,
      temperatura_max: 32,
      condicao: "Garoa Moderada",
      unidades: {
        temperatura: "°C",
      },
    });
  });

  test("envia URL e parâmetros corretos ao cliente HTTP", async () => {
    getWithRetry.mockResolvedValueOnce({
      data: {
        daily: {
          weather_code: [0],
          temperature_2m_min: [20.0],
          temperature_2m_max: [30.0],
        },
      },
    });

    await buscarClima(-3.7172, -38.5433);

    expect(getWithRetry).toHaveBeenCalledTimes(1);
    expect(getWithRetry).toHaveBeenCalledWith(
      "https://api.open-meteo.com/v1/forecast",
      {
        params: {
          latitude: -3.7172,
          longitude: -38.5433,
          daily: "temperature_2m_max,temperature_2m_min,weather_code",
          timezone: "America/Sao_Paulo",
          forecast_days: 1,
        },
      }
    );
  });

  test("traduz código meteorológico não mapeado como Condicao Desconhecida", async () => {
    getWithRetry.mockResolvedValueOnce({
      data: {
        daily: {
          weather_code: [999],
          temperature_2m_min: [18.0],
          temperature_2m_max: [25.0],
        },
      },
    });

    const resultado = await buscarClima(-10, -20);

    expect(resultado.condicao).toBe("Condicao Desconhecida");
    expect(resultado.temperatura_min).toBe(18);
    expect(resultado.temperatura_max).toBe(25);
  });

  test("lança erro de serviço externo quando cliente HTTP falha", async () => {
    getWithRetry.mockRejectedValueOnce(new Error("timeout"));

    await expect(buscarClima(-10, -20)).rejects.toEqual({
      tipo: "SERVICO_EXTERNO",
      servico: "OPEN_METEO",
    });
  });
});
