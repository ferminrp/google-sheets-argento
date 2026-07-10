// Archivo consolidado generado automáticamente
// No editar a mano: npm run build

// Namespace para constantes compartidas
var CONSTANTS = {};

// Inicializar constantes compartidas
CONSTANTS.DERECHOS_MERCADO_TASA_DIARIA = 0.045 / 100 / 90;
CONSTANTS.GASTOS_GARANTIA_TASA_DIARIA = 0.045 / 100 / 90;
CONSTANTS.IVA_PORCENTAJE = 21 / 100;
CONSTANTS.ARANCEL_CAUCION_COLOCADORA_TNA = 1.5 / 100;
CONSTANTS.ARANCEL_CAUCION_TOMADORA_TNA = 4.0 / 100;
CONSTANTS.HTTP_CACHE_MAX_CHARS = 90000;
CONSTANTS.HTTP_DEFAULT_TTL = 120;
CONSTANTS.ATRIBUTOS_HISTORICO = ['o', 'h', 'l', 'c', 'v', 'dr', 'sa'];
CONSTANTS.SEGMENTOS_HISTORICO = ['stocks', 'cedears', 'bonds'];
CONSTANTS.HISTORICO_TTL_PASADO = 21600;
CONSTANTS.HISTORICO_TTL_ULTIMO = 300;
CONSTANTS.ATRIBUTOS_PANEL = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];

// ================ acciones.js ================
/**
 * Obtiene información de acciones que cotizan en el mercado argentino desde la API.
 *
 * @param {string} symbol El símbolo de la acción (ej: 'YPFD', 'ALUA', 'PAMP')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual)
 * @return El valor numérico del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function ACCIONES(symbol, value) {
  return panelCotizacion(
    'https://data912.com/live/arg_stocks',
    symbol,
    value,
    'acciones',
    'panel:arg_stocks'
  );
}

/**
 * Obtiene la lista completa de acciones que cotizan en el mercado argentino desde la API.
 *
 * @return Un arreglo bidimensional con todas las acciones y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function ACCIONESLISTA() {
  return panelLista('https://data912.com/live/arg_stocks', 'panel:arg_stocks');
}

/**
 * Obtiene un valor histórico OHLC de una acción argentina (data912).
 *
 * @param {string} symbol Símbolo (ej: 'GGAL', 'YPFD', 'PAMP')
 * @param {string} fecha [Opcional] 'YYYY-MM-DD' o 'DD/MM/YYYY'. Sin fecha → último bar.
 *                      Si no hay rueda ese día, usa el último día hábil ≤ fecha.
 * @param {string} campo [Opcional] o, h, l, c, v, dr, sa. Por defecto: 'c'
 * @return El valor del campo solicitado
 * @customfunction
 */
function ACCIONESHISTORICO(symbol, fecha, campo) {
  return historicoCotizacion('stocks', symbol, fecha, campo, 'acciones');
}

// ================ bcra.js ================
/**
 * Devuelve un array con todas las variables disponibles del BCRA (Banco Central de la República Argentina).
 * Cada elemento contiene el ID de la variable y su valor actual.
 *
 * @return {Array} Un array de variables del BCRA donde cada elemento es [idVariable, valor]
 * @customfunction
 */
function BCRAVARIABLES() {
  try {
    var data = fetchBcraMonetarias_();
    return data.results.map(function(item) {
      return [item.categoria, item.idVariable, item.descripcion, item.valor, item.fecha];
    });
  } catch (error) {
    throw new Error("Error al consultar el BCRA: " + error.message);
  }
}

/**
 * Obtiene datos de la API del BCRA (Banco Central de la República Argentina)
 * y devuelve el último valor para una variable específica según su ID.
 *
 * @param {number} id - The ID of the variable to fetch
 * @return The value of the specified variable
 * @customfunction
 */
function BCRA(id) {
  if (id === undefined || id === null || id === '' || isNaN(parseInt(id, 10))) {
    throw new Error("ID inválido. Debe ser un número válido (1, 4, 5, 6, etc).");
  }

  var variableId = parseInt(id, 10);

  try {
    var data = fetchBcraMonetarias_();
    var variable = data.results.find(function(item) {
      return Number(item.idVariable) === variableId;
    });

    if (variable) {
      return variable.valor;
    }
    throw new Error(
      "Variable con ID " + variableId + " no encontrada. IDs disponibles: " +
      data.results.map(function(item) { return item.idVariable; }).join(', ') + "."
    );
  } catch (error) {
    throw new Error("Error al consultar el BCRA: " + error.message);
  }
}

/**
 * @return {{status: number, results: Array}}
 */
function fetchBcraMonetarias_() {
  var data = fetchJson("https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias", {
    cacheKey: 'api:bcra:monetarias',
    cacheTtlSeconds: 300
  });

  if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
    throw new Error("Error en la respuesta de la API del BCRA.");
  }
  return data;
}

// ================ bonos.js ================
/**
 * Obtiene información de bonos que cotizan en el mercado argentino desde la API.
 *
 * @param {string} symbol El símbolo del bono (ej: 'AL30', 'GD30', 'AE38')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual)
 * @return El valor numérico del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function BONOS(symbol, value) {
  return panelCotizacion(
    'https://data912.com/live/arg_bonds',
    symbol,
    value,
    'bonos',
    'panel:arg_bonds'
  );
}

/**
 * Obtiene la lista completa de bonos que cotizan en el mercado argentino desde la API.
 *
 * @return {Array} Un arreglo con todos los bonos y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function BONOSLISTA() {
  return panelLista('https://data912.com/live/arg_bonds', 'panel:arg_bonds');
}

/**
 * Obtiene un valor histórico OHLC de un bono argentino (data912).
 *
 * @param {string} symbol Símbolo del bono (ej: 'AL30', 'GD30', 'AE38')
 * @param {string} fecha [Opcional] 'YYYY-MM-DD' o 'DD/MM/YYYY'. Sin fecha → último bar.
 *                      Si no hay rueda ese día, usa el último día hábil ≤ fecha.
 * @param {string} campo [Opcional] o, h, l, c, v, dr, sa. Por defecto: 'c'
 * @return El valor del campo solicitado
 * @customfunction
 */
function BONOSHISTORICO(symbol, fecha, campo) {
  return historicoCotizacion('bonds', symbol, fecha, campo, 'bonos');
}

