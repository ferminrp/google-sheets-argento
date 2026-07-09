function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () => JSON.stringify(body),
  };
}

describe("DOLARHISTORICO", () => {
  let DOLARHISTORICO;
  let fetchMock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn();
    global.UrlFetchApp = { fetch: fetchMock };
    global.Utilities = {
      formatDate: () => "2023-01-15",
    };
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    global.CacheService = {
      getScriptCache: () => ({ get: () => null, put: () => {} }),
    };

    ({ DOLARHISTORICO } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
    delete global.CacheService;
  });

  test("usa endpoint filtrado por casa y fecha", () => {
    fetchMock.mockReturnValue(
      createResponse(200, {
        casa: "blue",
        compra: 365,
        venta: 369,
        fecha: "2023-01-15",
      })
    );

    const result = DOLARHISTORICO("blue", "2023-01-15", "venta");

    expect(result).toBe(369);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/dolares/blue/2023/01/15");
    expect(fetchMock.mock.calls[0][0]).not.toMatch(/\/dolares$/);
  });

  test("acepta alias mep y fecha DD/MM/YYYY", () => {
    fetchMock.mockReturnValue(
      createResponse(200, {
        casa: "bolsa",
        compra: 100,
        venta: 101,
        fecha: "2023-01-15",
      })
    );

    const result = DOLARHISTORICO("mep", "15/01/2023", "compra");

    expect(result).toBe(100);
    expect(fetchMock.mock.calls[0][0]).toContain("/dolares/bolsa/2023/01/15");
  });
});
