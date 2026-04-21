/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta", "retornoTotal"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function fci(tipoFondo, nombreFondo, fecha, campo) {
  function esFechaValida(year, month, day) {
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return false;
    }
    var fechaUTC = new Date(Date.UTC(year, month - 1, day));
    var fechaLocal = new Date(year, month - 1, day);
    return fechaUTC.getUTCFullYear() === year &&
           (fechaUTC.getUTCMonth() + 1) === month &&
           fechaUTC.getUTCDate() === day &&
           fechaLocal.getFullYear() === year &&
           (fechaLocal.getMonth() + 1) === month &&
           fechaLocal.getDate() === day;
  }

  function obtenerComponentesFecha(fechaInput) {
    var year;
    var month;
    var day;

    if (fechaInput instanceof Date) {
      if (isNaN(fechaInput.getTime())) {
        throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
      year = fechaInput.getFullYear();
      month = fechaInput.getMonth() + 1;
      day = fechaInput.getDate();
    } else {
      var fechaStr = fechaInput.toString().trim();
      var matchISO = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
      var matchUS = fechaStr.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

      if (matchISO) {
        year = parseInt(matchISO[1], 10);
        month = parseInt(matchISO[2], 10);
        day = parseInt(matchISO[3], 10);
      } else if (matchUS) {
        month = parseInt(matchUS[1], 10);
        day = parseInt(matchUS[2], 10);
        year = parseInt(matchUS[3], 10);
      } else {
        throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
    }

    if (!esFechaValida(year, month, day)) {
      throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
    }

    return {
      year: year.toString(),
      month: month.toString().padStart(2, '0'),
      day: day.toString().padStart(2, '0')
    };
  }

  // Normalizo entradas
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';
  
  // Validar tipo de fondo
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta', 'retornototal'];
  if (!tiposPermitidos.includes(tipo.replace(/\s+/g, '').replace(/[óo]/, 'o'))) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta, retornoTotal.");
  }
  
  // Convertir tipo a formato de API
  var tipoAPI = tipo.replace(/\s+/g, '').replace(/[óo]/, 'o');
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
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
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
    
    // Buscar el fondo por nombre
    var fondoEncontrado = false;
    for (var i = 0; i < datos.length; i++) {
      // Solo considerar entradas que sean fondos válidos (no categorías)
      if (datos[i].fondo && !datos[i].fondo.startsWith("Region:") && 
          !datos[i].fondo.startsWith("Duration:") && 
          !datos[i].fondo.startsWith("Benchmark:") && 
          !datos[i].fondo.startsWith("Moneda:")) {
        
        // Coincidencia exacta o parcial con el nombre del fondo
        if (datos[i].fondo === nombre || datos[i].fondo.includes(nombre)) {
          fondoEncontrado = true;
          
          // Verificar si el campo solicitado tiene valor
          if (datos[i][campoDatos] !== null) {
            return datos[i][campoDatos];
          } else {
            throw new Error("El fondo '" + datos[i].fondo + "' no tiene valor para el campo '" + campo + "'.");
          }
        }
      }
    }
    
    // Si no se encontró el fondo, mostrar algunos disponibles
    if (!fondoEncontrado) {
      var fondosDisponibles = datos
        .filter(function(d) { 
          return d.fondo && !d.fondo.startsWith("Region:") && 
                 !d.fondo.startsWith("Duration:") && 
                 !d.fondo.startsWith("Benchmark:") && 
                 !d.fondo.startsWith("Moneda:"); 
        })
        .map(function(d) { 
          return d.fondo; 
        })
        .slice(0, 10)
        .join(", ") + "...";
      
      throw new Error("Fondo '" + nombre + "' no encontrado para el tipo '" + tipoFondo + "'. Algunos fondos disponibles: " + fondosDisponibles);
    }
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
