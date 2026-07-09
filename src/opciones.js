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
function opcionesLista() {
  return panelLista('https://data912.com/live/arg_options', 'panel:arg_options');
}
