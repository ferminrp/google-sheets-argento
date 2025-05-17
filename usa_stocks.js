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