// ================ caucion.js ================
// https://www.byma.com.ar/que-es-byma/derechos-membresias-2/
// https://www.byma.com.ar/wp-content/uploads/dlm_uploads/2023/10/BYMA-Derechos-Mercado-sobre-Operaciones-2023-10-11.pdf
// Proporcional al plazo de la operación hasta 90 días, sobre mayor valor
// Constante CONSTANTS.DERECHOS_MERCADO_TASA_DIARIA movida al namespace CONSTANTS
// const DERECHOS_MERCADO_TASA_DIARIA = 0.045 / 100 / 90;
// Constante CONSTANTS.GASTOS_GARANTIA_TASA_DIARIA movida al namespace CONSTANTS
// const GASTOS_GARANTIA_TASA_DIARIA = 0.045 / 100 / 90;
// Constante CONSTANTS.IVA_PORCENTAJE movida al namespace CONSTANTS
// const IVA_PORCENTAJE = 21 / 100;
// Constante CONSTANTS.ARANCEL_CAUCION_COLOCADORA_TNA movida al namespace CONSTANTS
// const ARANCEL_CAUCION_COLOCADORA_TNA = 1.5 / 100;
// Constante CONSTANTS.ARANCEL_CAUCION_TOMADORA_TNA movida al namespace CONSTANTS
// const ARANCEL_CAUCION_TOMADORA_TNA = 4.0 / 100;

/**
 * Calcula los costos y rendimientos de operaciones de caución colocadora.
 * En una caución colocadora, el inversor presta dinero y recibe intereses.
 *
 * @param {number} dias Días de la caución (debe ser un número positivo).
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @return {number} Importe neto de la operación.
 * @customfunction
 */
