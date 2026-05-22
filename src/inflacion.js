/**
 * Obtiene los índices de inflación de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del índice de inflación para la fecha especificada o el último disponible.
 * @customfunction
 */
function inflacion(fecha) {
  // Consulta al API
  var url = 'https://api.argentinadatos.com/v1/finanzas/indices/inflacion';
  var respuesta = UrlFetchApp.fetch(url);
  var datos = JSON.parse(respuesta.getContentText());

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos de inflación desde la API.");
  }

  // Si no se proporciona fecha, devolver el valor más reciente
  if (!fecha) {
    datos.sort(function(a, b) {
      return new Date(b.fecha) - new Date(a.fecha);
    });

    return datos[0].valor;
  }

  var fechaFormateada;
  var fechaBusqueda;
  try {
    fechaFormateada = formatearFechaISO(fecha);
    fechaBusqueda = parsearFechaLocal(fecha);
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

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
