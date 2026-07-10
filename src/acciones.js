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