function CAUCIONCOLOCADORA(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna
) {
  if (dias <= 0) {
    throw new Error(
      "Para caución colocadora, los días deben ser un número positivo."
    );
  }
  return CALCULARCAUCION(-dias, tna, importeBruto, arancelCaucionColocadoraTna)
    .importeNeto;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución tomadora.
 * En una caución tomadora, el inversor toma prestado dinero y paga intereses.
 *
 * @param {number} dias Días de la caución (debe ser un número positivo).
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {number} Importe neto de la operación.
 * @customfunction
 */
function CAUCIONTOMADORA(dias, tna, importeBruto, arancelCaucionTomadoraTna) {
  if (dias <= 0) {
    throw new Error(
      "Para caución tomadora, los días deben ser un número positivo."
    );
  }
  return CALCULARCAUCION(
    dias,
    tna,
    importeBruto,
    undefined,
    arancelCaucionTomadoraTna
  ).importeNeto;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución (repo) en el mercado argentino.
 *
 * @param {number} dias Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora.
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {Object} Un objeto con todos los valores calculados de la operación.
 * @customfunction
 */
function CAUCION(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  const calculoCaucion = CALCULARCAUCION(
    dias,
    tna,
    importeBruto,
    arancelCaucionColocadoraTna,
    arancelCaucionTomadoraTna
  );
  return calculoCaucion.importeNeto;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución (repo) en el mercado argentino.
 *
 * @param {number} dias Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora.
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {Array} Un array con todos los valores calculados de la operación.
 * @customfunction
 */
function CAUCIONDETALLADA(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  const resultado = CALCULARCAUCION(
    dias,
    tna,
    importeBruto,
    arancelCaucionColocadoraTna,
    arancelCaucionTomadoraTna
  );

  // Convertir el objeto resultado en un array bidimensional [clave, valor]
  return [
    ["Días", resultado.dias],
    ["TNA", resultado.tna],
    ["Importe Bruto", resultado.importeBruto],
    ["Tasa Efectiva", resultado.tasa],
    ["Tipo", resultado.esColocadora ? "Colocadora" : "Tomadora"],
    ["Tasa Arancel", resultado.arancelTna],
    ["Interés", resultado.interes],
    ["Interés Neto", resultado.interesNeto],
    ["Importe con Interés", resultado.importeConInteres],
    ["Arancel", resultado.arancel],
    ["Derechos de Mercado", resultado.derechosMercado],
    ["Gastos de Garantía", resultado.gastosGarantia],
    ["Gastos Totales", resultado.gastos],
    ["IVA sobre Gastos", resultado.ivaGastos],
    ["Total Gastos con IVA", resultado.totalGastos],
    ["Importe Neto", resultado.importeNeto]
  ];
}

/**
 * Calcula la tasa efectiva para el período de la operación.
 *
 * @param {number} tna - Tasa nominal anual (TNA) de la operación.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Tasa efectiva para el período.
 */
function calcularTasaEfectiva(tna, diasAbs) {
  return Math.abs((tna * diasAbs) / 365);
}

/**
 * Calcula el interés bruto de la operación.
 *
 * @param {number} importeBruto - Monto bruto de la operación.
 * @param {number} tasa - Tasa efectiva para el período.
 * @returns {number} Interés bruto calculado.
 */
function calcularInteres(importeBruto, tasa) {
  return importeBruto * tasa;
}

/**
 * Calcula el arancel (comisión) de la operación.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} arancelTna - Tasa nominal anual del arancel.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Monto del arancel.
 */
function calcularArancel(importeConInteres, arancelTna, diasAbs) {
  return importeConInteres * ((arancelTna * diasAbs) / 365);
}

/**
 * Calcula los derechos de mercado de la operación.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Monto de derechos de mercado.
 */
function calcularDerechosMercado(importeConInteres, diasAbs) {
  return importeConInteres * CONSTANTS.DERECHOS_MERCADO_TASA_DIARIA * diasAbs;
}

/**
 * Calcula los gastos de garantía de la operación.
 * Solo aplica para cauciones tomadoras.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @param {boolean} esColocadora - Indica si es una caución colocadora.
 * @returns {number} Monto de gastos de garantía.
 */
function calcularGastosGarantia(importeConInteres, diasAbs, esColocadora) {
  return esColocadora
    ? 0
    : importeConInteres * CONSTANTS.GASTOS_GARANTIA_TASA_DIARIA * diasAbs;
}

/**
 * Calcula el IVA.
 *
 * @param {number} total - Total sin IVA.
 * @returns {number} Import calculado de IVA.
 */
function calcularIva(total) {
  const iva = total * CONSTANTS.IVA_PORCENTAJE;
  return iva;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución (repo) en el mercado argentino.
 *
 * @param {number} dias Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora.
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {Object} Un objeto con todos los valores calculados de la operación.
 * @customfunction
 */
function CALCULARCAUCION(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  // Valores por defecto para los aranceles (0 es un valor válido)
  if (arancelCaucionColocadoraTna === undefined || arancelCaucionColocadoraTna === null || arancelCaucionColocadoraTna === '') {
    arancelCaucionColocadoraTna = CONSTANTS.ARANCEL_CAUCION_COLOCADORA_TNA;
  }
  if (arancelCaucionTomadoraTna === undefined || arancelCaucionTomadoraTna === null || arancelCaucionTomadoraTna === '') {
    arancelCaucionTomadoraTna = CONSTANTS.ARANCEL_CAUCION_TOMADORA_TNA;
  }

  // Validación de parámetros
  dias = parseInt(dias, 10);
  if (!Number.isInteger(dias)) {
    throw new Error("El parámetro 'dias' debe ser un número entero.");
  }
  if (dias === 0) {
    throw new Error("El parámetro 'dias' no puede ser 0. Usar un valor positivo (tomadora) o negativo (colocadora).");
  }
  if (typeof tna !== "number" || tna < 0) {
    throw new Error("El parámetro 'tna' debe ser un número positivo.");
  }
  if (typeof importeBruto !== "number" || importeBruto <= 0) {
    throw new Error("El parámetro 'importeBruto' debe ser un número positivo.");
  }

  const diasAbs = Math.abs(dias);
  const esColocadora = dias < 0;

  // Cálculos usando las nuevas funciones
  const tasa = calcularTasaEfectiva(tna, diasAbs);
  const interes = calcularInteres(importeBruto, tasa);
  const importeConInteres = importeBruto + interes;
  const arancelTna = esColocadora
    ? arancelCaucionColocadoraTna
    : arancelCaucionTomadoraTna;

  const arancel = calcularArancel(importeConInteres, arancelTna, diasAbs);
  const derechosMercado = calcularDerechosMercado(importeConInteres, diasAbs);
  const gastosGarantia = calcularGastosGarantia(
    importeConInteres,
    diasAbs,
    esColocadora
  );

  const gastos = arancel + derechosMercado + gastosGarantia;
  const ivaGastos = calcularIva(gastos);
  const totalGastos = gastos + ivaGastos;

  const [interesNeto, importeNeto] = esColocadora
    ? [interes - totalGastos, importeConInteres - totalGastos]
    : [interes + totalGastos, importeConInteres + totalGastos];

  return {
    dias,
    tna,
    importeBruto,
    tasa,
    esColocadora,
    arancelTna,
    interes,
    interesNeto,
    importeConInteres,
    arancel,
    derechosMercado,
    gastosGarantia,
    gastos,
    ivaGastos,
    totalGastos,
    importeNeto,
  };
}

// ================ cedear.js ================
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
function CEDEAR(symbol, value) {
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

// ================ criptoya.js ================
/**
 * Obtiene los precios de compra y venta de criptomonedas desde CriptoYa.
 *
 * @param {string} coin La criptomoneda a consultar (ej: 'BTC', 'ETH', 'USDT')
 * @param {string} fiat La moneda contra la que se opera (ej: 'ARS', 'USD', 'EUR')
 * @param {number} volumen [Opcional] El volumen a operar. Por defecto: 1
 * @param {string} exchange [Opcional] El exchange específico a consultar. Si no se especifica, devuelve el mejor precio.
 * @param {string} operacion [Opcional] Tipo de operación: 'compra', 'venta', 'totalCompra', 'totalVenta'. Por defecto: 'totalCompra'
 * @return El precio de la operación solicitada.
 * @customfunction
 */
function CRIPTOYA(coin, fiat, volumen, exchange, operacion) {
  if (coin === undefined || coin === null || coin === '') {
    throw new Error("Criptomoneda no proporcionada (ej: 'BTC', 'USDT').");
  }
  if (fiat === undefined || fiat === null || fiat === '') {
    throw new Error("Moneda fiat no proporcionada (ej: 'ARS', 'USD').");
  }

  volumen = volumen || 1;
  operacion = operacion || 'totalCompra';

  var cripto = coin.toString().toUpperCase().trim();
  var moneda = fiat.toString().toUpperCase().trim();
  var vol = parseFloat(volumen);
  var tipoOperacion = operacion.toString().toLowerCase().trim();

  var camposOperacion = {
    'compra': 'ask',
    'totalcompra': 'totalAsk',
    'venta': 'bid',
    'totalventa': 'totalBid'
  };

  if (!Object.keys(camposOperacion).includes(tipoOperacion)) {
    throw new Error("Operación inválida: '" + operacion + "'. Operaciones disponibles: compra, totalCompra, venta, totalVenta.");
  }

  var campo = camposOperacion[tipoOperacion];
  var url = 'https://criptoya.com/api/' + encodeURIComponent(cripto) + '/' + encodeURIComponent(moneda) + '/' + vol;

  try {
    var datos = fetchJson(url, {
      headers: { 'Accept': 'application/json' },
      cacheKey: 'criptoya:' + cripto + ':' + moneda + ':' + vol,
      cacheTtlSeconds: 60
    });

    if (exchange) {
      var exchangeKey = exchange.toString().toLowerCase().trim();

      if (!datos[exchangeKey]) {
        var exchangesDisponibles = Object.keys(datos).join(', ');
        throw new Error("Exchange '" + exchange + "' no disponible. Exchanges disponibles: " + exchangesDisponibles);
      }

      if (datos[exchangeKey][campo] === undefined) {
        throw new Error("El campo '" + operacion + "' no está disponible para el exchange '" + exchange + "'");
      }

      return datos[exchangeKey][campo];
    }

    var mejorPrecio;
    if (tipoOperacion.includes('compra')) {
      mejorPrecio = Infinity;
      for (var ex in datos) {
        if (datos[ex][campo] !== undefined && datos[ex][campo] < mejorPrecio) {
          mejorPrecio = datos[ex][campo];
        }
      }
    } else {
      mejorPrecio = -Infinity;
      for (var ex2 in datos) {
        if (datos[ex2][campo] !== undefined && datos[ex2][campo] > mejorPrecio) {
          mejorPrecio = datos[ex2][campo];
        }
      }
    }

    if (mejorPrecio === Infinity || mejorPrecio === -Infinity) {
      throw new Error("No se encontraron precios disponibles para " + cripto + "/" + moneda + " con el tipo de operación '" + operacion + "'");
    }

    return mejorPrecio;
  } catch (e) {
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par " + cripto + "/" + moneda + " no encontrado. Verifica que la cripto y la moneda sean correctas.");
    }
    throw new Error("Error al consultar precio de " + cripto + "/" + moneda + ": " + e.message);
  }
}

// ================ crypto.js ================
/**
 * Obtiene el precio actual de criptomonedas desde la API de Coinbase.
 *
 * @param {string} symbol El símbolo de la criptomoneda (ej: 'BTC', 'ETH', 'SOL')
 * @param {string} moneda [Opcional] Moneda en la que se quiere obtener el precio (ej: 'USD', 'EUR'). Por defecto: 'USD'
 * @return El precio actual de la criptomoneda especificada en la moneda indicada.
 * @customfunction
 */
function CRYPTO(symbol, moneda) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: 'BTC').");
  }

  moneda = moneda || 'USD';

  var cripto = symbol.toString().toUpperCase().trim();
  var divisa = moneda.toString().toUpperCase().trim();
  var par = cripto + '-' + divisa;
  var url = 'https://api.coinbase.com/v2/prices/' + encodeURIComponent(par) + '/spot';

  try {
    var datos = fetchJson(url, {
      headers: { 'Accept': 'application/json' },
      cacheKey: 'crypto:' + par,
      cacheTtlSeconds: 60
    });

    if (!datos || !datos.data || !datos.data.amount) {
      throw new Error("Respuesta inválida de Coinbase");
    }

    return parseFloat(datos.data.amount);
  } catch (e) {
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par de trading no encontrado: '" + par + "'. Verifica que el símbolo y la moneda sean correctos.");
    }
    throw new Error("Error al consultar el precio de " + cripto + ": " + e.message);
  }
}

