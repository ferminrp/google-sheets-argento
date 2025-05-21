/**
 * Obtiene los índices UVA (Unidad de Valor Adquisitivo) de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'MM/DD/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice UVA para la fecha especificada o el último disponible.
 * @customfunction
 */
function uva(fecha) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/indices/uva';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());
  
  // Si no se proporciona fecha, devolver el valor más reciente
  if (!fecha) {
    // Ordena los datos por fecha descendente para obtener el más reciente
    datos.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return datos[0].valor;
  }
  
  // Normalizar el formato de fecha
  var fechaBusqueda;
  try {
    // Intentar parsear la fecha desde diferentes formatos
    if (fecha instanceof Date) {
      fechaBusqueda = fecha;
    } else {
      // Convertir de formato MM/DD/YYYY a YYYY-MM-DD si es necesario
      if (fecha.indexOf('/') !== -1) {
        var partes = fecha.split('/');
        if (partes.length === 3) {
          fecha = partes[2] + '-' + partes[0] + '-' + partes[1];
        }
      }
      
      fechaBusqueda = new Date(fecha);
      
      // Verificar si la fecha es válida
      if (isNaN(fechaBusqueda.getTime())) {
        throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
      }
    }
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'.");
  }
  
  // Convertir a formato YYYY-MM-DD para comparar con datos de la API
  var year = fechaBusqueda.getFullYear();
  var month = (fechaBusqueda.getMonth() + 1).toString().padStart(2, '0');
  var day = fechaBusqueda.getDate().toString().padStart(2, '0');
  var fechaFormateada = year + '-' + month + '-' + day;
  
  // Buscar la fecha exacta
  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }
  
  // Si no se encuentra la fecha exacta, buscar la fecha más cercana anterior
  var fechasMenores = datos.filter(function(d) {
    return new Date(d.fecha) <= fechaBusqueda;
  });
  
  if (fechasMenores.length > 0) {
    // Ordenar por fecha descendente y tomar la primera (la más cercana a la fecha solicitada)
    fechasMenores.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });
    
    return fechasMenores[0].valor;
  }
  
  // Si no hay fechas anteriores, devolver el dato más antiguo
  datos.sort(function(a, b) {
    return new Date(a.fecha) - new Date(b.fecha);
  });
  
  return datos[0].valor;
} 