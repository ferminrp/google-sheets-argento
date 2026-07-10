function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () =>
      typeof body === 'string' ? body : JSON.stringify(body),
  };
}

const SERIE_GGAL = [
  { date: '2024-01-12', o: 100, h: 110, l: 95, c: 105, v: 1000, dr: 0.01, sa: 0.4 },
  { date: '2024-01-15', o: 105, h: 120, l: 104, c: 115, v: 2000, dr: 0.095, sa: 0.41 },
  { date: '2024-01-16', o: 115, h: 118, l: 112, c: 116, v: 1500, dr: 0.009, sa: 0.42 },
];

describe('históricos de mercado (data912)', () => {
  let ACCIONESHISTORICO;
  let CEDEARHISTORICO;
  let BONOSHISTORICO;
  let fetchMock;
  let cacheStore;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn();
    cacheStore = new Map();

    global.UrlFetchApp = { fetch: fetchMock };
    global.Utilities = { formatDate: () => '2024-01-16' };
    global.DriveApp = {};
    global.Logger = { log: jest.fn() };
    global.CacheService = {
      getScriptCache: () => ({
        get: (key) => (cacheStore.has(key) ? cacheStore.get(key) : null),
        put: (key, value) => {
          cacheStore.set(key, value);
        },
      }),
    };

    ({
      ACCIONESHISTORICO,
      CEDEARHISTORICO,
      BONOSHISTORICO,
    } = require('./test-wrapper'));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
    delete global.CacheService;
  });

  test('ACCIONESHISTORICO: match exacto de fecha y campo c por defecto', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    const result = ACCIONESHISTORICO('ggal', '2024-01-15');

    expect(result).toBe(115);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://data912.com/historical/stocks/GGAL'
    );
  });

  test('ACCIONESHISTORICO: campo h y fecha DD/MM/YYYY', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    const result = ACCIONESHISTORICO('GGAL', '15/01/2024', 'h');

    expect(result).toBe(120);
  });

  test('ACCIONESHISTORICO: fallback al último día hábil ≤ fecha (finde)', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    // 2024-01-14 es domingo; última rueda ≤ es 2024-01-12
    const result = ACCIONESHISTORICO('GGAL', '2024-01-14', 'c');

    expect(result).toBe(105);
  });

  test('ACCIONESHISTORICO: sin fecha devuelve último bar', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    const result = ACCIONESHISTORICO('GGAL');

    expect(result).toBe(116);
  });

  test('CEDEARHISTORICO: usa segmento cedears', () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        { date: '2024-06-01', o: 1, h: 2, l: 1, c: 1.5, v: 10, dr: 0, sa: 0.3 },
      ])
    );

    const result = CEDEARHISTORICO('AAPL', '2024-06-01', 'c');

    expect(result).toBe(1.5);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://data912.com/historical/cedears/AAPL'
    );
  });

  test('BONOSHISTORICO: usa segmento bonds y campo dr', () => {
    fetchMock.mockReturnValue(
      createResponse(200, [
        { date: '2024-06-01', o: 50, h: 51, l: 49, c: 50.5, v: 1e6, dr: -0.02, sa: 0.25 },
      ])
    );

    const result = BONOSHISTORICO('AL30', '2024-06-01', 'dr');

    expect(result).toBe(-0.02);
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://data912.com/historical/bonds/AL30'
    );
  });

  test('ticker inválido: body Error de data912', () => {
    fetchMock.mockReturnValue(
      createResponse(200, { Error: 'Nahh no tengo ese ticker loko' })
    );

    expect(() => ACCIONESHISTORICO('NOEXISTE', '2024-01-15')).toThrow(
      /Símbolo inválido/
    );
  });

  test('campo inválido', () => {
    expect(() => ACCIONESHISTORICO('GGAL', '2024-01-15', 'px_bid')).toThrow(
      /Campo inválido/
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('símbolo vacío', () => {
    expect(() => ACCIONESHISTORICO('', '2024-01-15')).toThrow(
      /Símbolo no proporcionado/
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  test('fecha anterior a la primera barra', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    expect(() => ACCIONESHISTORICO('GGAL', '2020-01-01')).toThrow(
      /No hay datos históricos/
    );
  });

  test('cachea el escalar: segunda llamada no re-fetchea', () => {
    fetchMock.mockReturnValue(createResponse(200, SERIE_GGAL));

    const a = ACCIONESHISTORICO('GGAL', '2024-01-15', 'c');
    const b = ACCIONESHISTORICO('GGAL', '2024-01-15', 'c');

    expect(a).toBe(115);
    expect(b).toBe(115);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
