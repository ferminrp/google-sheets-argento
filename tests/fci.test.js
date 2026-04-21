function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () => JSON.stringify(body),
  };
}

describe("fci", () => {
  let fci;
  let fciLista;
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

    ({ fci, fciLista } = require("./test-wrapper"));
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

  test("acepta retornoTotal y consulta su endpoint", () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        {
          fondo: "Cocos Pesos Plus - Clase A",
          vcp: 555.55,
          ccp: 100,
          patrimonio: 1000,
        },
      ])
    );

    const result = fci("retornoTotal", "Cocos Pesos Plus - Clase A");

    expect(result).toBe(555.55);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain("/retornoTotal/ultimo");
  });

  test("fciLista incluye la categoría retornoTotal", () => {
    fetchMock.mockImplementation((url) => {
      if (url.includes("/retornoTotal/ultimo")) {
        return createResponse(200, [
          {
            fondo: "Cocos Pesos Plus - Clase A",
            vcp: 777.77,
          },
        ]);
      }
      return createResponse(200, []);
    });

    const result = fciLista();

    expect(fetchMock).toHaveBeenCalledTimes(5);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining("/retornoTotal/ultimo"),
      expect.any(Object)
    );
    expect(result).toContainEqual([
      "Cocos Pesos Plus - Clase A",
      "Retorno Total",
      777.77,
    ]);
  });
});
