/**
 * Obtiene el rendimiento (APY) de criptomonedas ofrecido por diferentes proveedores.
 *
 * @param {string} moneda La criptomoneda o moneda fiat para la cual se quiere consultar el rendimiento (ej: 'BTC', 'USDT', 'ARS')
 * @param {string} proveedor [Opcional] El proveedor específico a consultar (ej: 'buenbit', 'ripio', 'letsbit'). Si no se especifica, devuelve el mejor rendimiento disponible.
 * @return El APY (rendimiento anual) expresado como porcentaje.
 * @customfunction
 */
function rendimientos(moneda, proveedor) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/rendimientos';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var crypto = moneda ? moneda.toString().toUpperCase().trim() : '';
  var exchange = proveedor ? proveedor.toString().toLowerCase().trim() : '';
  
  // Verificar si se proporcionó la moneda
  if (!crypto) {
    throw new Error("Debe especificar una criptomoneda o moneda fiat.");
  }
  
  // Si se especifica un proveedor, buscar solo en ese proveedor
  if (exchange) {
    var proveedorEncontrado = false;
    var rendimientoEncontrado = false;
    
    for (var i = 0; i < datos.length; i++) {
      if (datos[i].entidad === exchange) {
        proveedorEncontrado = true;
        
        // Buscar la moneda en los rendimientos del proveedor
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          if (datos[i].rendimientos[j].moneda.toUpperCase() === crypto) {
            rendimientoEncontrado = true;
            return datos[i].rendimientos[j].apy;
          }
        }
        
        // Si llegamos aquí, no se encontró la moneda en este proveedor
        throw new Error("La moneda '" + moneda + "' no está disponible en el proveedor '" + proveedor + "'.");
      }
    }
    
    // Si llegamos aquí, no se encontró el proveedor
    if (!proveedorEncontrado) {
      // Obtener la lista de proveedores disponibles
      var proveedoresDisponibles = datos.map(function(d) { return d.entidad; }).join(", ");
      throw new Error("Proveedor '" + proveedor + "' no encontrado. Proveedores disponibles: " + proveedoresDisponibles);
    }
  } else {
    // Si no se especifica proveedor, buscar el mejor rendimiento para la moneda
    var mejorApy = -1;
    var mejorProveedor = "";
    var monedaEncontrada = false;
    
    for (var i = 0; i < datos.length; i++) {
      var proveedor = datos[i];
      
      for (var j = 0; j < proveedor.rendimientos.length; j++) {
        if (proveedor.rendimientos[j].moneda.toUpperCase() === crypto) {
          monedaEncontrada = true;
          var apy = proveedor.rendimientos[j].apy;
          
          if (apy > mejorApy) {
            mejorApy = apy;
            mejorProveedor = proveedor.entidad;
          }
        }
      }
    }
    
    // Verificar si se encontró la moneda
    if (!monedaEncontrada) {
      // Obtener lista de monedas disponibles (sin duplicados)
      var monedasDisponibles = [];
      for (var i = 0; i < datos.length; i++) {
        for (var j = 0; j < datos[i].rendimientos.length; j++) {
          var moneda = datos[i].rendimientos[j].moneda.toUpperCase();
          if (monedasDisponibles.indexOf(moneda) === -1) {
            monedasDisponibles.push(moneda);
          }
        }
      }
      monedasDisponibles.sort();
      
      throw new Error("Moneda '" + moneda + "' no encontrada. Algunas monedas disponibles: " + monedasDisponibles.slice(0, 15).join(", ") + "...");
    }
    
    // Si el mejor APY es 0, indicar que no hay rendimiento disponible
    if (mejorApy === 0) {
      return 0; // No hay rendimiento disponible para esta moneda
    }
    
    return mejorApy;
  }
} 