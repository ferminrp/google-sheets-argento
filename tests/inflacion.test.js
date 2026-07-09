function createResponse(body) {
  return {
    getResponseCode: () => 200,
    getContentText: () => JSON.stringify(body),
  };
}

describe("inflacion", () => {
  let inflacion;

  beforeEach(() => {
    jest.resetModules();
    global.UrlFetchApp = {
      fetch: jest.fn().mockReturnValue(
        createResponse([
          { fecha: "2026-01-01", valor: 10 },
          { fecha: "2026-03-01", valor: 12 },
          { fecha: "2026-02-01", valor: 11 },
        ])
      ),
    };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    ({ inflacion } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
  });

  test("sin fecha devuelve el valor más reciente por string ISO", () => {
    expect(inflacion()).toBe(12);
  });

  test("fecha exacta ISO", () => {
    expect(inflacion("2026-02-01")).toBe(11);
  });

  test("fecha exacta DD/MM/YYYY", () => {
    expect(inflacion("01/02/2026")).toBe(11);
  });

  test("fecha sin match exacto usa la anterior más cercana", () => {
    expect(inflacion("2026-02-15")).toBe(11);
  });

  test("fecha anterior a todos los datos devuelve el más antiguo", () => {
    expect(inflacion("2025-01-01")).toBe(10);
  });
});
