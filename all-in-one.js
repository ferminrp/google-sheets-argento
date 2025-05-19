// Archivo consolidado generado automáticamente
// Fecha de generación: 2025-05-19T21:59:38.901Z

// Namespace para constantes compartidas
var CONSTANTS = {};

// Inicializar constantes compartidas
CONSTANTS.DERECHOS_MERCADO_TASA_DIARIA = 0.045 / 100 / 90;
CONSTANTS.GASTOS_GARANTIA_TASA_DIARIA = 0.045 / 100 / 90;
CONSTANTS.IVA_PORCENTAJE = 21 / 100;
CONSTANTS.ARANCEL_CAUCION_COLOCADORA_TNA = 1.5 / 100;
CONSTANTS.ARANCEL_CAUCION_TOMADORA_TNA = 4.0 / 100;

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
function acciones(symbol, value) {
  // Consulta al API
  var url = 'https://data912.com/live/arg_stocks';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos
  var atributosPermitidos = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Verificar si el atributo es válido
  if (!atributosPermitidos.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  var disponibles = datos.map(function(o){ return o.symbol; }).join(', ');
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de acciones disponibles.");
}

/**
 * Obtiene la lista completa de acciones que cotizan en el mercado argentino desde la API.
 * 
 * @return Un arreglo bidimensional con todas las acciones y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function accionesLista() {
  // Consulta al API
  var url = 'https://data912.com/live/arg_stocks';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada acción como una fila
  datos.forEach(function(accion) {
    var fila = columnas.map(function(columna) {
      return accion[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
}
// ================ bcra.js ================
/**
 * Devuelve un array con todas las variables disponibles del BCRA (Banco Central de la República Argentina).
 * Cada elemento contiene el ID de la variable y su valor actual.
 *
 * @return {Array} Un array de variables del BCRA donde cada elemento es [idVariable, valor]
 * @customfunction
 */
function bcraVariables() {
  try {
    // Fetch data from the BCRA API
    const url = "https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Check if the API response is valid
    if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
      throw new Error("Error en la respuesta de la API del BCRA.");
    }
    
    // Return the array of results
    return data.results.map(item => [item.categoria, item.idVariable, item.descripcion, item.valor, item.fecha]);
  } catch (error) {
    throw new Error(`Error al consultar el BCRA: ${error.message}`);
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
function bcra(id) {
  // Validate input
  if (!id || isNaN(parseInt(id))) {
    throw new Error("ID inválido. Debe ser un número válido (1, 4, 5, 6, etc).");
  }
  
  // Convert to integer in case it's passed as a string
  const variableId = parseInt(id);
  
  try {
    // Fetch data from the BCRA API
    const url = "https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Check if the API response is valid
    if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
      throw new Error("Error en la respuesta de la API del BCRA.");
    }
    
    // Find the variable with the specified ID
    const variable = data.results.find(item => item.idVariable === variableId);
    
    // Return the value if found, otherwise throw an error
    if (variable) {
      return variable.valor;
    } else {
      throw new Error(`Variable con ID ${variableId} no encontrada. IDs disponibles: ${data.results.map(item => item.idVariable).join(', ')}.`);
    }
  } catch (error) {
    throw new Error(`Error al consultar el BCRA: ${error.message}`);
  }
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
function bonos(symbol, value) {
  // Consulta al API
  var url = 'https://data912.com/live/arg_bonds';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos
  var atributosPermitidos = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Verificar si el atributo es válido
  if (!atributosPermitidos.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  var disponibles = datos.map(function(o){ return o.symbol; }).join(', ');
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de bonos disponibles.");
}

/**
 * Obtiene la lista completa de bonos que cotizan en el mercado argentino desde la API.
 * 
 * @return {Array} Un arreglo con todos los bonos y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function bonosLista() {
  // Consulta al API
  var url = 'https://data912.com/live/arg_bonds';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada bono como una fila
  datos.forEach(function(bono) {
    var fila = columnas.map(function(columna) {
      return bono[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
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
function caucionColocadora(
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
  return calcularCaucion(-dias, tna, importeBruto, arancelCaucionColocadoraTna)
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
function caucionTomadora(dias, tna, importeBruto, arancelCaucionTomadoraTna) {
  if (dias <= 0) {
    throw new Error(
      "Para caución tomadora, los días deben ser un número positivo."
    );
  }
  return calcularCaucion(
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
function caucion(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  const calculoCaucion = calcularCaucion(
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
function caucionDetallada(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  const resultado = calcularCaucion(
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
function calcularCaucion(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  // Valores por defecto para los aranceles
  arancelCaucionColocadoraTna =
    arancelCaucionColocadoraTna || CONSTANTS.ARANCEL_CAUCION_COLOCADORA_TNA;
  arancelCaucionTomadoraTna =
    arancelCaucionTomadoraTna || CONSTANTS.ARANCEL_CAUCION_TOMADORA_TNA;

  // Validación de parámetros
  if (typeof dias !== "number" || !Number.isInteger(dias)) {
    throw new Error("El parámetro 'dias' debe ser un número entero.");
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
 *                      'name' (nombre completo), 'ratio' (ratio de conversión)
 * @return El valor del atributo solicitado para el símbolo especificado.
 * @customfunction
 */
function cedear(symbol, value) {
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos para API de cotizaciones
  var atributosPermitidosApi = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Valores permitidos para JSON local
  var atributosPermitidosJson = ['name', 'ratio'];
  
  // Verificar si es un atributo que viene del archivo JSON local
  if (atributosPermitidosJson.includes(atributo)) {
    return getCedearDataFromJson(simbolo, atributo);
  }
  
  // Si no es del JSON local, verificar si es un atributo válido de la API
  if (!atributosPermitidosApi.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change, name, ratio.");
  }
  
  // Consulta al API para cotizaciones
  var url = 'https://data912.com/live/arg_cedears';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  var disponibles = datos.map(function(o){ return o.symbol; }).join(', ');
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de CEDEARs disponibles.");
}

/**
 * Obtiene datos de CEDEARs desde el archivo JSON local.
 * 
 * @param {string} symbol El símbolo del CEDEAR
 * @param {string} attribute El atributo que se quiere obtener ('name' o 'ratio')
 * @return El valor del atributo solicitado
 */
function getCedearDataFromJson(symbol, attribute) {
  try {
    // Leer el archivo JSON de CEDEARs
    var fileId = DriveApp.getFilesByName('data/cedears.json').next().getId();
    var content = DriveApp.getFileById(fileId).getBlob().getDataAsString();
    var cedears = JSON.parse(content);
    
    // Buscar el símbolo en el JSON
    for (var i = 0; i < cedears.length; i++) {
      if (cedears[i].Cedears === symbol) {
        // Mapear el atributo solicitado al nombre correcto en el JSON
        if (attribute === 'name') {
          return cedears[i].Name;
        } else if (attribute === 'ratio') {
          return cedears[i].Ratio;
        }
      }
    }
    
    throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en el archivo de CEDEARs.");
  } catch (e) {
    // Si hay problemas con el acceso al archivo, intenta cargar el archivo desde la URL directa
    try {
      var url = 'https://raw.githubusercontent.com/ferminrp/google-sheets-argento/main/data/cedears.json';
      var response = UrlFetchApp.fetch(url);
      var cedears = JSON.parse(response.getContentText());
      
      // Buscar el símbolo en el JSON
      for (var i = 0; i < cedears.length; i++) {
        if (cedears[i].Cedears === symbol) {
          // Mapear el atributo solicitado al nombre correcto en el JSON
          if (attribute === 'name') {
            return cedears[i].Name;
          } else if (attribute === 'ratio') {
            return cedears[i].Ratio;
          }
        }
      }
      
      throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en el archivo de CEDEARs.");
    } catch (err) {
      throw new Error("Error al obtener datos de CEDEARs: " + err.message);
    }
  }
}

/**
 * Obtiene la lista completa de CEDEARs (Certificados de Depósito Argentinos) desde la API.
 * 
 * @return Un arreglo bidimensional con todos los CEDEARs y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function cedearLista() {
  // Consulta al API
  var url = 'https://data912.com/live/arg_cedears';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada CEDEAR como una fila
  datos.forEach(function(cedear) {
    var fila = columnas.map(function(columna) {
      return cedear[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
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
function criptoya(coin, fiat, volumen, exchange, operacion) {
  // Valores por defecto
  volumen = volumen || 1;
  operacion = operacion || 'totalCompra';
  
  // Normalizo entradas
  var cripto = coin.toString().toUpperCase().trim();
  var moneda = fiat.toString().toUpperCase().trim();
  var vol = parseFloat(volumen);
  var tipoOperacion = operacion.toString().toLowerCase().trim();
  
  // Mapeo de nombres de operación a los campos de la API
  var camposOperacion = {
    'compra': 'ask',
    'totalcompra': 'totalAsk',
    'venta': 'bid',
    'totalventa': 'totalBid'
  };
  
  // Verificar si la operación es válida
  if (!Object.keys(camposOperacion).includes(tipoOperacion)) {
    throw new Error("Operación inválida: '" + operacion + "'. Operaciones disponibles: compra, totalCompra, venta, totalVenta.");
  }
  
  // Campo a consultar en la respuesta
  var campo = camposOperacion[tipoOperacion];
  
  // URL de la API de CriptoYa
  var url = 'https://criptoya.com/api/' + encodeURIComponent(cripto) + '/' + encodeURIComponent(moneda) + '/' + vol;
  
  try {
    // Consulta al API
    var respuesta = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Comprobar si la respuesta es válida
    if (respuesta.getResponseCode() !== 200) {
      var error;
      try {
        error = JSON.parse(respuesta.getContentText());
        throw new Error(error.message || "Error desconocido");
      } catch (e) {
        throw new Error("Código de error: " + respuesta.getResponseCode());
      }
    }
    
    // Analizar la respuesta JSON
    var datos = JSON.parse(respuesta.getContentText());
    
    // Si se solicita un exchange específico
    if (exchange) {
      var exchangeKey = exchange.toString().toLowerCase().trim();
      
      // Verificar si el exchange existe en la respuesta
      if (!datos[exchangeKey]) {
        var exchangesDisponibles = Object.keys(datos).join(', ');
        throw new Error("Exchange '" + exchange + "' no disponible. Exchanges disponibles: " + exchangesDisponibles);
      }
      
      // Verificar si el campo solicitado existe para ese exchange
      if (datos[exchangeKey][campo] === undefined) {
        throw new Error("El campo '" + operacion + "' no está disponible para el exchange '" + exchange + "'");
      }
      
      // Devolver el precio del exchange específico
      return datos[exchangeKey][campo];
    }
    
    // Si no se especifica exchange, buscar el mejor precio según la operación
    var mejorPrecio;
    var mejorExchange;
    
    // Determinar el mejor precio según el tipo de operación
    if (tipoOperacion.includes('compra')) {
      // Para compra, el mejor precio es el más bajo
      mejorPrecio = Infinity;
      for (var ex in datos) {
        // Verificar que el exchange tenga el campo solicitado
        if (datos[ex][campo] !== undefined && datos[ex][campo] < mejorPrecio) {
          mejorPrecio = datos[ex][campo];
          mejorExchange = ex;
        }
      }
    } else {
      // Para venta, el mejor precio es el más alto
      mejorPrecio = -Infinity;
      for (var ex in datos) {
        // Verificar que el exchange tenga el campo solicitado
        if (datos[ex][campo] !== undefined && datos[ex][campo] > mejorPrecio) {
          mejorPrecio = datos[ex][campo];
          mejorExchange = ex;
        }
      }
    }
    
    // Verificar si se encontró algún precio
    if (mejorPrecio === Infinity || mejorPrecio === -Infinity) {
      throw new Error("No se encontraron precios disponibles para " + cripto + "/" + moneda + " con el tipo de operación '" + operacion + "'");
    }
    
    // Devolver el mejor precio
    return mejorPrecio;
    
  } catch (e) {
    // Si el error indica que la moneda o criptomoneda no es válida
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par " + cripto + "/" + moneda + " no encontrado. Verifica que la cripto y la moneda sean correctas.");
    }
    
    // Para otros errores, mostrar el mensaje original
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
function crypto(symbol, moneda) {
  // Valor por defecto
  moneda = moneda || 'USD';
  
  // Normalizo entradas
  var cripto = symbol.toString().toUpperCase().trim();
  var divisa = moneda.toString().toUpperCase().trim();
  
  // Par de trading
  var par = cripto + '-' + divisa;
  
  // URL de la API de Coinbase (versión pública)
  var url = 'https://api.coinbase.com/v2/prices/' + par + '/spot';
  
  try {
    // Consulta al API
    var respuesta = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Comprobar si la respuesta es válida
    if (respuesta.getResponseCode() !== 200) {
      var error;
      try {
        error = JSON.parse(respuesta.getContentText());
        throw new Error((error.errors && error.errors[0] && error.errors[0].message) || "Error desconocido");
      } catch (e) {
        throw new Error("Código de error: " + respuesta.getResponseCode());
      }
    }
    
    // Analizar la respuesta JSON
    var datos = JSON.parse(respuesta.getContentText());
    
    // Verificar si se recibió correctamente la respuesta
    if (!datos || !datos.data || !datos.data.amount) {
      throw new Error("Respuesta inválida de Coinbase");
    }
    
    // Devolver el precio
    return parseFloat(datos.data.amount);
    
  } catch (e) {
    // Si el error indica que no se encontró el par de trading
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par de trading no encontrado: '" + par + "'. Verifica que el símbolo y la moneda sean correctos.");
    }
    
    // Para otros errores, mostrar el mensaje original
    throw new Error("Error al consultar el precio de " + cripto + ": " + e.message);
  }
} 
// ================ dolar.js ================
/**
 * Obtiene la cotización de los distintos tipos de dólar en Argentina.
 *
 * @param {string} tipo La “casa” del dólar: oficial, blue, bolsa, contadoconliqui, mayorista, cripto o tarjeta.
 * @param {string} operacion 'compra', 'venta' o 'promedio'.
 * @return El valor numérico de la operación solicitada.
 * @customfunction
 */
function dolar(tipo, operacion) {
  // Consulta al API
  var url = 'https://dolarapi.com/v1/dolares';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var casa = tipo.toString().toLowerCase().trim();
  var op = operacion.toString().toLowerCase().trim();
  
  // Busco la casa solicitada
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].casa.toLowerCase() === casa) {
      var compra = datos[i].compra;
      var venta  = datos[i].venta;
      
      if (op === 'compra')     return compra;
      if (op === 'venta')      return venta;
      if (op === 'promedio')   return (compra + venta) / 2;
      
      throw new Error("Operación inválida: '" + operacion + "'. Usa 'compra', 'venta' o 'promedio'.");
    }
  }
  
  // Si no encontró la casa
  var disponibles = datos.map(function(o){ return o.casa; }).join(', ');
  throw new Error("Tipo inválido: '" + tipo + "'. Tipos disponibles: " + disponibles + ".");
}

