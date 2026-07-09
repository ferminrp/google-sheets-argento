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
function obligacionesLista() {
  return panelLista('https://data912.com/live/arg_corp', 'panel:arg_corp');
}