// ================ dolar.js ================
/**
 * Obtiene la cotización de los distintos tipos de dólar en Argentina.
 *
 * @param {string} tipo La “casa” del dólar: oficial, blue, bolsa/mep, contadoconliqui/ccl, mayorista, cripto o tarjeta.
 * @param {string} operacion 'compra', 'venta' o 'promedio'. Por defecto: 'venta'.
 * @return El valor numérico de la operación solicitada.
 * @customfunction
 */
function DOLAR(tipo, operacion) {
  if (tipo === undefined || tipo === null || tipo === '') {
    throw new Error("Tipo no proporcionado. Usa 'blue', 'oficial', 'mep', 'ccl', etc.");
  }

  operacion = (operacion === undefined || operacion === null || operacion === '')
    ? 'venta'
    : operacion;

  var casa = normalizarCasaDolar_(tipo);
  var op = operacion.toString().toLowerCase().trim();

  var datos = fetchJson('https://dolarapi.com/v1/dolares', {
    cacheKey: 'api:dolarapi:dolares',
    cacheTtlSeconds: 60
  });

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].casa.toLowerCase() === casa) {
      var compra = datos[i].compra;
      var venta = datos[i].venta;

      if (op === 'compra') return compra;
      if (op === 'venta') return venta;
      if (op === 'promedio') {
        if (compra != null && venta != null) return (compra + venta) / 2;
        if (compra != null) return compra;
        if (venta != null) return venta;
        throw new Error("No hay cotización disponible para calcular el promedio de '" + tipo + "'.");
      }

      throw new Error("Operación inválida: '" + operacion + "'. Usa 'compra', 'venta' o 'promedio'.");
    }
  }

  var disponibles = datos.map(function(o) { return o.casa; }).join(', ');
  throw new Error("Tipo inválido: '" + tipo + "'. Tipos disponibles: " + disponibles + " (aliases: mep→bolsa, ccl→contadoconliqui).");
}

/**
 * Normaliza aliases comunes de casas de dólar.
 *
 * @param {*} tipo
 * @return {string}
 */
function normalizarCasaDolar_(tipo) {
  var casa = tipo.toString().toLowerCase().trim().replace(/\s+/g, '');

  if (casa === 'mep' || casa === 'bolsa') {
    return 'bolsa';
  }
  if (casa === 'ccl' || casa === 'contado' || casa === 'contadoconliqui' || casa === 'contadoconliquidacion') {
    return 'contadoconliqui';
  }
  return casa;
}

// ================ dolar_historico.js ================
/**
 * Obtiene la cotización histórica del dólar según el tipo y fecha especificados
 *
 * @param {string} tipo - Tipo de dólar (blue, oficial, mayorista, mep, ccl, etc.)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * @param {string} valor - Opcional: "compra" o "venta" (por defecto es "venta")
 * @return {number} Valor de la cotización para el tipo y fecha solicitados
 * @customfunction
 */
