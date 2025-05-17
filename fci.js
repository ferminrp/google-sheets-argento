/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function fci(tipoFondo, nombreFondo, fecha, campo) {
  // Normalizo entradas
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';
  
  // Validar tipo de fondo
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta'];
  if (!tiposPermitidos.includes(tipo.replace(/\s+/g, '').replace(/[óo]/, 'o'))) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta.");
  }
  
  // Convertir tipo a formato de API
  var tipoAPI = tipo.replace(/\s+/g, '').replace(/[óo]/, 'o');
  switch (tipoAPI) {
    case 'mercadodinero': tipoAPI = 'mercadoDinero'; break;
    case 'rentavariable': tipoAPI = 'rentaVariable'; break;
    case 'rentafija': tipoAPI = 'rentaFija'; break;
    case 'rentamixta': tipoAPI = 'rentaMixta'; break;
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
    // Formatear la fecha a YYYY/MM/DD si viene en otro formato
    var fechaObj;
    try {
      if (fecha instanceof Date) {
        fechaObj = fecha;
      } else {
        // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
        if (fecha.indexOf('/') !== -1) {
          var partes = fecha.split('/');
          if (partes.length === 3) {
            fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
          }
        }
        fechaObj = new Date(fecha);
        
        // Verificar si la fecha es válida
        if (isNaN(fechaObj.getTime())) {
          throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
        }
      }
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
    }
    
    // Formatear a YYYY/MM/DD para la URL
    var year = fechaObj.getFullYear();
    var month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    var day = fechaObj.getDate().toString().padStart(2, '0');
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/' + year + '/' + month + '/' + day + '/';
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