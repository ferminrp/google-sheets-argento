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