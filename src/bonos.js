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
