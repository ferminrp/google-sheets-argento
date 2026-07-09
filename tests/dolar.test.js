function createResponse(body) {
  return {
    getResponseCode: () => 200,
    getContentText: () => JSON.stringify(body),
  };
}

describe("dolar", () => {
  let dolar;

  beforeEach(() => {
    jest.resetModules();
    global.UrlFetchApp = {
      fetch: jest.fn().mockReturnValue(
        createResponse([
          { casa: "blue", compra: null, venta: 1200 },
          { casa: "oficial", compra: 900, venta: 950 },
          { casa: "bolsa", compra: 1000, venta: 1010 },
          { casa: "contadoconliqui", compra: 1020, venta: 1030 },
        ])
      ),
    };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    global.CacheService = {
      getScriptCache: () => ({ get: () => null, put: () => {} }),
    };
    ({ dolar } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
    delete global.CacheService;
  });

  test("promedio usa venta cuando compra es null", () => {
    expect(dolar("blue", "promedio")).toBe(1200);
  });

  test("promedio calcula correctamente con compra y venta", () => {
    expect(dolar("oficial", "promedio")).toBe(925);
  });

  test("alias mep resuelve a bolsa", () => {
    expect(dolar("mep", "venta")).toBe(1010);
  });

  test("alias ccl resuelve a contadoconliqui", () => {
    expect(dolar("ccl", "compra")).toBe(1020);
  });

  test("operacion por defecto es venta", () => {
    expect(dolar("blue")).toBe(1200);
  });

  test("tipo vacío lanza error legible", () => {
    expect(() => dolar("", "venta")).toThrow("Tipo no proporcionado");
  });
});