function DOLARHISTORICO(tipo, fecha, valor) {
  valor = valor || "venta";

  if (!tipo) {
    throw new Error("Debe especificar un tipo de dólar");
  }

  var casa = normalizarCasaDolar_(tipo);

  // Si no se proporciona fecha, usar la fecha actual en Argentina
  var fechaISO;
  if (!fecha) {
    var hoy = new Date();
    fechaISO = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fechaISO = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  var campo = valor.toString().toLowerCase().trim();
  if (campo !== "compra" && campo !== "venta") {
    throw new Error("El valor debe ser 'compra' o 'venta'");
  }

  var componentes = obtenerComponentesFecha(fechaISO);
  var url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares/' +
    encodeURIComponent(casa) + '/' +
    componentes.year + '/' + componentes.month + '/' + componentes.day;

  try {
    var cotizacion = fetchJson(url, { skipCache: true });
    if (cotizacion && cotizacion[campo] != null) {
      return cotizacion[campo];
    }
    throw new Error("No se encontró cotización para la fecha y tipo especificados");
  } catch (e) {
    if (e.message && e.message.indexOf('Error HTTP') === 0) {
      throw new Error("No se encontró cotización para la fecha y tipo especificados");
    }
    throw e;
  }
}

/**
 * Obtiene todas las cotizaciones de dólar para una fecha específica
 *
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * @return {Array} Matriz con las cotizaciones de cada tipo de dólar para la fecha
 * @customfunction
 */
function DOLARHISTORICOTODOS(fecha) {
  var fechaISO;
  if (!fecha) {
    var hoy = new Date();
    fechaISO = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fechaISO = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  // Serie completa cacheada (payload grande: solo cachear si entra en el límite de CacheService)
  var data = fetchJson('https://api.argentinadatos.com/v1/cotizaciones/dolares', {
    cacheKey: 'api:ad:dolares:all',
    cacheTtlSeconds: 300
  });

  var cotizaciones = data.filter(function(item) {
    return item.fecha === fechaISO;
  });

  if (cotizaciones.length === 0) {
    throw new Error("No se encontraron cotizaciones para la fecha especificada");
  }

  var resultado = [["Tipo", "Compra", "Venta", "Fecha"]];

  cotizaciones.forEach(function(cotizacion) {
    resultado.push([
      cotizacion.casa,
      cotizacion.compra,
      cotizacion.venta,
      cotizacion.fecha
    ]);
  });

  return resultado;
}

// ================ fci.js ================
/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta", "retornoTotal"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function FCI(tipoFondo, nombreFondo, fecha, campo) {
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';

  var tipoNormalizado = tipo.replace(/\s+/g, '').replace(/[óo]/g, 'o');
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta', 'retornototal'];
  if (!tiposPermitidos.includes(tipoNormalizado)) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta, retornoTotal.");
  }

  var tipoAPI = tipoNormalizado;
  switch (tipoAPI) {
    case 'mercadodinero': tipoAPI = 'mercadoDinero'; break;
    case 'rentavariable': tipoAPI = 'rentaVariable'; break;
    case 'rentafija': tipoAPI = 'rentaFija'; break;
    case 'rentamixta': tipoAPI = 'rentaMixta'; break;
    case 'retornototal': tipoAPI = 'retornoTotal'; break;
  }

  var camposPermitidos = ['vcp', 'ccp', 'patrimonio'];
  if (!camposPermitidos.includes(campoDatos)) {
    throw new Error("Campo inválido. Campos permitidos: vcp (valor cuotaparte), ccp (cantidad cuotapartes), patrimonio.");
  }

  if (!nombre) {
    throw new Error("Debe especificar un nombre de fondo.");
  }

  var url;
  var cacheKey = null;
  if (fecha) {
    try {
      var componentesFecha = obtenerComponentesFecha(fecha);
      url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/' + componentesFecha.year + '/' + componentesFecha.month + '/' + componentesFecha.day + '/';
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  } else {
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/ultimo';
    cacheKey = 'api:ad:fci:' + tipoAPI + ':ultimo';
  }

  try {
    var datos = fetchJson(url, cacheKey ? {
      cacheKey: cacheKey,
      cacheTtlSeconds: 120
    } : { skipCache: true });

    function esFondoValido(item) {
      return item.fondo && !item.fondo.startsWith("Region:") &&
          !item.fondo.startsWith("Duration:") &&
          !item.fondo.startsWith("Benchmark:") &&
          !item.fondo.startsWith("Moneda:");
    }

    function valorCampoFondo(item) {
      var valor = item[campoDatos];
      if (valor === null || valor === undefined) {
        throw new Error("El fondo '" + item.fondo + "' no tiene valor para el campo '" + campo + "'.");
      }
      return valor;
    }

    var nombreLower = nombre.toLowerCase();
    var coincidenciasExactas = [];
    var coincidenciasExactasCI = [];
    var coincidenciasParciales = [];
    var coincidenciasParcialesCI = [];

    for (var i = 0; i < datos.length; i++) {
      if (!esFondoValido(datos[i])) continue;
      var fondoNombre = datos[i].fondo;
      var fondoLower = fondoNombre.toLowerCase();

      if (fondoNombre === nombre) {
        coincidenciasExactas.push(datos[i]);
      } else if (fondoLower === nombreLower) {
        coincidenciasExactasCI.push(datos[i]);
      } else if (fondoNombre.includes(nombre)) {
        coincidenciasParciales.push(datos[i]);
      } else if (fondoLower.includes(nombreLower)) {
        coincidenciasParcialesCI.push(datos[i]);
      }
    }

    function resolverCoincidencias(lista) {
      if (lista.length === 1) return valorCampoFondo(lista[0]);
      if (lista.length > 1) {
        throw new Error("Varios fondos coinciden con '" + nombre + "': " + lista.slice(0, 10).map(function(f) { return f.fondo; }).join(', ') + (lista.length > 10 ? "..." : "."));
      }
      return null;
    }

    var r = resolverCoincidencias(coincidenciasExactas);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasExactasCI);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasParciales);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasParcialesCI);
    if (r !== null) return r;

    var fondosDisponibles = datos
      .filter(esFondoValido)
      .map(function(d) { return d.fondo; })
      .slice(0, 10)
      .join(", ") + "...";

    throw new Error("Fondo '" + nombre + "' no encontrado para el tipo '" + tipoFondo + "'. Algunos fondos disponibles: " + fondosDisponibles);
  } catch (e) {
    if (e.message.includes("Error HTTP") || e.message.includes("Error al consultar")) {
      throw e;
    }
    throw new Error("Error al consultar información de '" + tipoFondo + "': " + e.message);
  }
}

/**
 * Obtiene la lista completa de Fondos Comunes de Inversión (FCI) disponibles en Argentina.
 *
 * @return {Array} Una matriz con todos los fondos disponibles, incluyendo el nombre, tipo y valor de cuotaparte.
 * @customfunction
 */
function FCILISTA() {
  var tipos = ['mercadoDinero', 'rentaVariable', 'rentaFija', 'rentaMixta', 'retornoTotal'];
  var todosLosFondos = [['Nombre del Fondo', 'Tipo de Fondo', 'Valor Cuotaparte']];

  tipos.forEach(function(tipo) {
    try {
      var url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipo + '/ultimo';
      var datos = fetchJson(url, {
        cacheKey: 'api:ad:fci:' + tipo + ':ultimo',
        cacheTtlSeconds: 120
      });

      var fondosValidos = datos.filter(function(d) {
        return d.fondo &&
               !d.fondo.startsWith("Region:") &&
               !d.fondo.startsWith("Duration:") &&
               !d.fondo.startsWith("Benchmark:") &&
               !d.fondo.startsWith("Moneda:");
      });

      fondosValidos.forEach(function(fondo) {
        var nombreFormateado = tipo;
        switch (tipo) {
          case 'mercadoDinero': nombreFormateado = 'Mercado de Dinero'; break;
          case 'rentaVariable': nombreFormateado = 'Renta Variable'; break;
          case 'rentaFija': nombreFormateado = 'Renta Fija'; break;
          case 'rentaMixta': nombreFormateado = 'Renta Mixta'; break;
          case 'retornoTotal': nombreFormateado = 'Retorno Total'; break;
        }

        todosLosFondos.push([
          fondo.fondo,
          nombreFormateado,
          fondo.vcp
        ]);
      });
    } catch (e) {
      Logger.log("Error al consultar fondos de tipo '" + tipo + "': " + e.message);
    }
  });

  return todosLosFondos;
}

// ================ fecha.js ================
/**
 * Utilidades de parseo de fechas para funciones de Google Sheets.
 * Evita desfases UTC y soporta formatos usados en Argentina.
 */