// ================ dolar_historico.js ================
/**
 * Obtiene la cotización histórica del dólar según el tipo y fecha especificados
 * 
 * @param {string} tipo - Tipo de dólar (blue, oficial, mayorista, etc.)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} valor - Opcional: "compra" o "venta" (por defecto es "venta")
 * @return {number} Valor de la cotización para el tipo y fecha solicitados
 * @customfunction
 */
function dolar_historico(tipo, fecha, valor = "venta") {
  // URL de la API de ArgentinaDatos para cotizaciones de dólares
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';
  
  try {
    // Validar parámetros
    if (!tipo) {
      return "Error: Debe especificar un tipo de dólar";
    }
    
    // Si no se proporciona fecha, usar la fecha actual
    if (!fecha) {
      const hoy = new Date();
      fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
    }
    
    // Validar valor (compra o venta)
    if (valor.toLowerCase() !== "compra" && valor.toLowerCase() !== "venta") {
      return "Error: El valor debe ser 'compra' o 'venta'";
    }
    
    // Realizar la solicitud GET a la API
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Filtrar los resultados por tipo de dólar y fecha
    const cotizacion = data.filter(item => 
      item.casa.toLowerCase() === tipo.toLowerCase() && 
      item.fecha === fecha
    );
    
    // Si se encontró una cotización, devolver el valor solicitado
    if (cotizacion.length > 0) {
      return cotizacion[0][valor.toLowerCase()];
    } else {
      return "No se encontró cotización para la fecha y tipo especificados";
    }
  } catch (error) {
    return "Error: " + error.toString();
  }
}

