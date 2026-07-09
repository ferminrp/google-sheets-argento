/**
 * Obtiene el precio actual de criptomonedas desde la API de Coinbase.
 *
 * @param {string} symbol El símbolo de la criptomoneda (ej: 'BTC', 'ETH', 'SOL')
 * @param {string} moneda [Opcional] Moneda en la que se quiere obtener el precio (ej: 'USD', 'EUR'). Por defecto: 'USD'
 * @return El precio actual de la criptomoneda especificada en la moneda indicada.
 * @customfunction
 */
function CRYPTO(symbol, moneda) {
  if (symbol === undefined || symbol === null || symbol === '') {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: 'BTC').");
  }

  moneda = moneda || 'USD';

  var cripto = symbol.toString().toUpperCase().trim();
  var divisa = moneda.toString().toUpperCase().trim();
  var par = cripto + '-' + divisa;
  var url = 'https://api.coinbase.com/v2/prices/' + encodeURIComponent(par) + '/spot';

  try {
    var datos = fetchJson(url, {
      headers: { 'Accept': 'application/json' },
      cacheKey: 'crypto:' + par,
      cacheTtlSeconds: 60
    });

    if (!datos || !datos.data || !datos.data.amount) {
      throw new Error("Respuesta inválida de Coinbase");
    }

    return parseFloat(datos.data.amount);
  } catch (e) {
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par de trading no encontrado: '" + par + "'. Verifica que el símbolo y la moneda sean correctos.");
    }
    throw new Error("Error al consultar el precio de " + cripto + ": " + e.message);
  }
}