function esFechaValida(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  var fechaUTC = new Date(Date.UTC(year, month - 1, day));
  var fechaLocal = new Date(year, month - 1, day);
  return fechaUTC.getUTCFullYear() === year &&
         (fechaUTC.getUTCMonth() + 1) === month &&
         fechaUTC.getUTCDate() === day &&
         fechaLocal.getFullYear() === year &&
         (fechaLocal.getMonth() + 1) === month &&
         fechaLocal.getDate() === day;
}

/**
 * Parsea una fecha y devuelve componentes year/month/day.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {{year: string, month: string, day: string}}
 */
function obtenerComponentesFecha(fechaInput) {
  var year;
  var month;
  var day;

  if (fechaInput instanceof Date) {
    if (isNaN(fechaInput.getTime())) {
      throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
    year = fechaInput.getFullYear();
    month = fechaInput.getMonth() + 1;
    day = fechaInput.getDate();
  } else {
    var fechaStr = fechaInput.toString().trim();
    var matchISO = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    var matchSlash = fechaStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (matchISO) {
      year = parseInt(matchISO[1], 10);
      month = parseInt(matchISO[2], 10);
      day = parseInt(matchISO[3], 10);
    } else if (matchSlash) {
      day = parseInt(matchSlash[1], 10);
      month = parseInt(matchSlash[2], 10);
      year = parseInt(matchSlash[3], 10);
    } else {
      throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  if (!esFechaValida(year, month, day)) {
    throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  return {
    year: year.toString(),
    month: month.toString().padStart(2, '0'),
    day: day.toString().padStart(2, '0')
  };
}

/**
 * Formatea una fecha de entrada a 'YYYY-MM-DD'.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {string}
 */
function formatearFechaISO(fechaInput) {
  var componentes = obtenerComponentesFecha(fechaInput);
  return componentes.year + '-' + componentes.month + '-' + componentes.day;
}

/**
 * Crea un objeto Date en hora local para comparaciones de rango.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {Date}
 */
function parsearFechaLocal(fechaInput) {
  var componentes = obtenerComponentesFecha(fechaInput);
  return new Date(
    parseInt(componentes.year, 10),
    parseInt(componentes.month, 10) - 1,
    parseInt(componentes.day, 10)
  );
}

// ================ http.js ================
/**
 * Helpers HTTP + cache para Google Apps Script.
 * Usa CacheService.getScriptCache() cuando está disponible.
 * Los valores de cache no están garantizados; siempre se puede re-fetchear.
 */

// Constante CONSTANTS.HTTP_CACHE_MAX_CHARS movida al namespace CONSTANTS
// var HTTP_CACHE_MAX_CHARS = 90000; // margen bajo el límite ~100KB de CacheService
// Constante CONSTANTS.HTTP_DEFAULT_TTL movida al namespace CONSTANTS
// var HTTP_DEFAULT_TTL = 120;

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
  if (value.length > CONSTANTS.HTTP_CACHE_MAX_CHARS) return;
  try {
    if (typeof CacheService === 'undefined' || !CacheService.getScriptCache) {
      return;
    }
    var cache = CacheService.getScriptCache();
    if (!cache) return;
    var ttl = ttlSeconds || CONSTANTS.HTTP_DEFAULT_TTL;
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
  var ttl = options.cacheTtlSeconds != null ? options.cacheTtlSeconds : CONSTANTS.HTTP_DEFAULT_TTL;

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

// ================ inflacion.js ================
/**
 * Obtiene los índices de inflación de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice de inflación para la fecha especificada o el último disponible.
 * @customfunction
 */
function INFLACION(fecha) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/inflacion', {
    cacheKey: 'api:ad:inflacion',
    cacheTtlSeconds: 300
  });

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos de inflación desde la API.");
  }

  if (!fecha) {
    datos.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return datos[0].valor;
  }

  var fechaFormateada;
  try {
    fechaFormateada = formatearFechaISO(fecha);
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }

  var fechasMenores = datos.filter(function(d) {
    return d.fecha <= fechaFormateada;
  });

  if (fechasMenores.length > 0) {
    fechasMenores.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return fechasMenores[0].valor;
  }

  datos.sort(function(a, b) {
    return a.fecha.localeCompare(b.fecha);
  });

  return datos[0].valor;
}

// ================ letras.js ================
/**
 * Fetches data from the API and returns information about Argentine treasury bills (letras).
 *
 * @param {string} symbol - The symbol of the treasury bill
 * @param {string} valor - The value to return (c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @return The specified value for the given treasury bill
 * @customfunction
 */
function LETRAS(symbol, valor) {
  return panelCotizacion(
    'https://data912.com/live/arg_notes',
    symbol,
    valor,
    'letras',
    'panel:arg_notes'
  );
}

/**
 * Obtiene la lista completa de letras del tesoro desde la API.
 *
 * @return Un arreglo bidimensional con todas las letras y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function LETRASLISTA() {
  return panelLista('https://data912.com/live/arg_notes', 'panel:arg_notes');
}

// ================ market_historico.js ================
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

// Constante CONSTANTS.ATRIBUTOS_HISTORICO movida al namespace CONSTANTS
// var ATRIBUTOS_HISTORICO = ['o', 'h', 'l', 'c', 'v', 'dr', 'sa'];
// Constante CONSTANTS.SEGMENTOS_HISTORICO movida al namespace CONSTANTS
// var SEGMENTOS_HISTORICO = ['stocks', 'cedears', 'bonds'];
// Constante CONSTANTS.HISTORICO_TTL_PASADO movida al namespace CONSTANTS
// var HISTORICO_TTL_PASADO = 21600; // 6h — EOD no cambia
// Constante CONSTANTS.HISTORICO_TTL_ULTIMO movida al namespace CONSTANTS
// var HISTORICO_TTL_ULTIMO = 300;   // 5 min — último bar se mueve

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
  if (CONSTANTS.SEGMENTOS_HISTORICO.indexOf(seg) === -1) {
    throw new Error(
      "Segmento histórico inválido: '" + segmento + "'. " +
      "Segmentos disponibles: " + CONSTANTS.SEGMENTOS_HISTORICO.join(', ') + "."
    );
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = (campo === undefined || campo === null || campo === '')
    ? 'c'
    : campo.toString().toLowerCase().trim();

  if (CONSTANTS.ATRIBUTOS_HISTORICO.indexOf(atributo) === -1) {
    throw new Error(
      "Campo inválido: '" + campo + "'. Campos disponibles: " +
      CONSTANTS.ATRIBUTOS_HISTORICO.join(', ') + "."
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
  var scalarTtl = esUltimo ? CONSTANTS.HISTORICO_TTL_ULTIMO : CONSTANTS.HISTORICO_TTL_PASADO;

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

// ================ market_panel.js ================
/**
 * Helpers compartidos para paneles live de data912 (acciones, bonos, etc.).
 */

// Constante CONSTANTS.ATRIBUTOS_PANEL movida al namespace CONSTANTS
// var ATRIBUTOS_PANEL = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];

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
    throw new Error("Atributo no proporcionado. Atributos disponibles: " + CONSTANTS.ATRIBUTOS_PANEL.join(', ') + ".");
  }

  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();

  if (!CONSTANTS.ATRIBUTOS_PANEL.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: " + CONSTANTS.ATRIBUTOS_PANEL.join(', ') + ".");
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

  var columnas = CONSTANTS.ATRIBUTOS_PANEL.slice();
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

// ================ obligaciones.js ================
/**
 * Obtiene información de obligaciones negociables que cotizan en el mercado argentino desde la API.
 *
 * @param {string} symbol El símbolo de la obligación negociable
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual)
 * @return El valor numérico del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function OBLIGACIONES(symbol, value) {
  return panelCotizacion(
    'https://data912.com/live/arg_corp',
    symbol,
    value,
    'obligaciones negociables',
    'panel:arg_corp'
  );
}

/**
 * Obtiene la lista completa de obligaciones negociables que cotizan en el mercado argentino desde la API.
 *
 * @return {Array} Un arreglo con todas las obligaciones negociables y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function OBLIGACIONESLISTA() {
  return panelLista('https://data912.com/live/arg_corp', 'panel:arg_corp');
}

// ================ opciones.js ================
/**
 * Obtiene información de opciones (calls y puts) que cotizan en el mercado argentino.
 *
 * @param {string} symbol El símbolo de la opción (ej: 'ALUC1000JU', 'GALV50000S')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual)
 * @return El valor numérico del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function OPCIONES(symbol, value) {
  return panelCotizacion(
    'https://data912.com/live/arg_options',
    symbol,
    value,
    'opciones',
    'panel:arg_options'
  );
}

/**
 * Obtiene la lista completa de opciones (calls y puts) que cotizan en el mercado argentino.
 *
 * @return Un arreglo bidimensional con todas las opciones y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function OPCIONESLISTA() {
  return panelLista('https://data912.com/live/arg_options', 'panel:arg_options');
}

// ================ plazofijo.js ================
/**
 * Obtiene las tasas de plazos fijos ofrecidas por bancos en Argentina.
 *
 * @param {string} banco [Opcional] El nombre del banco específico a consultar. Si no se especifica, devuelve la mejor tasa disponible.
 * @param {string} tipoCliente [Opcional] El tipo de cliente: "cliente" o "nocliente". Por defecto: "cliente".
 * @return La tasa nominal anual (TNA) expresada como porcentaje.
 * @customfunction
 */
function PLAZOFIJO(banco, tipoCliente) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo', {
    cacheKey: 'api:ad:plazofijo',
    cacheTtlSeconds: 120
  });

  // Normalizo entradas
  var nombreBanco = banco ? banco.toString().toUpperCase().trim() : '';
  var tipo = tipoCliente ? tipoCliente.toString().toLowerCase().trim() : 'cliente';
  
  // Determinar qué campo de tasa usar según el tipo de cliente
  if (tipo !== 'cliente' && tipo !== 'nocliente') {
    throw new Error("Tipo de cliente inválido: '" + tipoCliente + "'. Usar 'cliente' o 'nocliente'.");
  }
  var campoTasa = (tipo === 'nocliente') ? 'tnaNoClientes' : 'tnaClientes';

  function obtenerTasaBanco(entidad) {
    for (var k = 0; k < datos.length; k++) {
      if (datos[k].entidad === entidad) {
        if (datos[k][campoTasa] !== null) {
          return datos[k][campoTasa];
        }
        if (campoTasa === 'tnaNoClientes') {
          throw new Error("El banco '" + entidad + "' no ofrece plazo fijo para no clientes.");
        }
        throw new Error("No se encontró información de tasa para el banco '" + entidad + "'.");
      }
    }
    return null;
  }
  
  // Si se especifica un banco, buscar ese banco específico
  if (nombreBanco) {
    var coincidenciasExactas = [];
    var coincidenciasParciales = [];
    
    for (var i = 0; i < datos.length; i++) {
      var entidadUpper = datos[i].entidad.toUpperCase();
      if (entidadUpper === nombreBanco) {
        coincidenciasExactas.push(datos[i].entidad);
      } else if (entidadUpper.includes(nombreBanco)) {
        coincidenciasParciales.push(datos[i].entidad);
      }
    }

    if (coincidenciasExactas.length === 1) {
      return obtenerTasaBanco(coincidenciasExactas[0]);
    }
    if (coincidenciasExactas.length > 1) {
      throw new Error("Varios bancos coinciden con '" + banco + "': " + coincidenciasExactas.join(', ') + ".");
    }
    if (coincidenciasParciales.length === 1) {
      return obtenerTasaBanco(coincidenciasParciales[0]);
    }
    if (coincidenciasParciales.length > 1) {
      throw new Error("Varios bancos coinciden con '" + banco + "': " + coincidenciasParciales.slice(0, 10).join(', ') + "...");
    }
    
    // Si llegamos aquí, no se encontró el banco
    var bancosDisponibles = datos.map(function(d) {
      return d.entidad;
    }).sort().slice(0, 10).join(", ") + "...";

    throw new Error("Banco '" + banco + "' no encontrado. Algunos bancos disponibles: " + bancosDisponibles);
  } else {
    // Si no se especifica banco, buscar la mejor tasa
    var mejorTasa = -1;
    var mejorBanco = "";
    var bancoConTasa = false;
    
    for (var i = 0; i < datos.length; i++) {
      // Solo considerar bancos que tienen tasa para el tipo de cliente especificado
      if (datos[i][campoTasa] !== null) {
        bancoConTasa = true;
        var tasa = datos[i][campoTasa];
        
        if (tasa > mejorTasa) {
          mejorTasa = tasa;
          mejorBanco = datos[i].entidad;
        }
      }
    }
    
    // Verificar si se encontró alguna tasa
    if (!bancoConTasa) {
      if (campoTasa === 'tnaNoClientes') {
        throw new Error("No se encontraron bancos que ofrezcan plazo fijo para no clientes.");
      } else {
        throw new Error("No se encontró información de tasas para ningún banco.");
      }
    }
    
    return mejorTasa;
  }
} 
// ================ rendimientos.js ================
/**
 * Obtiene el rendimiento (APY) de criptomonedas ofrecido por diferentes proveedores.
 *
 * @param {string} moneda La criptomoneda o moneda fiat para la cual se quiere consultar el rendimiento (ej: 'BTC', 'USDT', 'ARS')
 * @param {string} proveedor [Opcional] El proveedor específico a consultar (ej: 'buenbit', 'ripio', 'letsbit'). Si no se especifica, devuelve el mejor rendimiento disponible.
 * @return El APY (rendimiento anual) expresado como porcentaje.
 * @customfunction
 */
