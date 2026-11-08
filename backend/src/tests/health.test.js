const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../index");

describe("GET /api/v1/health", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna degraded quando servico externo falha", async () => {
    axios.get.mockRejectedValueOnce(new Error("timeout"));

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("degraded");
    expect(response.body.versao).toBe("1.0.0");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body.motivo).toBe("Servico externo indisponivel");
  });

  test("retorna healthy quando servico externo responde", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const response = await request(app).get("/api/v1/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("healthy");
    expect(response.body.versao).toBe("1.0.0");
    expect(response.body).toHaveProperty("timestamp");
    expect(response.body.motivo).toBeUndefined();
  });
});
