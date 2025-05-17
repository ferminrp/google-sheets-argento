/**
 * Obtiene las tasas de plazos fijos ofrecidas por bancos en Argentina.
 *
 * @param {string} banco [Opcional] El nombre del banco específico a consultar. Si no se especifica, devuelve la mejor tasa disponible.
 * @param {string} tipoCliente [Opcional] El tipo de cliente: "cliente" o "nocliente". Por defecto: "cliente".
 * @return La tasa nominal anual (TNA) expresada como porcentaje.
 * @customfunction
 */
function plazofijo(banco, tipoCliente) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Normalizo entradas
  var nombreBanco = banco ? banco.toString().toUpperCase().trim() : '';
  var tipo = tipoCliente ? tipoCliente.toString().toLowerCase().trim() : 'cliente';
  
  // Determinar qué campo de tasa usar según el tipo de cliente
  var campoTasa = (tipo === 'nocliente') ? 'tnaNoClientes' : 'tnaClientes';
  
  // Si se especifica un banco, buscar ese banco específico
  if (nombreBanco) {
    var bancoEncontrado = false;
    
    for (var i = 0; i < datos.length; i++) {
      // Buscar coincidencia parcial en el nombre del banco
      if (datos[i].entidad.toUpperCase().includes(nombreBanco)) {
        bancoEncontrado = true;
        
        // Verificar si el banco tiene la tasa para el tipo de cliente especificado
        if (datos[i][campoTasa] !== null) {
          return datos[i][campoTasa];
        } else {
          if (campoTasa === 'tnaNoClientes') {
            throw new Error("El banco '" + datos[i].entidad + "' no ofrece plazo fijo para no clientes.");
          } else {
            throw new Error("No se encontró información de tasa para el banco '" + datos[i].entidad + "'.");
          }
        }
      }
    }
    
    // Si llegamos aquí, no se encontró el banco
    if (!bancoEncontrado) {
      // Obtener lista de bancos disponibles
      var bancosDisponibles = datos.map(function(d) { 
        return d.entidad;
      }).sort().slice(0, 10).join(", ") + "...";
      
      throw new Error("Banco '" + banco + "' no encontrado. Algunos bancos disponibles: " + bancosDisponibles);
    }
  } else {
    // Si no se especifica banco, buscar la mejor tasa
    var mejorTasa = -1;
    var mejorBanco = "";
    var bancoConTasa = false;
    
    for (var i = 0; i < datos.length; i++) {
      // Solo considerar bancos que tienen tasa para el tipo de cliente especificado
      if (datos[i][campoTasa] !== null) {
        bancoConTasa = true;
        var tasa = datos[i][campoTasa];
        
        if (tasa > mejorTasa) {
          mejorTasa = tasa;
          mejorBanco = datos[i].entidad;
        }
      }
    }
    
    // Verificar si se encontró alguna tasa
    if (!bancoConTasa) {
      if (campoTasa === 'tnaNoClientes') {
        throw new Error("No se encontraron bancos que ofrezcan plazo fijo para no clientes.");
      } else {
        throw new Error("No se encontró información de tasas para ningún banco.");
      }
    }
    
    return mejorTasa;
  }
} 