function RENDIMIENTOS(moneda, proveedor) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/rendimientos', {
    cacheKey: 'api:ad:rendimientos',
    cacheTtlSeconds: 120
  });

  // Normalizo entradas
  var crypto = moneda ? moneda.toString().toUpperCase().trim() : '';
  var exchange = proveedor ? proveedor.toString().toLowerCase().trim() : '';

  // Verificar si se proporcionó la moneda
  if (!crypto) {
    throw new Error("Debe especificar una criptomoneda o moneda fiat.");
  }

  // Si se especifica un proveedor, buscar solo en ese proveedor
  if (exchange) {
    var proveedorEncontrado = false;

    for (var i = 0; i < datos.length; i++) {
      if (datos[i].entidad === exchange) {
        proveedorEncontrado = true;

        if (!datos[i].rendimientos || !datos[i].rendimientos.length) {
          continue;
        }

        // Buscar la moneda en los rendimientos del proveedor
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          if (datos[i].rendimientos[j].moneda.toUpperCase() === crypto) {
            return datos[i].rendimientos[j].apy;
          }
        }

        // Si llegamos aquí, no se encontró la moneda en este proveedor
        throw new Error("La moneda '" + moneda + "' no está disponible en el proveedor '" + proveedor + "'.");
      }
    }

    // Si llegamos aquí, no se encontró el proveedor
    if (!proveedorEncontrado) {
      // Obtener la lista de proveedores disponibles
      var proveedoresDisponibles = datos.map(function(d) { return d.entidad; }).join(", ");
      throw new Error("Proveedor '" + proveedor + "' no encontrado. Proveedores disponibles: " + proveedoresDisponibles);
    }
  } else {
    // Si no se especifica proveedor, buscar el mejor rendimiento para la moneda
    var mejorApy = -1;
    var monedaEncontrada = false;

    for (var i = 0; i < datos.length; i++) {
      var itemProveedor = datos[i];

      if (!itemProveedor.rendimientos || !itemProveedor.rendimientos.length) {
        continue;
      }

      for (var j = 0; j < itemProveedor.rendimientos.length; j++) {
        if (itemProveedor.rendimientos[j].moneda.toUpperCase() === crypto) {
          monedaEncontrada = true;
          var apy = itemProveedor.rendimientos[j].apy;

          if (apy > mejorApy) {
            mejorApy = apy;
          }
        }
      }
    }

    // Verificar si se encontró la moneda
    if (!monedaEncontrada) {
      // Obtener lista de monedas disponibles (sin duplicados)
      var monedasDisponibles = [];
      for (var i = 0; i < datos.length; i++) {
        if (!datos[i].rendimientos) continue;
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          var mon = datos[i].rendimientos[j].moneda.toUpperCase();
          if (monedasDisponibles.indexOf(mon) === -1) {
            monedasDisponibles.push(mon);
          }
        }
      }
      monedasDisponibles.sort();

      throw new Error("Moneda '" + moneda + "' no encontrada. Algunas monedas disponibles: " + monedasDisponibles.slice(0, 15).join(", ") + "...");
    }

    // Si el mejor APY es 0, indicar que no hay rendimiento disponible
    if (mejorApy === 0) {
      return 0; // No hay rendimiento disponible para esta moneda
    }

    return mejorApy;
  }
}

