const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../index");

// Testes de rota / integrados internamente: atravessam Express, rota clima,
// serviços (ibge, weather) e cliente HTTP com axios mockado.
// Classificação: testes com mocks determinísticos. Não comprovam disponibilidade
// ou formato em tempo real dos provedores externos (IBGE e Open-Meteo).

describe("GET /api/v1/clima/:nome_cidade", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("Validação de entradas", () => {
    test("retorna 400 para nome de cidade com menos de 2 caracteres", async () => {
      const response = await request(app).get("/api/v1/clima/A");

      expect(response.status).toBe(400);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("NOME_INVALIDO");
      expect(response.body.mensagem).toBe(
        "O nome da cidade deve conter pelo menos 2 caracteres"
      );
      expect(response.body.nome_informado).toBe("A");
    });

    test("retorna 503 para caso especial CPTEC", async () => {
      const response = await request(app).get("/api/v1/clima/CPTEC");

      expect(response.status).toBe(503);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("SERVICO_EXTERNO_INDISPONIVEL");
      expect(response.body.servico).toBe("CPTEC");
    });
  });

  describe("Cenários de sucesso", () => {
    test.each([
      ["Fortaleza", "CE"],
      ["São Paulo", "SP"],
      ["Rio de Janeiro", "RJ"],
      ["Brasília", "DF"],
      ["Salvador", "BA"],
      ["Belo Horizonte", "MG"],
      ["Curitiba", "PR"],
      ["Manaus", "AM"],
    ])("retorna 200 para cidade valida: %s", async (nomeCidade, siglaUF) => {
      // 1ª chamada: IBGE (busca de município por nome)
      axios.get
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
              nome: nomeCidade,
              microrregiao: {
                mesorregiao: {
                  UF: {
                    sigla: siglaUF,
                    regiao: {},
                  },
                },
              },
            },
          ],
        })
        // 2ª chamada: Open-Meteo Geocoding (busca coordenadas da cidade)
        .mockResolvedValueOnce({
          data: {
            results: [
              {
                latitude: -10,
                longitude: -20,
              },
            ],
          },
        })
        // 3ª chamada: Open-Meteo Forecast (previsão do tempo)
        .mockResolvedValueOnce({
          data: {
            daily: {
              weather_code: [53],
              temperature_2m_min: [23.2],
              temperature_2m_max: [31.1],
            },
          },
        });

      const response = await request(app).get(
        `/api/v1/clima/${encodeURIComponent(nomeCidade)}`
      );

      expect(response.status).toBe(200);
      expect(response.body.nome).toBe(nomeCidade);
      expect(response.body.estado).toBe(siglaUF);
      expect(response.body.clima).toEqual({
        temperatura_min: 23,
        temperatura_max: 31,
        condicao: "Garoa Moderada",
        unidades: { temperatura: "°C" },
      });
      expect(new Date(response.body.consultado_em).toISOString()).toBe(
        response.body.consultado_em
      );
    });
  });

  describe("Recurso inexistente", () => {
    test("retorna 404 para cidade inexistente", async () => {
      // 1ª chamada: IBGE retorna lista vazia
      axios.get.mockResolvedValueOnce({ data: [] });

      const response = await request(app).get(
        "/api/v1/clima/CidadeInexistente"
      );

      expect(response.status).toBe(404);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("CIDADE_NAO_ENCONTRADA");
    });
  });

  describe("Falhas de provedores externos", () => {
    test("retorna 503 quando IBGE falha na consulta de municipios (1ª chamada)", async () => {
      // 1ª chamada: falha no IBGE
      axios.get.mockRejectedValueOnce({ response: { status: 500 } });

      const response = await request(app).get("/api/v1/clima/Fortaleza");

      expect(response.status).toBe(503);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("SERVICO_EXTERNO_INDISPONIVEL");
      expect(response.body.servico).toBe("IBGE");
    });

    test("retorna 503 quando geocodificador falha na busca de coordenadas (2ª chamada)", async () => {
      // 1ª chamada: IBGE responde com sucesso
      axios.get
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
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
        })
        // 2ª chamada: Open-Meteo Geocoding falha
        .mockRejectedValueOnce({ response: { status: 500 } });

      const response = await request(app).get("/api/v1/clima/Fortaleza");

      expect(response.status).toBe(503);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("SERVICO_EXTERNO_INDISPONIVEL");
      expect(response.body.servico).toBe("OPEN_METEO_GEOCODING");
    });

    test("retorna 503 quando previsao meteorologica falha (3ª chamada)", async () => {
      // 1ª chamada: IBGE responde com sucesso
      axios.get
        .mockResolvedValueOnce({
          data: [
            {
              id: 1,
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
        })
        // 2ª chamada: Open-Meteo Geocoding responde com sucesso
        .mockResolvedValueOnce({
          data: {
            results: [
              {
                latitude: -10,
                longitude: -20,
              },
            ],
          },
        })
        // 3ª chamada: Open-Meteo Forecast falha
        .mockRejectedValueOnce({ response: { status: 500 } });

      const response = await request(app).get("/api/v1/clima/Fortaleza");

      expect(response.status).toBe(503);
      expect(response.body.erro).toBe(true);
      expect(response.body.codigo).toBe("SERVICO_EXTERNO_INDISPONIVEL");
      expect(response.body.servico).toBe("OPEN_METEO");
    });
  });
});
