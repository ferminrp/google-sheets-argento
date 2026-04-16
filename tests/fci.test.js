function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () => JSON.stringify(body),
  };
}

describe("fci", () => {
  let fci;
  let fetchMock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn();

    global.UrlFetchApp = {
      fetch: fetchMock,
    };
    global.Utilities = {};
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };

    ({ fci } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
  });

  test("usa la fecha YYYY-MM-DD sin corrimiento por timezone", () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        {
          fondo: "Cocos Rendimiento - Clase A",
          vcp: 123.45,
          ccp: 100,
          patrimonio: 1000,
        },
      ])
    );

    const result = fci("rentaMixta", "Cocos Rendimiento - Clase A", "2026-04-13");

    expect(result).toBe(123.45);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/rentaMixta/2026/04/13/");
    expect(fetchMock.mock.calls[0][0]).not.toContain("/rentaMixta/2026/04/12/");
  });

  test("acepta MM/DD/YYYY y apunta al mismo endpoint normalizado", () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        {
          fondo: "Cocos Rendimiento - Clase A",
          vcp: 200,
          ccp: 100,
          patrimonio: 1000,
        },
      ])
    );

    const result = fci("rentaMixta", "Cocos Rendimiento - Clase A", "04/13/2026");

    expect(result).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/rentaMixta/2026/04/13/");
  });

  test("rechaza fecha inválida y no consulta la API", () => {
    expect(() =>
      fci("rentaMixta", "Cocos Rendimiento - Clase A", "2026-13-40")
    ).toThrow("Fecha inválida");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test("sin fecha usa endpoint /ultimo", () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        {
          fondo: "Cocos Rendimiento - Clase A",
          vcp: 321,
          ccp: 100,
          patrimonio: 1000,
        },
      ])
    );

    const result = fci("rentaMixta", "Cocos Rendimiento - Clase A");

    expect(result).toBe(321);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/rentaMixta/ultimo");
  });
});
