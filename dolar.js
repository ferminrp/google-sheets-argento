/**
 * Obtiene la cotización de los distintos tipos de dólar en Argentina.
 *
 * @param {string} tipo La “casa” del dólar: oficial, blue, bolsa, contadoconliqui, mayorista, cripto o tarjeta.
 * @param {string} operacion 'compra', 'venta' o 'promedio'.
 * @return El valor numérico de la operación solicitada.
 * @customfunction
 */
function dolar(tipo, operacion) {
  // Consulta al API
  var url = 'https://dolarapi.com/v1/dolares';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var casa = tipo.toString().toLowerCase().trim();
  var op = operacion.toString().toLowerCase().trim();
  
  // Busco la casa solicitada
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].casa.toLowerCase() === casa) {
      var compra = datos[i].compra;
      var venta  = datos[i].venta;
      
      if (op === 'compra')     return compra;
      if (op === 'venta')      return venta;
      if (op === 'promedio')   return (compra + venta) / 2;
      
      throw new Error("Operación inválida: '" + operacion + "'. Usa 'compra', 'venta' o 'promedio'.");
    }
  }
  
  // Si no encontró la casa
  var disponibles = datos.map(function(o){ return o.casa; }).join(', ');
  throw new Error("Tipo inválido: '" + tipo + "'. Tipos disponibles: " + disponibles + ".");
}
