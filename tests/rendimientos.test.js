function createResponse(body) {
  return {
    getResponseCode: () => 200,
    getContentText: () => JSON.stringify(body),
  };
}

describe("rendimientos", () => {
  let rendimientos;

  beforeEach(() => {
    jest.resetModules();
    global.UrlFetchApp = {
      fetch: jest.fn().mockReturnValue(
        createResponse([
          {
            entidad: "ripio",
            rendimientos: [
              { moneda: "USDT", apy: 5 },
              { moneda: "BTC", apy: 1 },
            ],
          },
          {
            entidad: "buenbit",
            rendimientos: [
              { moneda: "USDT", apy: 8 },
              { moneda: "ETH", apy: 3 },
            ],
          },
        ])
      ),
    };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    ({ rendimientos } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
  });

  test("devuelve el mejor APY cuando no hay proveedor", () => {
    expect(rendimientos("USDT")).toBe(8);
  });

  test("error por moneda inexistente usa el ticker pedido (no el último del dataset)", () => {
    expect(() => rendimientos("DOGE")).toThrow("Moneda 'DOGE' no encontrada");
  });

  test("error por moneda en proveedor específico usa el ticker pedido", () => {
    expect(() => rendimientos("ETH", "ripio")).toThrow(
      "La moneda 'ETH' no está disponible en el proveedor 'ripio'"
    );
  });
});
