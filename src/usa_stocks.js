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
function usa_stocksLista() {
  return panelLista('https://data912.com/live/usa_stocks', 'panel:usa_stocks');
}
