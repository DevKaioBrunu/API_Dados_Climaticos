const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../index");

// Testes da rota GET /api/v1/health.
// Classificação obrigatória: teste de rota da aplicação com Axios mockado,
// não constitui health check real do ambiente ou de provedores externos.
// A rota responde HTTP 200 tanto para 'healthy' quanto para 'degraded',
// diferenciando a integridade pelo payload JSON retornado.

describe("GET /api/v1/health — Testes de rota e integridade da aplicação", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna degraded quando servico externo falha na consulta", async () => {
    axios.get.mockRejectedValueOnce(new Error("timeout"));

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.status).toBe("degraded");
    expect(response.body.versao).toBe("1.0.0");
    expect(response.body).toHaveProperty("timestamp");
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    expect(response.body.motivo).toBe("Servico externo indisponivel");
  });

  test("retorna healthy quando servico externo responde com sucesso", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.headers["content-type"]).toMatch(/json/);
    expect(response.body.status).toBe("healthy");
    expect(response.body.versao).toBe("1.0.0");
    expect(response.body).toHaveProperty("timestamp");
    expect(new Date(response.body.timestamp).toISOString()).toBe(response.body.timestamp);
    expect(response.body.motivo).toBeUndefined();
  });
});
