/**
 * Obtiene información de CEDEARs (Certificados de Depósito Argentinos) desde la API.
 *
 * @param {string} symbol El símbolo del CEDEAR (ej: 'AAPL', 'MSFT', 'GOOGL')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual),
 *                      'name' (nombre completo), 'ratio' (ratio de conversión),
 *                      'market' (mercado donde cotiza el subyacente),
 *                      'ticker_original' (ticker del subyacente en su mercado de origen),
 *                      o campos de yfinance-metadata (sector, industry, website, long_description, etc.)
 * @return El valor del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function CEDEAR(symbol, value) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: 'AAPL').");
  }
  if (value === undefined || value === null || value === '') {
    throw new Error('Atributo no proporcionado. Atributos disponibles: ' + mensajeAtributosCedear() + '.');
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();

  if (esAtributoDesdeJsonCedear(atributo)) {
    return getCedearDataFromJson(simbolo, atributo);
  }

  return panelCotizacion(
    'https://data912.com/live/arg_cedears',
    simbolo,
    atributo,
    'CEDEARs',
    'panel:arg_cedears'
  );
}

var ATRIBUTOS_JSON_CEDEAR = ['name', 'ratio', 'market', 'ticker_original'];
var ATRIBUTOS_YFINANCE_METADATA = ['yahoo_symbol', 'fetched_at', 'long_description', 'city', 'state', 'country', 'zip', 'address', 'sector', 'industry', 'website', 'phone', 'employees', 'long_name', 'short_name', 'exchange', 'quote_type', 'currency', 'logo_url', 'error'];

function esAtributoDesdeJsonCedear(atributo) {
  return ATRIBUTOS_JSON_CEDEAR.indexOf(atributo) !== -1 ||
    ATRIBUTOS_YFINANCE_METADATA.indexOf(atributo) !== -1;
}

function mensajeAtributosCedear() {
  return (
    'c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change, name, ratio, market, ticker_original, ' +
    ATRIBUTOS_YFINANCE_METADATA.join(', ')
  );
}

/**
 * Obtiene datos de CEDEARs desde el archivo JSON local.
 *
 * @param {string} symbol El símbolo del CEDEAR
 * @param {string} attribute El atributo que se quiere obtener
 * @return El valor del atributo solicitado
 */
function buscarCedearEnJson(cedears, symbol, attribute) {
  for (var i = 0; i < cedears.length; i++) {
    if (cedears[i].Cedears === symbol) {
      if (attribute === 'name') {
        return cedears[i].Name;
      } else if (attribute === 'ratio') {
        // N CEDEARs = 1 acción subyacente (ej. "20"). Ver doc/CEDEAR.md.
        return cedears[i].Ratio;
      } else if (attribute === 'market') {
        return cedears[i].Market;
      } else if (attribute === 'ticker_original') {
        return cedears[i].TickerOriginal;
      } else if (ATRIBUTOS_YFINANCE_METADATA.indexOf(attribute) !== -1) {
        return obtenerCedearMetadataYfinance(cedears[i], symbol, attribute);
      }
    }
  }
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en el archivo de CEDEARs.");
}

function obtenerCedearMetadataYfinance(item, symbol, attribute) {
  var metadata = item['yfinance-metadata'];
  if (!metadata) {
    throw new Error("Metadata yfinance no disponible para '" + symbol + "'.");
  }
  if (metadata[attribute] === undefined || metadata[attribute] === null) {
    return '';
  }
  return metadata[attribute];
}

function cargarCedearsDesdeDrive() {
  var files = DriveApp.getFilesByName('cedears.json');
  if (!files.hasNext()) {
    return null;
  }
  var content = files.next().getBlob().getDataAsString();
  return JSON.parse(content);
}

function cargarCedearsDesdeGitHub() {
  return fetchJson(
    'https://raw.githubusercontent.com/ferminrp/google-sheets-argento/main/data/cedears.json',
    {
      cacheKey: 'cedears:json',
      cacheTtlSeconds: 3600
    }
  );
}

function getCedearDataFromJson(symbol, attribute) {
  var cedears = null;

  try {
    cedears = cargarCedearsDesdeDrive();
  } catch (e) {
    cedears = null;
  }

  if (!cedears) {
    try {
      cedears = cargarCedearsDesdeGitHub();
    } catch (err) {
      throw new Error("Error al obtener datos de CEDEARs: " + err.message);
    }
  }

  return buscarCedearEnJson(cedears, symbol, attribute);
}

/**
 * Obtiene la lista completa de CEDEARs (Certificados de Depósito Argentinos) desde la API.
 *
 * @return Un arreglo bidimensional con todos los CEDEARs y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function CEDEARLISTA() {
  return panelLista('https://data912.com/live/arg_cedears', 'panel:arg_cedears');
}

/**
 * Obtiene un valor histórico OHLC de un CEDEAR (data912).
 *
 * @param {string} symbol Símbolo del CEDEAR (ej: 'AAPL', 'MSFT', 'MELI')
 * @param {string} fecha [Opcional] 'YYYY-MM-DD' o 'DD/MM/YYYY'. Sin fecha → último bar.
 *                      Si no hay rueda ese día, usa el último día hábil ≤ fecha.
 * @param {string} campo [Opcional] o, h, l, c, v, dr, sa. Por defecto: 'c'
 * @return El valor del campo solicitado
 * @customfunction
 */
function CEDEARHISTORICO(symbol, fecha, campo) {
  return historicoCotizacion('cedears', symbol, fecha, campo, 'CEDEARs');
}
