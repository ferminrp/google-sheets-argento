/**
 * Helpers compartidos para paneles live de data912 (acciones, bonos, etc.).
 */

var ATRIBUTOS_PANEL = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];

/**
 * Cotización de un símbolo en un panel live.
 *
 * @param {string} url URL del panel
 * @param {*} symbol Símbolo del instrumento
 * @param {*} value Atributo a devolver
 * @param {string} nombreMercado Nombre para mensajes de error (ej: 'acciones')
 * @param {string} cacheKey Clave de cache del panel
 * @return {*} Valor del atributo
 */
function panelCotizacion(url, symbol, value, nombreMercado, cacheKey) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido.");
  }
  if (value === undefined || value === null || value === '') {
    throw new Error("Atributo no proporcionado. Atributos disponibles: " + ATRIBUTOS_PANEL.join(', ') + ".");
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();

  if (!ATRIBUTOS_PANEL.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: " + ATRIBUTOS_PANEL.join(', ') + ".");
  }

  var datos = fetchJson(url, {
    cacheKey: cacheKey,
    cacheTtlSeconds: 60
  });

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos del panel de " + nombreMercado + ".");
  }

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }

  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de " + nombreMercado + " disponibles.");
}

/**
 * Lista completa de un panel live como matriz (headers + filas).
 *
 * @param {string} url URL del panel
 * @param {string} cacheKey Clave de cache del panel
 * @return {Array}
 */
function panelLista(url, cacheKey) {
  var datos = fetchJson(url, {
    cacheKey: cacheKey,
    cacheTtlSeconds: 60
  });

  var columnas = ATRIBUTOS_PANEL.slice();
  columnas.unshift('symbol');

  var resultado = [columnas];
  if (!datos || !datos.length) {
    return resultado;
  }
  for (var i = 0; i < datos.length; i++) {
    var item = datos[i];
    var fila = [];
    for (var j = 0; j < columnas.length; j++) {
      fila.push(item[columnas[j]]);
    }
    resultado.push(fila);
  }
  return resultado;
}
