/**
 * Obtiene la cotización de los distintos tipos de dólar en Argentina.
 *
 * @param {string} tipo La “casa” del dólar: oficial, blue, bolsa/mep, contadoconliqui/ccl, mayorista, cripto o tarjeta.
 * @param {string} operacion 'compra', 'venta' o 'promedio'. Por defecto: 'venta'.
 * @return El valor numérico de la operación solicitada.
 * @customfunction
 */
function DOLAR(tipo, operacion) {
  if (tipo === undefined || tipo === null || tipo === '') {
    throw new Error("Tipo no proporcionado. Usa 'blue', 'oficial', 'mep', 'ccl', etc.");
  }

  operacion = (operacion === undefined || operacion === null || operacion === '')
    ? 'venta'
    : operacion;

  var casa = normalizarCasaDolar_(tipo);
  var op = operacion.toString().toLowerCase().trim();

  var datos = fetchJson('https://dolarapi.com/v1/dolares', {
    cacheKey: 'api:dolarapi:dolares',
    cacheTtlSeconds: 60
  });

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].casa.toLowerCase() === casa) {
      var compra = datos[i].compra;
      var venta = datos[i].venta;

      if (op === 'compra') return compra;
      if (op === 'venta') return venta;
      if (op === 'promedio') {
        if (compra != null && venta != null) return (compra + venta) / 2;
        if (compra != null) return compra;
        if (venta != null) return venta;
        throw new Error("No hay cotización disponible para calcular el promedio de '" + tipo + "'.");
      }

      throw new Error("Operación inválida: '" + operacion + "'. Usa 'compra', 'venta' o 'promedio'.");
    }
  }

  var disponibles = datos.map(function(o) { return o.casa; }).join(', ');
  throw new Error("Tipo inválido: '" + tipo + "'. Tipos disponibles: " + disponibles + " (aliases: mep→bolsa, ccl→contadoconliqui).");
}

/**
 * Normaliza aliases comunes de casas de dólar.
 *
 * @param {*} tipo
 * @return {string}
 */
function normalizarCasaDolar_(tipo) {
  var casa = tipo.toString().toLowerCase().trim().replace(/\s+/g, '');

  if (casa === 'mep' || casa === 'bolsa') {
    return 'bolsa';
  }
  if (casa === 'ccl' || casa === 'contado' || casa === 'contadoconliqui' || casa === 'contadoconliquidacion') {
    return 'contadoconliqui';
  }
  return casa;
}
