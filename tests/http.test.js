function createResponse(statusCode, body) {
  return {
    getResponseCode: () => statusCode,
    getContentText: () => (typeof body === 'string' ? body : JSON.stringify(body)),
  };
}

describe("fetchJson", () => {
  let fetchJson;
  let fetchMock;
  let cacheStore;

  beforeEach(() => {
    jest.resetModules();
    cacheStore = new Map();
    fetchMock = jest.fn();

    global.UrlFetchApp = { fetch: fetchMock };
    global.Utilities = {};
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

    ({ fetchJson } = require("./test-wrapper"));
  });

  afterEach(() => {
    delete global.UrlFetchApp;
    delete global.Utilities;
    delete global.DriveApp;
    delete global.Logger;
    delete global.CacheService;
  });

  test("devuelve JSON en respuesta 200", () => {
    fetchMock.mockReturnValue(createResponse(200, { ok: true }));
    expect(fetchJson("https://example.com/data")).toEqual({ ok: true });
  });

  test("lanza error en HTTP 500", () => {
    fetchMock.mockReturnValue(createResponse(500, { message: "boom" }));
    expect(() => fetchJson("https://example.com/data")).toThrow("Error HTTP 500");
  });

  test("cache hit no vuelve a llamar UrlFetchApp", () => {
    fetchMock.mockReturnValue(createResponse(200, { n: 1 }));
    const opts = { cacheKey: "t:1", cacheTtlSeconds: 60 };

    expect(fetchJson("https://example.com/data", opts)).toEqual({ n: 1 });
    expect(fetchJson("https://example.com/data", opts)).toEqual({ n: 1 });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  test("skipCache ignora cache", () => {
    fetchMock.mockReturnValue(createResponse(200, { n: 1 }));
    fetchJson("https://example.com/data", { cacheKey: "t:2", cacheTtlSeconds: 60 });
    fetchJson("https://example.com/data", { cacheKey: "t:2", skipCache: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
