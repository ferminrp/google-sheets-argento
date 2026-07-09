/**
 * Helpers HTTP + cache para Google Apps Script.
 * Usa CacheService.getScriptCache() cuando está disponible.
 * Los valores de cache no están garantizados; siempre se puede re-fetchear.
 */

var HTTP_CACHE_MAX_CHARS = 90000; // margen bajo el límite ~100KB de CacheService
var HTTP_DEFAULT_TTL = 120;

/**
 * Lee un valor del script cache. Devuelve null si no hay cache, falla o no hay key.
 *
 * @param {string} key
 * @return {string|null}
 */
function cacheGet_(key) {
  if (!key) return null;
  try {
    if (typeof CacheService === 'undefined' || !CacheService.getScriptCache) {
      return null;
    }
    var cache = CacheService.getScriptCache();
    if (!cache) return null;
    return cache.get(key);
  } catch (e) {
    return null;
  }
}

/**
 * Guarda un valor en el script cache. Ignora fallos y payloads grandes.
 *
 * @param {string} key
 * @param {string} value
 * @param {number} ttlSeconds
 */
function cachePut_(key, value, ttlSeconds) {
  if (!key || value == null) return;
  if (value.length > HTTP_CACHE_MAX_CHARS) return;
  try {
    if (typeof CacheService === 'undefined' || !CacheService.getScriptCache) {
      return;
    }
    var cache = CacheService.getScriptCache();
    if (!cache) return;
    var ttl = ttlSeconds || HTTP_DEFAULT_TTL;
    if (ttl < 1) ttl = 1;
    if (ttl > 21600) ttl = 21600;
    cache.put(key, value, ttl);
  } catch (e) {
    // Cache es best-effort
  }
}

/**
 * Fetch JSON con muteHttpExceptions, validación de status y cache opcional.
 *
 * @param {string} url
 * @param {Object} [options]
 * @param {Object} [options.headers] Headers HTTP adicionales
 * @param {string} [options.cacheKey] Clave de CacheService
 * @param {number} [options.cacheTtlSeconds] TTL en segundos (default 120)
 * @param {boolean} [options.skipCache] Si true, no lee ni escribe cache
 * @return {*} JSON parseado
 */
function fetchJson(url, options) {
  options = options || {};
  var cacheKey = options.cacheKey;
  var skipCache = options.skipCache === true;
  var ttl = options.cacheTtlSeconds != null ? options.cacheTtlSeconds : HTTP_DEFAULT_TTL;

  if (!skipCache && cacheKey) {
    var cached = cacheGet_(cacheKey);
    if (cached != null) {
      try {
        return JSON.parse(cached);
      } catch (parseCacheError) {
        // Cache corrupto: seguir con fetch
      }
    }
  }

  var fetchOptions = {
    muteHttpExceptions: true,
    headers: options.headers || {}
  };

  var respuesta;
  try {
    respuesta = UrlFetchApp.fetch(url, fetchOptions);
  } catch (fetchError) {
    throw new Error("Error de red al consultar la API: " + fetchError.message);
  }

  var code = respuesta.getResponseCode();
  var text = respuesta.getContentText();

  if (code < 200 || code >= 300) {
    var detalle = text;
    try {
      var errBody = JSON.parse(text);
      if (errBody && errBody.message) {
        detalle = errBody.message;
      } else if (errBody && errBody.error) {
        detalle = errBody.error;
      } else if (errBody && errBody.errors && errBody.errors[0] && errBody.errors[0].message) {
        detalle = errBody.errors[0].message;
      }
    } catch (e) {
      if (detalle && detalle.length > 200) {
        detalle = detalle.substring(0, 200) + "...";
      }
    }
    throw new Error("Error HTTP " + code + " al consultar la API: " + detalle);
  }

  var datos;
  try {
    datos = JSON.parse(text);
  } catch (parseError) {
    throw new Error("Respuesta inválida (no JSON) de la API.");
  }

  if (!skipCache && cacheKey) {
    try {
      cachePut_(cacheKey, text, ttl);
    } catch (e) {
      // ignore
    }
  }

  return datos;
}
