/**
 * Obtiene las tasas de plazos fijos ofrecidas por bancos en Argentina.
 *
 * @param {string} banco [Opcional] El nombre del banco específico a consultar. Si no se especifica, devuelve la mejor tasa disponible.
 * @param {string} tipoCliente [Opcional] El tipo de cliente: "cliente" o "nocliente". Por defecto: "cliente".
 * @return La tasa nominal anual (TNA) expresada como porcentaje.
 * @customfunction
 */
function PLAZOFIJO(banco, tipoCliente) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/tasas/plazoFijo', {
    cacheKey: 'api:ad:plazofijo',
    cacheTtlSeconds: 120
  });

  // Normalizo entradas
  var nombreBanco = banco ? banco.toString().toUpperCase().trim() : '';
  var tipo = tipoCliente ? tipoCliente.toString().toLowerCase().trim() : 'cliente';
  
  // Determinar qué campo de tasa usar según el tipo de cliente
  if (tipo !== 'cliente' && tipo !== 'nocliente') {
    throw new Error("Tipo de cliente inválido: '" + tipoCliente + "'. Usar 'cliente' o 'nocliente'.");
  }
  var campoTasa = (tipo === 'nocliente') ? 'tnaNoClientes' : 'tnaClientes';

  function obtenerTasaBanco(entidad) {
    for (var k = 0; k < datos.length; k++) {
      if (datos[k].entidad === entidad) {
        if (datos[k][campoTasa] !== null) {
          return datos[k][campoTasa];
        }
        if (campoTasa === 'tnaNoClientes') {
          throw new Error("El banco '" + entidad + "' no ofrece plazo fijo para no clientes.");
        }
        throw new Error("No se encontró información de tasa para el banco '" + entidad + "'.");
      }
    }
    return null;
  }
  
  // Si se especifica un banco, buscar ese banco específico
  if (nombreBanco) {
    var coincidenciasExactas = [];
    var coincidenciasParciales = [];
    
    for (var i = 0; i < datos.length; i++) {
      var entidadUpper = datos[i].entidad.toUpperCase();
      if (entidadUpper === nombreBanco) {
        coincidenciasExactas.push(datos[i].entidad);
      } else if (entidadUpper.includes(nombreBanco)) {
        coincidenciasParciales.push(datos[i].entidad);
      }
    }

    if (coincidenciasExactas.length === 1) {
      return obtenerTasaBanco(coincidenciasExactas[0]);
    }
    if (coincidenciasExactas.length > 1) {
      throw new Error("Varios bancos coinciden con '" + banco + "': " + coincidenciasExactas.join(', ') + ".");
    }
    if (coincidenciasParciales.length === 1) {
      return obtenerTasaBanco(coincidenciasParciales[0]);
    }
    if (coincidenciasParciales.length > 1) {
      throw new Error("Varios bancos coinciden con '" + banco + "': " + coincidenciasParciales.slice(0, 10).join(', ') + "...");
    }
    
    // Si llegamos aquí, no se encontró el banco
    var bancosDisponibles = datos.map(function(d) {
      return d.entidad;
    }).sort().slice(0, 10).join(", ") + "...";

    throw new Error("Banco '" + banco + "' no encontrado. Algunos bancos disponibles: " + bancosDisponibles);
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