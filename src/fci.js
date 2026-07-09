/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta", "retornoTotal"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function fci(tipoFondo, nombreFondo, fecha, campo) {
  // Normalizo entradas
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';

  // Validar tipo de fondo (normalización con replace global)
  var tipoNormalizado = tipo.replace(/\s+/g, '').replace(/[óo]/g, 'o');
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta', 'retornototal'];
  if (!tiposPermitidos.includes(tipoNormalizado)) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta, retornoTotal.");
  }

  // Convertir tipo a formato de API
  var tipoAPI = tipoNormalizado;
  switch (tipoAPI) {
    case 'mercadodinero': tipoAPI = 'mercadoDinero'; break;
    case 'rentavariable': tipoAPI = 'rentaVariable'; break;
    case 'rentafija': tipoAPI = 'rentaFija'; break;
    case 'rentamixta': tipoAPI = 'rentaMixta'; break;
    case 'retornototal': tipoAPI = 'retornoTotal'; break;
  }

  // Validar el campo a consultar
  var camposPermitidos = ['vcp', 'ccp', 'patrimonio'];
  if (!camposPermitidos.includes(campoDatos)) {
    throw new Error("Campo inválido. Campos permitidos: vcp (valor cuotaparte), ccp (cantidad cuotapartes), patrimonio.");
  }

  // Validar que se haya proporcionado un nombre de fondo
  if (!nombre) {
    throw new Error("Debe especificar un nombre de fondo.");
  }

  // Construir URL según si se proporciona fecha o no
  var url;
  if (fecha) {
    try {
      var componentesFecha = obtenerComponentesFecha(fecha);
      url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/' + componentesFecha.year + '/' + componentesFecha.month + '/' + componentesFecha.day + '/';
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  } else {
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/ultimo';
  }

  try {
    // Consulta al API
    var respuesta = UrlFetchApp.fetch(url, {
      muteHttpExceptions: true
    });

    // Verificar si la respuesta es válida
    if (respuesta.getResponseCode() !== 200) {
      throw new Error("Error al consultar la API: Código " + respuesta.getResponseCode() + ". Verifique los parámetros.");
    }

    var datos = JSON.parse(respuesta.getContentText());

    function esFondoValido(item) {
      return item.fondo && !item.fondo.startsWith("Region:") &&
          !item.fondo.startsWith("Duration:") &&
          !item.fondo.startsWith("Benchmark:") &&
          !item.fondo.startsWith("Moneda:");
    }

    function valorCampoFondo(item) {
      var valor = item[campoDatos];
      if (valor === null || valor === undefined) {
        throw new Error("El fondo '" + item.fondo + "' no tiene valor para el campo '" + campo + "'.");
      }
      return valor;
    }

    // Buscar el fondo por nombre (exacto primero, luego parcial sin ambigüedad)
    var coincidenciasExactas = [];
    var coincidenciasParciales = [];
    for (var i = 0; i < datos.length; i++) {
      if (!esFondoValido(datos[i])) continue;
      if (datos[i].fondo === nombre) {
        coincidenciasExactas.push(datos[i]);
      } else if (datos[i].fondo.includes(nombre)) {
        coincidenciasParciales.push(datos[i]);
      }
    }

    if (coincidenciasExactas.length === 1) {
      return valorCampoFondo(coincidenciasExactas[0]);
    }
    if (coincidenciasExactas.length > 1) {
      throw new Error("Varios fondos coinciden con '" + nombre + "': " + coincidenciasExactas.map(function(f) { return f.fondo; }).join(', ') + ".");
    }
    if (coincidenciasParciales.length === 1) {
      return valorCampoFondo(coincidenciasParciales[0]);
    }
    if (coincidenciasParciales.length > 1) {
      throw new Error("Varios fondos coinciden con '" + nombre + "': " + coincidenciasParciales.slice(0, 10).map(function(f) { return f.fondo; }).join(', ') + "...");
    }

    // Si no se encontró el fondo, mostrar algunos disponibles
    var fondosDisponibles = datos
      .filter(function(d) {
        return esFondoValido(d);
      })
      .map(function(d) {
        return d.fondo;
      })
      .slice(0, 10)
      .join(", ") + "...";

    throw new Error("Fondo '" + nombre + "' no encontrado para el tipo '" + tipoFondo + "'. Algunos fondos disponibles: " + fondosDisponibles);
  } catch (e) {
    if (e.message.includes("Error al consultar la API")) {
      throw e;
    }
    throw new Error("Error al consultar información de '" + tipoFondo + "': " + e.message);
  }
}

/**
 * Obtiene la lista completa de Fondos Comunes de Inversión (FCI) disponibles en Argentina.
 *
 * @return {Array} Una matriz con todos los fondos disponibles, incluyendo el nombre, tipo y valor de cuotaparte.
 * @customfunction
 */
function fciLista() {
  // Tipos de fondos a consultar
  var tipos = ['mercadoDinero', 'rentaVariable', 'rentaFija', 'rentaMixta', 'retornoTotal'];

  // Matriz para almacenar todos los fondos
  var todosLosFondos = [['Nombre del Fondo', 'Tipo de Fondo', 'Valor Cuotaparte']];

  // Recorrer cada tipo de fondo
  tipos.forEach(function(tipo) {
    try {
      // Construir URL para obtener la lista de fondos
      var url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipo + '/ultimo';

      // Consultar la API
      var respuesta = UrlFetchApp.fetch(url, {
        muteHttpExceptions: true
      });

      // Verificar si la respuesta es válida
      if (respuesta.getResponseCode() === 200) {
        var datos = JSON.parse(respuesta.getContentText());

        // Filtrar solo los fondos válidos (no categorías)
        var fondosValidos = datos.filter(function(d) {
          return d.fondo &&
                 !d.fondo.startsWith("Region:") &&
                 !d.fondo.startsWith("Duration:") &&
                 !d.fondo.startsWith("Benchmark:") &&
                 !d.fondo.startsWith("Moneda:");
        });

        // Agregar cada fondo a la matriz de resultados
        fondosValidos.forEach(function(fondo) {
          var nombreFormateado = tipo;
          switch (tipo) {
            case 'mercadoDinero': nombreFormateado = 'Mercado de Dinero'; break;
            case 'rentaVariable': nombreFormateado = 'Renta Variable'; break;
            case 'rentaFija': nombreFormateado = 'Renta Fija'; break;
            case 'rentaMixta': nombreFormateado = 'Renta Mixta'; break;
            case 'retornoTotal': nombreFormateado = 'Retorno Total'; break;
          }

          todosLosFondos.push([
            fondo.fondo,
            nombreFormateado,
            fondo.vcp
          ]);
        });
      }
    } catch (e) {
      // Si hay un error con un tipo de fondo, continuar con los demás
      Logger.log("Error al consultar fondos de tipo '" + tipo + "': " + e.message);
    }
  });

  return todosLosFondos;
}
