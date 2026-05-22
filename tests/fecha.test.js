describe("formatearFechaISO", () => {
  let formatearFechaISO;
  let parsearFechaLocal;

  beforeEach(() => {
    jest.resetModules();
    global.UrlFetchApp = { fetch: jest.fn() };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    ({ formatearFechaISO, parsearFechaLocal } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
  });

  test("formatea YYYY-MM-DD sin corrimiento UTC", () => {
    expect(formatearFechaISO("2026-04-13")).toBe("2026-04-13");
  });

  test("formatea DD/MM/YYYY en formato argentino", () => {
    expect(formatearFechaISO("13/04/2026")).toBe("2026-04-13");
  });

  test("formatea objetos Date de celdas de Sheets", () => {
    const fechaCelda = new Date(2026, 3, 13);
    expect(formatearFechaISO(fechaCelda)).toBe("2026-04-13");
  });

  test("parsearFechaLocal crea fecha en hora local", () => {
    const fecha = parsearFechaLocal("2026-04-13");
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(3);
    expect(fecha.getDate()).toBe(13);
  });
});
