const { getWithRetry } = require("../services/httpClient");

jest.mock("../services/httpClient", () => ({
  getWithRetry: jest.fn(),
}));

const { buscarCidadesPorUF } = require("../services/ibge");

describe("buscarCidadesPorUF", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("consulta municípios da UF e retorna somente os nomes", async () => {
    getWithRetry.mockResolvedValueOnce({
      data: [
        { id: 2304400, nome: "Fortaleza", regiao: { id: 2 } },
        { id: 2302503, nome: "Aquiraz" },
      ],
    });

    await expect(buscarCidadesPorUF("CE")).resolves.toEqual([
      { nome: "Fortaleza" },
      { nome: "Aquiraz" },
    ]);
    expect(getWithRetry).toHaveBeenCalledWith(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados/CE/municipios"
    );
  });

  test.each([[], null, {}])(
    "retorna null quando a resposta não contém uma lista de municípios: %p",
    async (data) => {
      getWithRetry.mockResolvedValueOnce({ data });

      await expect(buscarCidadesPorUF("CE")).resolves.toBeNull();
    }
  );

  test("retorna null quando o IBGE responde HTTP 404", async () => {
    getWithRetry.mockRejectedValueOnce({ response: { status: 404 } });
    jest.spyOn(console, "log").mockImplementation(() => {});

    await expect(buscarCidadesPorUF("XX")).resolves.toBeNull();
  });

  test("converte falha do provedor em erro de serviço externo", async () => {
    getWithRetry.mockRejectedValueOnce({
      message: "Falha simulada",
      response: { status: 500 },
    });
    jest.spyOn(console, "log").mockImplementation(() => {});

    await expect(buscarCidadesPorUF("CE")).rejects.toEqual({
      tipo: "SERVICO_EXTERNO",
      servico: "IBGE",
    });
  });
});
