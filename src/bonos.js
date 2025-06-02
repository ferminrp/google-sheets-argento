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