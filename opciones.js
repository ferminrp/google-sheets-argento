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