/**
 * Obtiene todas las cotizaciones de dólar para una fecha específica
 * 
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @return {Array} Matriz con las cotizaciones de cada tipo de dólar para la fecha
 * @customfunction
 */
function dolar_historico_todos(fecha) {
  // URL de la API de ArgentinaDatos para cotizaciones de dólares
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';
  
  try {
    // Si no se proporciona fecha, usar la fecha actual
    if (!fecha) {
      const hoy = new Date();
      fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
    }
    
    // Realizar la solicitud GET a la API
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Filtrar los resultados por fecha
    const cotizaciones = data.filter(item => item.fecha === fecha);
    
    // Si no hay cotizaciones para esa fecha
    if (cotizaciones.length === 0) {
      return [["No se encontraron cotizaciones para la fecha especificada"]];
    }
    
    // Crear encabezados para la tabla
    const resultado = [["Tipo", "Compra", "Venta", "Fecha"]];
    
    // Agregar cada cotización a la matriz
    cotizaciones.forEach(cotizacion => {
      resultado.push([
        cotizacion.casa,
        cotizacion.compra,
        cotizacion.venta,
        cotizacion.fecha
      ]);
    });
    
    return resultado;
  } catch (error) {
    return [["Error: " + error.toString()]];
  }
} 
// ================ fci.js ================
/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function fci(tipoFondo, nombreFondo, fecha, campo) {
  // Normalizo entradas
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';
  
  // Validar tipo de fondo
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta'];
  if (!tiposPermitidos.includes(tipo.replace(/\s+/g, '').replace(/[óo]/, 'o'))) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta.");
  }
  
  // Convertir tipo a formato de API
  var tipoAPI = tipo.replace(/\s+/g, '').replace(/[óo]/, 'o');
  switch (tipoAPI) {
    case 'mercadodinero': tipoAPI = 'mercadoDinero'; break;
    case 'rentavariable': tipoAPI = 'rentaVariable'; break;
    case 'rentafija': tipoAPI = 'rentaFija'; break;
    case 'rentamixta': tipoAPI = 'rentaMixta'; break;
  }
  
  // Validar el campo a consultar
  var camposPermitidos = ['vcp', 'ccp', 'patrimonio'];
  if (!camposPermitidos.includes(campoDatos)) {
    throw new Error("Campo inválido. Campos permitidos: vcp (valor cuotaparte), ccp (cantidad cuotapartes), patrimonio.");
  }
  
  // Validar que se haya proporcionado un nombre de fondo
  if (!nombre) {
    throw new Error("Debe especificar un nombre de fondo.");
  }
  
  // Construir URL según si se proporciona fecha o no
  var url;
  if (fecha) {
    // Formatear la fecha a YYYY/MM/DD si viene en otro formato
    var fechaObj;
    try {
      if (fecha instanceof Date) {
        fechaObj = fecha;
      } else {
        // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
        if (fecha.indexOf('/') !== -1) {
          var partes = fecha.split('/');
          if (partes.length === 3) {
            fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
          }
        }
        fechaObj = new Date(fecha);
        
        // Verificar si la fecha es válida
        if (isNaN(fechaObj.getTime())) {
          throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
        }
      }
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
    }
    
    // Formatear a YYYY/MM/DD para la URL
    var year = fechaObj.getFullYear();
    var month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    var day = fechaObj.getDate().toString().padStart(2, '0');
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/' + year + '/' + month + '/' + day + '/';
  } else {
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/ultimo';
  }
  
  try {
    // Consulta al API
    var respuesta = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });
    
    // Verificar si la respuesta es válida
    if (respuesta.getResponseCode() !== 200) {
      throw new Error("Error al consultar la API: Código " + respuesta.getResponseCode() + ". Verifique los parámetros.");
    }
    
    var datos = JSON.parse(respuesta.getContentText());
    
    // Buscar el fondo por nombre
    var fondoEncontrado = false;
    for (var i = 0; i < datos.length; i++) {
      // Solo considerar entradas que sean fondos válidos (no categorías)
      if (datos[i].fondo && !datos[i].fondo.startsWith("Region:") && 
          !datos[i].fondo.startsWith("Duration:") && 
          !datos[i].fondo.startsWith("Benchmark:") && 
          !datos[i].fondo.startsWith("Moneda:")) {
        
        // Coincidencia exacta o parcial con el nombre del fondo
        if (datos[i].fondo === nombre || datos[i].fondo.includes(nombre)) {
          fondoEncontrado = true;
          
          // Verificar si el campo solicitado tiene valor
          if (datos[i][campoDatos] !== null) {
            return datos[i][campoDatos];
          } else {
            throw new Error("El fondo '" + datos[i].fondo + "' no tiene valor para el campo '" + campo + "'.");
          }
        }
      }
    }
    
    // Si no se encontró el fondo, mostrar algunos disponibles
    if (!fondoEncontrado) {
      var fondosDisponibles = datos
        .filter(function(d) { 
          return d.fondo && !d.fondo.startsWith("Region:") && 
                 !d.fondo.startsWith("Duration:") && 
                 !d.fondo.startsWith("Benchmark:") && 
                 !d.fondo.startsWith("Moneda:"); 
        })
        .map(function(d) { 
          return d.fondo; 
        })
        .slice(0, 10)
        .join(", ") + "...";
      
      throw new Error("Fondo '" + nombre + "' no encontrado para el tipo '" + tipoFondo + "'. Algunos fondos disponibles: " + fondosDisponibles);
    }
  } catch (e) {
    if (e.message.includes("Error al consultar la API")) {
      throw e;
    }
    throw new Error("Error al consultar información de '" + tipoFondo + "': " + e.message);
  }
} 
// ================ inflacion.js ================
/**
 * Obtiene los índices de inflación de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'MM/DD/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice de inflación para la fecha especificada o el último disponible.
 * @customfunction
 */
