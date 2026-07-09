/**
 * Obtiene el valor del riesgo país de Argentina.
 *
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve el valor más reciente.
 * @return El valor numérico del riesgo país para la fecha especificada o el último disponible.
 * @customfunction
 */
function RIESGOPAIS(fecha) {
  var datos = fetchJson('https://api.argentinadatos.com/v1/finanzas/indices/riesgo-pais', {
    cacheKey: 'api:ad:riesgo-pais',
    cacheTtlSeconds: 300
  });

  if (!datos || !datos.length) {
    throw new Error("No se recibieron datos de riesgo país desde la API.");
  }

  if (!fecha) {
    datos.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return datos[0].valor;
  }

  var fechaFormateada;
  try {
    fechaFormateada = formatearFechaISO(fecha);
  } catch (e) {
    throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  for (var i = 0; i < datos.length; i++) {
    if (datos[i].fecha === fechaFormateada) {
      return datos[i].valor;
    }
  }

  var fechasMenores = datos.filter(function(d) {
    return d.fecha <= fechaFormateada;
  });

  if (fechasMenores.length > 0) {
    fechasMenores.sort(function(a, b) {
      return b.fecha.localeCompare(a.fecha);
    });
    return fechasMenores[0].valor;
  }

  datos.sort(function(a, b) {
    return a.fecha.localeCompare(b.fecha);
  });

  return datos[0].valor;
}
