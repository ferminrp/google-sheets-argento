/**
 * Helpers compartidos para series históricas OHLC de data912
 * (stocks, cedears, bonds).
 *
 * Endpoint: GET https://data912.com/historical/{segmento}/{ticker}
 * Campos: date, o, h, l, c, v, dr, sa
 *
 * La API no filtra por fecha: descarga la serie completa. Solo se cachea
 * el valor escalar resuelto (payloads 100–600KB no entran en CacheService).
 */

var ATRIBUTOS_HISTORICO = ['o', 'h', 'l', 'c', 'v', 'dr', 'sa'];
var SEGMENTOS_HISTORICO = ['stocks', 'cedears', 'bonds'];
var HISTORICO_TTL_PASADO = 21600; // 6h — EOD no cambia
var HISTORICO_TTL_ULTIMO = 300;   // 5 min — último bar se mueve

/**
 * Cotización histórica de un símbolo en un segmento data912.
 *
 * @param {string} segmento 'stocks' | 'cedears' | 'bonds'
 * @param {*} symbol Ticker del instrumento
 * @param {*} fecha Fecha opcional 'YYYY-MM-DD' o 'DD/MM/YYYY'. Sin fecha → último bar.
 * @param {*} campo Campo OHLC a devolver (default 'c')
 * @param {string} nombreMercado Nombre legible para mensajes de error
 * @return {*} Valor del campo solicitado
 */
function historicoCotizacion(segmento, symbol, fecha, campo, nombreMercado) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido.");
  }

  var seg = (segmento || '').toString().toLowerCase().trim();
  if (SEGMENTOS_HISTORICO.indexOf(seg) === -1) {
    throw new Error(
      "Segmento histórico inválido: '" + segmento + "'. " +
      "Segmentos disponibles: " + SEGMENTOS_HISTORICO.join(', ') + "."
    );
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = (campo === undefined || campo === null || campo === '')
    ? 'c'
    : campo.toString().toLowerCase().trim();

  if (ATRIBUTOS_HISTORICO.indexOf(atributo) === -1) {
    throw new Error(
      "Campo inválido: '" + campo + "'. Campos disponibles: " +
      ATRIBUTOS_HISTORICO.join(', ') + "."
    );
  }

  var esUltimo = (fecha === undefined || fecha === null || fecha === '');
  var fechaISO = null;
  if (!esUltimo) {
    try {
      fechaISO = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  var fechaCacheKey = esUltimo ? 'ultimo' : fechaISO;
  var scalarKey = 'hist:' + seg + ':' + simbolo + ':' + fechaCacheKey + ':' + atributo;
  var scalarTtl = esUltimo ? HISTORICO_TTL_ULTIMO : HISTORICO_TTL_PASADO;

  var cachedScalar = cacheGet_(scalarKey);
  if (cachedScalar != null) {
    try {
      return JSON.parse(cachedScalar);
    } catch (parseErr) {
      // cache corrupto: seguir con fetch
    }
  }

  var url = 'https://data912.com/historical/' + seg + '/' + encodeURIComponent(simbolo);
  var datos = fetchJson(url, { skipCache: true });

  if (datos && typeof datos === 'object' && !Array.isArray(datos) && datos.Error) {
    throw new Error(
      "Símbolo inválido: '" + symbol + "'. No se encontró en el histórico de " +
      nombreMercado + "."
    );
  }

  if (!datos || !Array.isArray(datos) || !datos.length) {
    throw new Error(
      "No se recibieron datos históricos de " + nombreMercado +
      " para el símbolo '" + symbol + "'."
    );
  }

  var barra;
  if (esUltimo) {
    barra = datos[datos.length - 1];
  } else {
    barra = buscarBarraHistorica_(datos, fechaISO);
    if (!barra) {
      throw new Error(
        "No hay datos históricos de '" + simbolo + "' en o antes de " +
        fechaISO + "."
      );
    }
  }

  if (barra[atributo] === undefined || barra[atributo] === null) {
    throw new Error(
      "El campo '" + atributo + "' no está disponible para '" + simbolo +
      "' en la fecha " + (barra.date || fechaCacheKey) + "."
    );
  }

  var valor = barra[atributo];
  try {
    cachePut_(scalarKey, JSON.stringify(valor), scalarTtl);
  } catch (e) {
    // cache best-effort
  }
  return valor;
}

/**
 * Busca la barra con date exacta o el último día hábil ≤ fechaISO.
 * Asume serie ordenada ascendente por date (como devuelve data912).
 *
 * @param {Array} serie
 * @param {string} fechaISO 'YYYY-MM-DD'
 * @return {Object|null}
 */
function buscarBarraHistorica_(serie, fechaISO) {
  var mejor = null;
  for (var i = 0; i < serie.length; i++) {
    var item = serie[i];
    if (!item || !item.date) continue;
    if (item.date === fechaISO) {
      return item;
    }
    if (item.date < fechaISO) {
      mejor = item;
    } else if (item.date > fechaISO) {
      // serie ascendente: no hay más candidatos ≤ fecha
      break;
    }
  }
  return mejor;
}