function inflacion(fecha) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Si no se proporciona fecha, devolver el valor más reciente
  if (!fecha) {
    // Ordena los datos por fecha descendente para obtener el más reciente
    datos.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return datos[0].valor;
  }
  
  // Normalizar el formato de fecha
  var fechaBusqueda;
  try {
    // Intentar parsear la fecha desde diferentes formatos
    if (fecha instanceof Date) {
      fechaBusqueda = fecha;
    } else {
      // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
      if (fecha.indexOf('/') !== -1) {
        var partes = fecha.split('/');
        if (partes.length === 3) {
          fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
        }
      }
      
      fechaBusqueda = new Date(fecha);
      
      // Verificar si la fecha es válida
      if (isNaN(fechaBusqueda.getTime())) {
        throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
    }
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
  }
  
  // Convertir a formato YYYY-MM-DD para comparar con datos de la API
  var year = fechaBusqueda.getFullYear();
  var month = (fechaBusqueda.getMonth() + 1).toString().padStart(2, '0');
  var day = fechaBusqueda.getDate().toString().padStart(2, '0');
  var fechaFormateada = year + '-' + month + '-' + day;
  
  // Buscar la fecha exacta
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }
  
  // Si no se encuentra la fecha exacta, buscar la fecha más cercana anterior
  var fechasMenores = datos.filter(function(d) {
    return new Date(d.fecha) <= fechaBusqueda;
  });
  
  if (fechasMenores.length > 0) {
    // Ordenar por fecha descendente y tomar la primera (la más cercana a la fecha solicitada)
    fechasMenores.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return fechasMenores[0].valor;
  }
  
  // Si no hay fechas anteriores, devolver el dato más antiguo
  datos.sort(function(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
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
function letras(symbol, valor) {
  // Validate inputs
  if (!symbol) {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: BB2Y5, BNA6D, etc).");
  }
  
  if (!valor) {
    throw new Error("Valor no proporcionado. Valores disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Standardize symbol and value
  symbol = symbol.toUpperCase().trim();
  valor = valor.toLowerCase().trim();
  
  // Validate valor parameter
  const validValues = ["c", "v", "q_bid", "px_bid", "px_ask", "q_ask", "q_op", "pct_change"];
  if (!validValues.includes(valor)) {
    throw new Error(`Atributo inválido: '${valor}'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.`);
  }
  
  try {
    // Fetch data from the API
    const url = "https://data912.com/live/arg_notes";
    const response = UrlFetchApp.fetch(url);
    const letrasList = JSON.parse(response.getContentText());
    
    // Find the requested treasury bill
    const letra = letrasList.find(letra => letra.symbol === symbol);
    
    // Return the value if found, otherwise throw an error
    if (letra) {
      return letra[valor];
    } else {
      throw new Error(`Símbolo inválido: '${symbol}'. No se encontró en la lista de letras disponibles.`);
    }
  } catch (error) {
    throw new Error(`Error al consultar datos de letras: ${error.message}`);
  }
}

/**
 * Obtiene la lista completa de letras del tesoro desde la API.
 * 
 * @return Un arreglo bidimensional con todas las letras y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function letrasLista() {
  try {
    // Fetch data from the API
    const url = "https://data912.com/live/arg_notes";
    const response = UrlFetchApp.fetch(url);
    const datos = JSON.parse(response.getContentText());
    
    // Definir las columnas que queremos mostrar
    const columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
    
    // Crear el arreglo bidimensional comenzando con los encabezados
    const resultado = [columnas];
    
    // Agregar cada letra como una fila
    datos.forEach(function(letra) {
      const fila = columnas.map(function(columna) {
        return letra[columna];
      });
      resultado.push(fila);
    });
    
    return resultado;
  } catch (error) {
    throw new Error(`Error al consultar datos de letras: ${error.message}`);
  }
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
function obligaciones(symbol, value) {
  // Consulta al API
  var url = 'https://data912.com/live/arg_corp';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos
  var atributosPermitidos = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Verificar si el atributo es válido
  if (!atributosPermitidos.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  var disponibles = datos.map(function(o){ return o.symbol; }).join(', ');
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de obligaciones negociables disponibles.");
}

/**
 * Obtiene la lista completa de obligaciones negociables que cotizan en el mercado argentino desde la API.
 * 
 * @return {Array} Un arreglo con todas las obligaciones negociables y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function obligacionesLista() {
  // Consulta al API
  var url = 'https://data912.com/live/arg_corp';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada obligación negociable como una fila
  datos.forEach(function(obligacion) {
    var fila = columnas.map(function(columna) {
      return obligacion[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
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
function opciones(symbol, value) {
  // Consulta al API
  var url = 'https://data912.com/live/arg_options';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos
  var atributosPermitidos = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Verificar si el atributo es válido
  if (!atributosPermitidos.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  throw new Error("Símbolo de opción inválido: '" + symbol + "'. No se encontró en la lista de opciones disponibles.");
}

/**
 * Obtiene la lista completa de opciones (calls y puts) que cotizan en el mercado argentino.
 * 
 * @return Un arreglo bidimensional con todas las opciones y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function opcionesLista() {
  // Consulta al API
  var url = 'https://data912.com/live/arg_options';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada opción como una fila
  datos.forEach(function(opcion) {
    var fila = columnas.map(function(columna) {
      return opcion[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
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
function plazofijo(banco, tipoCliente) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var nombreBanco = banco ? banco.toString().toUpperCase().trim() : '';
  var tipo = tipoCliente ? tipoCliente.toString().toLowerCase().trim() : 'cliente';
  
  // Determinar qué campo de tasa usar según el tipo de cliente
  var campoTasa = (tipo === 'nocliente') ? 'tnaNoClientes' : 'tnaClientes';
  
  // Si se especifica un banco, buscar ese banco específico
  if (nombreBanco) {
    var bancoEncontrado = false;
    
    for (var i = 0; i < datos.length; i++) {
      // Buscar coincidencia parcial en el nombre del banco
      if (datos[i].entidad.toUpperCase().includes(nombreBanco)) {
        bancoEncontrado = true;
        
        // Verificar si el banco tiene la tasa para el tipo de cliente especificado
        if (datos[i][campoTasa] !== null) {
          return datos[i][campoTasa];
        } else {
          if (campoTasa === 'tnaNoClientes') {
            throw new Error("El banco '" + datos[i].entidad + "' no ofrece plazo fijo para no clientes.");
          } else {
            throw new Error("No se encontró información de tasa para el banco '" + datos[i].entidad + "'.");
          }
        }
      }
    }
    
    // Si llegamos aquí, no se encontró el banco
    if (!bancoEncontrado) {
      // Obtener lista de bancos disponibles
      var bancosDisponibles = datos.map(function(d) { 
        return d.entidad;
      }).sort().slice(0, 10).join(", ") + "...";
      
      throw new Error("Banco '" + banco + "' no encontrado. Algunos bancos disponibles: " + bancosDisponibles);
    }
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
function rendimientos(moneda, proveedor) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/rendimientos';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
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
    var rendimientoEncontrado = false;
    
    for (var i = 0; i < datos.length; i++) {
      if (datos[i].entidad === exchange) {
        proveedorEncontrado = true;
        
        // Buscar la moneda en los rendimientos del proveedor
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          if (datos[i].rendimientos[j].moneda.toUpperCase() === crypto) {
            rendimientoEncontrado = true;
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
    var mejorProveedor = "";
    var monedaEncontrada = false;
    
    for (var i = 0; i < datos.length; i++) {
      var proveedor = datos[i];
      
      for (var j = 0; j < proveedor.rendimientos.length; j++) {
        if (proveedor.rendimientos[j].moneda.toUpperCase() === crypto) {
          monedaEncontrada = true;
          var apy = proveedor.rendimientos[j].apy;
          
          if (apy > mejorApy) {
            mejorApy = apy;
            mejorProveedor = proveedor.entidad;
          }
        }
      }
    }
    
    // Verificar si se encontró la moneda
    if (!monedaEncontrada) {
      // Obtener lista de monedas disponibles (sin duplicados)
      var monedasDisponibles = [];
      for (var i = 0; i < datos.length; i++) {
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          var moneda = datos[i].rendimientos[j].moneda.toUpperCase();
          if (monedasDisponibles.indexOf(moneda) === -1) {
            monedasDisponibles.push(moneda);
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
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'MM/DD/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del riesgo país para la fecha especificada o el último disponible.
 * @customfunction
 */
function riesgopais(fecha) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Si no se proporciona fecha, devolver el valor más reciente
  if (!fecha) {
    // Ordena los datos por fecha descendente para obtener el más reciente
    datos.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return datos[0].valor;
  }
  
  // Normalizar el formato de fecha
  var fechaBusqueda;
  try {
    // Intentar parsear la fecha desde diferentes formatos
    if (fecha instanceof Date) {
      fechaBusqueda = fecha;
    } else {
      // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
      if (fecha.indexOf('/') !== -1) {
        var partes = fecha.split('/');
        if (partes.length === 3) {
          fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
        }
      }
      
      fechaBusqueda = new Date(fecha);
      
      // Verificar si la fecha es válida
      if (isNaN(fechaBusqueda.getTime())) {
        throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
    }
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
  }
  
  // Convertir a formato YYYY-MM-DD para comparar con datos de la API
  var year = fechaBusqueda.getFullYear();
  var month = (fechaBusqueda.getMonth() + 1).toString().padStart(2, '0');
  var day = fechaBusqueda.getDate().toString().padStart(2, '0');
  var fechaFormateada = year + '-' + month + '-' + day;
  
  // Buscar la fecha exacta
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }
  
  // Si no se encuentra la fecha exacta, buscar la fecha más cercana anterior
  var fechasMenores = datos.filter(function(d) {
    return new Date(d.fecha) <= fechaBusqueda;
  });
  
  if (fechasMenores.length > 0) {
    // Ordenar por fecha descendente y tomar la primera (la más cercana a la fecha solicitada)
    fechasMenores.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return fechasMenores[0].valor;
  }
  
  // Si no hay fechas anteriores, devolver el dato más antiguo
  datos.sort(function(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
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
function usa_stocks(symbol, value) {
  // Consulta al API
  var url = 'https://data912.com/live/usa_stocks';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var simbolo = symbol.toString().toUpperCase().trim();
  var atributo = value.toString().toLowerCase().trim();
  
  // Valores permitidos
  var atributosPermitidos = ['c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Verificar si el atributo es válido
  if (!atributosPermitidos.includes(atributo)) {
    throw new Error("Atributo inválido: '" + value + "'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Buscar el símbolo solicitado
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].symbol === simbolo) {
      return datos[i][atributo];
    }
  }
  
  // Si no se encontró el símbolo
  throw new Error("Símbolo inválido: '" + symbol + "'. No se encontró en la lista de acciones estadounidenses disponibles.");
}

/**
 * Obtiene la lista completa de acciones de Estados Unidos desde la API.
 * 
 * @return Un arreglo bidimensional con todas las acciones estadounidenses y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function usa_stocksLista() {
  // Consulta al API
  var url = 'https://data912.com/live/usa_stocks';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Definir las columnas que queremos mostrar
  var columnas = ['symbol', 'c', 'v', 'q_bid', 'px_bid', 'px_ask', 'q_ask', 'q_op', 'pct_change'];
  
  // Crear el arreglo bidimensional comenzando con los encabezados
  var resultado = [columnas];
  
  // Agregar cada acción como una fila
  datos.forEach(function(usaStock) {
    var fila = columnas.map(function(columna) {
      return usaStock[columna];
    });
    resultado.push(fila);
  });
  
  return resultado;
}
// ================ uva.js ================
/**
 * Obtiene los índices UVA (Unidad de Valor Adquisitivo) de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'MM/DD/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice UVA para la fecha especificada o el último disponible.
 * @customfunction
 */
function uva(fecha) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/indices/uva';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Si no se proporciona fecha, devolver el valor más reciente
  if (!fecha) {
    // Ordena los datos por fecha descendente para obtener el más reciente
    datos.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return datos[0].valor;
  }
  
  // Normalizar el formato de fecha
  var fechaBusqueda;
  try {
    // Intentar parsear la fecha desde diferentes formatos
    if (fecha instanceof Date) {
      fechaBusqueda = fecha;
    } else {
      // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
      if (fecha.indexOf('/') !== -1) {
        var partes = fecha.split('/');
        if (partes.length === 3) {
          fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
        }
      }
      
      fechaBusqueda = new Date(fecha);
      
      // Verificar si la fecha es válida
      if (isNaN(fechaBusqueda.getTime())) {
        throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
    }
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
  }
  
  // Convertir a formato YYYY-MM-DD para comparar con datos de la API
  var year = fechaBusqueda.getFullYear();
  var month = (fechaBusqueda.getMonth() + 1).toString().padStart(2, '0');
  var day = fechaBusqueda.getDate().toString().padStart(2, '0');
  var fechaFormateada = year + '-' + month + '-' + day;
  
  // Buscar la fecha exacta
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }
  
  // Si no se encuentra la fecha exacta, buscar la fecha más cercana anterior
  var fechasMenores = datos.filter(function(d) {
    return new Date(d.fecha) <= fechaBusqueda;
  });
  
  if (fechasMenores.length > 0) {
    // Ordenar por fecha descendente y tomar la primera (la más cercana a la fecha solicitada)
    fechasMenores.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return fechasMenores[0].valor;
  }
  
  // Si no hay fechas anteriores, devolver el dato más antiguo
  datos.sort(function(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });
  
  return datos[0].valor;
} 