// ================ riesgopais.js ================
/**
 * Obtiene el valor del riesgo país de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del riesgo país para la fecha especificada o el último disponible.
 * @customfunction
 */
function RIESGOPAIS(fecha) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais', {
    cacheKey: 'api:ad:riesgo-pais',
    cacheTtlSeconds: 300
  });

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos de riesgo país desde la API.");
  }

  if (!fecha) {
    datos.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return datos[0].valor;
  }

  var fechaFormateada;
  try {
    fechaFormateada = formatearFechaISO(fecha);
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }

  var fechasMenores = datos.filter(function(d) {
    return d.fecha <= fechaFormateada;
  });

  if (fechasMenores.length > 0) {
    fechasMenores.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return fechasMenores[0].valor;
  }

  datos.sort(function(a, b) {
    return a.fecha.localeCompare(b.fecha);
  });

  return datos[0].valor;
}

// ================ usa_stocks.js ================
/**
 * Obtiene información de acciones de Estados Unidos desde la API.
 *
 * @param {string} symbol El símbolo de la acción estadounidense (ej: 'AAPL', 'MSFT', 'GOOGL')
 * @param {string} value El valor que se quiere obtener: 'c' (precio actual), 'v' (volumen),
 *                      'q_bid' (cantidad bid), 'px_bid' (precio bid), 'px_ask' (precio ask),
 *                      'q_ask' (cantidad ask), 'q_op' (operaciones diarias), 'pct_change' (variación porcentual)
 * @return El valor numérico del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function USASTOCKS(symbol, value) {
  return panelCotizacion(
    'https://data912.com/live/usa_stocks',
    symbol,
    value,
    'acciones estadounidenses',
    'panel:usa_stocks'
  );
}

/**
 * Obtiene la lista completa de acciones de Estados Unidos desde la API.
 *
 * @return Un arreglo bidimensional con todas las acciones y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function USASTOCKSLISTA() {
  return panelLista('https://data912.com/live/usa_stocks', 'panel:usa_stocks');
}

// ================ uva.js ================
/**
 * Obtiene los índices UVA (Unidad de Valor Adquisitivo) de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice UVA para la fecha especificada o el último disponible.
 * @customfunction
 */
function UVA(fecha) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/uva', {
    cacheKey: 'api:ad:uva',
    cacheTtlSeconds: 300
  });

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos de UVA desde la API.");
  }

  if (!fecha) {
    datos.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return datos[0].valor;
  }

  var fechaFormateada;
  try {
    fechaFormateada = formatearFechaISO(fecha);
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }

  var fechasMenores = datos.filter(function(d) {
    return d.fecha <= fechaFormateada;
  });

  if (fechasMenores.length > 0) {
    fechasMenores.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return fechasMenores[0].valor;
  }

  datos.sort(function(a, b) {
    return a.fecha.localeCompare(b.fecha);
  });

  return datos[0].valor;
}
