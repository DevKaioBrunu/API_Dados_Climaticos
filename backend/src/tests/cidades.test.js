const request = require("supertest");
const axios = require("axios");

jest.mock("axios");

const app = require("../index");

describe("GET /api/v1/cidades/:sigla_uf", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("retorna 200 com lista de cidades", async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { nome: "Abaiara" },
        { nome: "Acarape" },
        { nome: "Acarau" },
      ],
    });

    const response = await request(app).get("/api/v1/cidades/CE?limite=2");

    expect(response.status).toBe(200);
    expect(response.body.uf).toBe("CE");
    expect(response.body.quantidade_retornada).toBe(2);
    expect(response.body.cidades).toEqual([
      { nome: "Abaiara" },
      { nome: "Acarape" },
    ]);
    expect(response.body).toHaveProperty("consultado_em");
  });

  test("normaliza a UF e usa limite padrão de 10 cidades", async () => {
    axios.get.mockResolvedValueOnce({
      data: Array.from({ length: 12 }, (_, index) => ({
        nome: `Cidade ${index + 1}`,
      })),
    });

    const response = await request(app).get("/api/v1/cidades/ce");

    expect(response.status).toBe(200);
    expect(response.body.uf).toBe("CE");
    expect(response.body.quantidade_retornada).toBe(10);
    expect(response.body.cidades).toHaveLength(10);
    expect(axios.get).toHaveBeenCalledWith(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/CE/municipios",
      expect.any(Object)
    );
  });

  test("retorna 503 quando servico externo falha", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 500 } });

    const response = await request(app).get("/api/v1/cidades/CE");

    expect(response.status).toBe(503);
    expect(response.body.codigo).toBe("SERVICO_EXTERNO_INDISPONIVEL");
    expect(response.body.servico).toBe("IBGE");
  });

  test("retorna 404 para UF inexistente", async () => {
    axios.get.mockRejectedValueOnce({ response: { status: 404 } });

    const response = await request(app).get("/api/v1/cidades/XX");

    expect(response.status).toBe(404);
    expect(response.body.codigo).toBe("UF_NAO_ENCONTRADA");
  });

  test("retorna 404 quando o IBGE responde com lista vazia", async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    const response = await request(app).get("/api/v1/cidades/XX");

    expect(response.status).toBe(404);
    expect(response.body.codigo).toBe("UF_NAO_ENCONTRADA");
  });

  test("retorna 400 para sigla invalida", async () => {
    const response = await request(app).get("/api/v1/cidades/ceara");

    expect(response.status).toBe(400);
    expect(response.body.codigo).toBe("SIGLA_UF_INVALIDA");
  });

  test.each(["abc", "0", "101", "invalido"])(
    "retorna 400 sem consultar o IBGE quando o limite é inválido (%s)",
    async (limite) => {
      const response = await request(app).get(
        `/api/v1/cidades/CE?limite=${limite}`
      );

      expect(response.status).toBe(400);
      expect(response.body.codigo).toBe("LIMITE_INVALIDO");
      expect(axios.get).not.toHaveBeenCalled();
    }
  );

  test("retorna 404 em JSON para rota inexistente", async () => {
    const response = await request(app).get("/api/v1/rota-inexistente");

    expect(response.status).toBe(404);
    expect(response.body.codigo).toBe("ROTA_NAO_ENCONTRADA");
  });
});
