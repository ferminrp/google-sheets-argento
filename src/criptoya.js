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
  // Valores por defecto
  volumen = volumen || 1;
  operacion = operacion || 'totalCompra';
  
  // Normalizo entradas
  var cripto = coin.toString().toUpperCase().trim();
  var moneda = fiat.toString().toUpperCase().trim();
  var vol = parseFloat(volumen);
  var tipoOperacion = operacion.toString().toLowerCase().trim();
  
  // Mapeo de nombres de operación a los campos de la API
  var camposOperacion = {
    'compra': 'ask',
    'totalcompra': 'totalAsk',
    'venta': 'bid',
    'totalventa': 'totalBid'
  };
  
  // Verificar si la operación es válida
  if (!Object.keys(camposOperacion).includes(tipoOperacion)) {
    throw new Error("Operación inválida: '" + operacion + "'. Operaciones disponibles: compra, totalCompra, venta, totalVenta.");
  }
  
  // Campo a consultar en la respuesta
  var campo = camposOperacion[tipoOperacion];
  
  // URL de la API de CriptoYa
  var url = 'https://criptoya.com/api/' + encodeURIComponent(cripto) + '/' + encodeURIComponent(moneda) + '/' + vol;
  
  try {
    // Consulta al API
    var respuesta = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    // Comprobar si la respuesta es válida
    if (respuesta.getResponseCode() !== 200) {
      var error;
      try {
        error = JSON.parse(respuesta.getContentText());
        throw new Error(error.message || "Error desconocido");
      } catch (e) {
        throw new Error("Código de error: " + respuesta.getResponseCode());
      }
    }
    
    // Analizar la respuesta JSON
    var datos = JSON.parse(respuesta.getContentText());
    
    // Si se solicita un exchange específico
    if (exchange) {
      var exchangeKey = exchange.toString().toLowerCase().trim();
      
      // Verificar si el exchange existe en la respuesta
      if (!datos[exchangeKey]) {
        var exchangesDisponibles = Object.keys(datos).join(', ');
        throw new Error("Exchange '" + exchange + "' no disponible. Exchanges disponibles: " + exchangesDisponibles);
      }
      
      // Verificar si el campo solicitado existe para ese exchange
      if (datos[exchangeKey][campo] === undefined) {
        throw new Error("El campo '" + operacion + "' no está disponible para el exchange '" + exchange + "'");
      }
      
      // Devolver el precio del exchange específico
      return datos[exchangeKey][campo];
    }
    
    // Si no se especifica exchange, buscar el mejor precio según la operación
    var mejorPrecio;
    var mejorExchange;
    
    // Determinar el mejor precio según el tipo de operación
    if (tipoOperacion.includes('compra')) {
      // Para compra, el mejor precio es el más bajo
      mejorPrecio = Infinity;
      for (var ex in datos) {
        // Verificar que el exchange tenga el campo solicitado
        if (datos[ex][campo] !== undefined && datos[ex][campo] < mejorPrecio) {
          mejorPrecio = datos[ex][campo];
          mejorExchange = ex;
        }
      }
    } else {
      // Para venta, el mejor precio es el más alto
      mejorPrecio = -Infinity;
      for (var ex in datos) {
        // Verificar que el exchange tenga el campo solicitado
        if (datos[ex][campo] !== undefined && datos[ex][campo] > mejorPrecio) {
          mejorPrecio = datos[ex][campo];
          mejorExchange = ex;
        }
      }
    }
    
    // Verificar si se encontró algún precio
    if (mejorPrecio === Infinity || mejorPrecio === -Infinity) {
      throw new Error("No se encontraron precios disponibles para " + cripto + "/" + moneda + " con el tipo de operación '" + operacion + "'");
    }
    
    // Devolver el mejor precio
    return mejorPrecio;
    
  } catch (e) {
    // Si el error indica que la moneda o criptomoneda no es válida
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par " + cripto + "/" + moneda + " no encontrado. Verifica que la cripto y la moneda sean correctas.");
    }
    
    // Para otros errores, mostrar el mensaje original
    throw new Error("Error al consultar precio de " + cripto + "/" + moneda + ": " + e.message);
  }
} 