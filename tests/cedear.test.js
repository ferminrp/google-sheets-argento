function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

const CEDEARS_FIXTURE = [
  {
    Cedears: 'AAPL',
    Name: 'Apple Inc.',
    Market: 'NASDAQ',
    Ratio: '20',
    TickerOriginal: 'AAPL',
    'yfinance-metadata': {
      yahoo_symbol: 'AAPL',
      fetched_at: '2026-07-21T10:00:00Z',
      sector: 'Technology',
      industry: 'Consumer Electronics',
      website: 'https://www.apple.com',
      city: 'Cupertino',
      employees: 164000,
    },
  },
  {
    Cedears: 'WBA',
    Name: 'Walgreens Boots Alliance Inc',
    Market: 'NASDAQ',
    Ratio: '9',
    TickerOriginal: 'WBA',
    'yfinance-metadata': {
      yahoo_symbol: 'WBA',
      fetched_at: '2026-07-21T10:00:00Z',
      error: 'no_data',
    },
  },
  {
    Cedears: 'XYZ',
    Name: 'Legacy Corp',
    Market: 'NYSE',
    Ratio: '1',
    TickerOriginal: 'XYZ',
  },
];

describe('CEDEAR metadata yfinance', () => {
  let CEDEAR;
  let fetchMock;

  beforeEach(() => {
    jest.resetModules();
    fetchMock = jest.fn();

    global.UrlFetchApp = { fetch: fetchMock };
    global.Utilities = {};
    global.DriveApp = {
      getFilesByName: () => ({
        hasNext: () => false,
      }),
    };
    global.Logger = { log: jest.fn() };
    global.CacheService = {
      getScriptCache: () => ({
        get: () => null,
        put: () => {},
      }),
    };

    fetchMock.mockReturnValue(createResponse(200, CEDEARS_FIXTURE));
    ({ CEDEAR } = require('./test-wrapper'));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
    delete global.CacheService;
  });

  test('sector devuelve metadata yfinance del JSON', () => {
    expect(CEDEAR('AAPL', 'sector')).toBe('Technology');
  });

  test('website e industry devuelven metadata yfinance', () => {
    expect(CEDEAR('AAPL', 'website')).toBe('https://www.apple.com');
    expect(CEDEAR('AAPL', 'industry')).toBe('Consumer Electronics');
  });

  test('campo ausente en metadata devuelve string vacío', () => {
    expect(CEDEAR('AAPL', 'long_description')).toBe('');
  });

  test('error de yfinance se puede consultar explícitamente', () => {
    expect(CEDEAR('WBA', 'error')).toBe('no_data');
    expect(CEDEAR('WBA', 'sector')).toBe('');
  });

  test('sin bloque yfinance-metadata lanza error claro', () => {
    expect(() => CEDEAR('XYZ', 'sector')).toThrow("Metadata yfinance no disponible para 'XYZ'");
  });
});
