/**
 * Obtiene información de CEDEARs (Certificados de Depósito Argentinos) desde la API.
 *
 * @param {string} symbol El símbolo del CEDEAR (ej: 'AAPL', 'MSFT', 'GOOGL')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual),
 *                      'name' (nombre completo), 'ratio' (ratio de conversión),
 *                      'market' (mercado donde cotiza el subyacente)
 * @return El valor del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function cedear(symbol, value) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: 'AAPL').");
  }
  if (value === undefined || value === null || value === '') {
    throw new Error("Atributo no proporcionado. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change, name, ratio, market.");
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();

  var atributosPermitidosJson = ['name', 'ratio', 'market'];

  if (atributosPermitidosJson.includes(atributo)) {
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

/**
 * Obtiene datos de CEDEARs desde el archivo JSON local.
 *
 * @param {string} symbol El símbolo del CEDEAR
 * @param {string} attribute El atributo que se quiere obtener ('name', 'ratio' o 'market')
 * @return El valor del atributo solicitado
 */
function buscarCedearEnJson(cedears, symbol, attribute) {
  for (var i = 0; i < cedears.length; i++) {
    if (cedears[i].Cedears === symbol) {
      if (attribute === 'name') {
        return cedears[i].Name;
      } else if (attribute === 'ratio') {
        // Se devuelve el string original del JSON ("20" o "1:3"). Ver doc/CEDEAR.md.
        return cedears[i].Ratio;
      } else if (attribute === 'market') {
        return cedears[i].Market;
      }
    }
  }
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en el archivo de CEDEARs.");
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
function cedearLista() {
  return panelLista('https://data912.com/live/arg_cedears', 'panel:arg_cedears');
}
