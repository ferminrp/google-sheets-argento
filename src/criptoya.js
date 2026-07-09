/**
 * Obtiene los precios de compra y venta de criptomonedas desde CriptoYa.
 *
 * @param {string} coin La criptomoneda a consultar (ej: 'BTC', 'ETH', 'USDT')
 * @param {string} fiat La moneda contra la que se opera (ej: 'ARS', 'USD', 'EUR')
 * @param {number} volumen [Opcional] El volumen a operar. Por defecto: 1
 * @param {string} exchange [Opcional] El exchange específico a consultar. Si no se especifica, devuelve el mejor precio.
 * @param {string} operacion [Opcional] Tipo de operación: 'compra', 'venta', 'totalCompra', 'totalVenta'. Por defecto: 'totalCompra'
 * @return El precio de la operación solicitada.
 * @customfunction
 */
function criptoya(coin, fiat, volumen, exchange, operacion) {
  if (coin === undefined || coin === null || coin === '') {
    throw new Error("Criptomoneda no proporcionada (ej: 'BTC', 'USDT').");
  }
  if (fiat === undefined || fiat === null || fiat === '') {
    throw new Error("Moneda fiat no proporcionada (ej: 'ARS', 'USD').");
  }

  volumen = volumen || 1;
  operacion = operacion || 'totalCompra';

  var cripto = coin.toString().toUpperCase().trim();
  var moneda = fiat.toString().toUpperCase().trim();
  var vol = parseFloat(volumen);
  var tipoOperacion = operacion.toString().toLowerCase().trim();

  var camposOperacion = {
    'compra': 'ask',
    'totalcompra': 'totalAsk',
    'venta': 'bid',
    'totalventa': 'totalBid'
  };

  if (!Object.keys(camposOperacion).includes(tipoOperacion)) {
    throw new Error("Operación inválida: '" + operacion + "'. Operaciones disponibles: compra, totalCompra, venta, totalVenta.");
  }

  var campo = camposOperacion[tipoOperacion];
  var url = 'https://criptoya.com/api/' + encodeURIComponent(cripto) + '/' + encodeURIComponent(moneda) + '/' + vol;

  try {
    var datos = fetchJson(url, {
      headers: { 'Accept': 'application/json' },
      cacheKey: 'criptoya:' + cripto + ':' + moneda + ':' + vol,
      cacheTtlSeconds: 60
    });

    if (exchange) {
      var exchangeKey = exchange.toString().toLowerCase().trim();

      if (!datos[exchangeKey]) {
        var exchangesDisponibles = Object.keys(datos).join(', ');
        throw new Error("Exchange '" + exchange + "' no disponible. Exchanges disponibles: " + exchangesDisponibles);
      }

      if (datos[exchangeKey][campo] === undefined) {
        throw new Error("El campo '" + operacion + "' no está disponible para el exchange '" + exchange + "'");
      }

      return datos[exchangeKey][campo];
    }

    var mejorPrecio;
    if (tipoOperacion.includes('compra')) {
      mejorPrecio = Infinity;
      for (var ex in datos) {
        if (datos[ex][campo] !== undefined && datos[ex][campo] < mejorPrecio) {
          mejorPrecio = datos[ex][campo];
        }
      }
    } else {
      mejorPrecio = -Infinity;
      for (var ex2 in datos) {
        if (datos[ex2][campo] !== undefined && datos[ex2][campo] > mejorPrecio) {
          mejorPrecio = datos[ex2][campo];
        }
      }
    }

    if (mejorPrecio === Infinity || mejorPrecio === -Infinity) {
      throw new Error("No se encontraron precios disponibles para " + cripto + "/" + moneda + " con el tipo de operación '" + operacion + "'");
    }

    return mejorPrecio;
  } catch (e) {
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par " + cripto + "/" + moneda + " no encontrado. Verifica que la cripto y la moneda sean correctas.");
    }
    throw new Error("Error al consultar precio de " + cripto + "/" + moneda + ": " + e.message);
  }
}
