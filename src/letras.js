/**
 * Fetches data from the API and returns information about Argentine treasury bills (letras).
 *
 * @param {string} symbol - The symbol of the treasury bill
 * @param {string} valor - The value to return (c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @return The specified value for the given treasury bill
 * @customfunction
 */
function letras(symbol, valor) {
  return panelCotizacion(
    'https://data912.com/live/arg_notes',
    symbol,
    valor,
    'letras',
    'panel:arg_notes'
  );
}

/**
 * Obtiene la lista completa de letras del tesoro desde la API.
 *
 * @return Un arreglo bidimensional con todas las letras y sus propiedades (symbol, c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @customfunction
 */
function letrasLista() {
  return panelLista('https://data912.com/live/arg_notes', 'panel:arg_notes');
}
