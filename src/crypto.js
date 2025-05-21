/**
 * Obtiene el precio actual de criptomonedas desde la API de Coinbase.
 *
 * @param {string} symbol El símbolo de la criptomoneda (ej: 'BTC', 'ETH', 'SOL')
 * @param {string} moneda [Opcional] Moneda en la que se quiere obtener el precio (ej: 'USD', 'EUR'). Por defecto: 'USD'
 * @return El precio actual de la criptomoneda especificada en la moneda indicada.
 * @customfunction
 */
function crypto(symbol, moneda) {
  // Valor por defecto
  moneda = moneda || 'USD';
  
  // Normalizo entradas
  var cripto = symbol.toString().toUpperCase().trim();
  var divisa = moneda.toString().toUpperCase().trim();
  
  // Par de trading
  var par = cripto + '-' + divisa;
  
  // URL de la API de Coinbase (versión pública)
  var url = 'https://api.coinbase.com/v2/prices/' + par + '/spot';
  
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
        throw new Error((error.errors && error.errors[0] && error.errors[0].message) || "Error desconocido");
      } catch (e) {
        throw new Error("Código de error: " + respuesta.getResponseCode());
      }
    }
    
    // Analizar la respuesta JSON
    var datos = JSON.parse(respuesta.getContentText());
    
    // Verificar si se recibió correctamente la respuesta
    if (!datos || !datos.data || !datos.data.amount) {
      throw new Error("Respuesta inválida de Coinbase");
    }
    
    // Devolver el precio
    return parseFloat(datos.data.amount);
    
  } catch (e) {
    // Si el error indica que no se encontró el par de trading
    if (e.message.includes("Not Found") || e.message.includes("404")) {
      throw new Error("Par de trading no encontrado: '" + par + "'. Verifica que el símbolo y la moneda sean correctos.");
    }
    
    // Para otros errores, mostrar el mensaje original
    throw new Error("Error al consultar el precio de " + cripto + ": " + e.message);
  }
} 