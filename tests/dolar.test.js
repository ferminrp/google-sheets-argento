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
        ])
      ),
    };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    ({ dolar } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
  });

  test("promedio usa venta cuando compra es null", () => {
    expect(dolar("blue", "promedio")).toBe(1200);
  });

  test("promedio calcula correctamente con compra y venta", () => {
    expect(dolar("oficial", "promedio")).toBe(925);
  });
});
