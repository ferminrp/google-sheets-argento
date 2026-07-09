/**
 * Obtiene la cotización histórica del dólar según el tipo y fecha especificados
 *
 * @param {string} tipo - Tipo de dólar (blue, oficial, mayorista, mep, ccl, etc.)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * @param {string} valor - Opcional: "compra" o "venta" (por defecto es "venta")
 * @return {number} Valor de la cotización para el tipo y fecha solicitados
 * @customfunction
 */
function dolar_historico(tipo, fecha, valor) {
  valor = valor || "venta";

  if (!tipo) {
    throw new Error("Debe especificar un tipo de dólar");
  }

  var casa = normalizarCasaDolar_(tipo);

  // Si no se proporciona fecha, usar la fecha actual en Argentina
  var fechaISO;
  if (!fecha) {
    var hoy = new Date();
    fechaISO = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fechaISO = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  var campo = valor.toString().toLowerCase().trim();
  if (campo !== "compra" && campo !== "venta") {
    throw new Error("El valor debe ser 'compra' o 'venta'");
  }

  var componentes = obtenerComponentesFecha(fechaISO);
  var url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares/' +
    encodeURIComponent(casa) + '/' +
    componentes.year + '/' + componentes.month + '/' + componentes.day;

  var cotizacion = fetchJson(url, { skipCache: true });
  if (cotizacion && cotizacion[campo] != null) {
    return cotizacion[campo];
  }
  throw new Error("No se encontró cotización para la fecha y tipo especificados");
}

/**
 * Obtiene todas las cotizaciones de dólar para una fecha específica
 *
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * @return {Array} Matriz con las cotizaciones de cada tipo de dólar para la fecha
 * @customfunction
 */
function dolar_historico_todos(fecha) {
  var fechaISO;
  if (!fecha) {
    var hoy = new Date();
    fechaISO = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fechaISO = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  // Serie completa cacheada (payload grande: solo cachear si entra en el límite de CacheService)
  var data = fetchJson('https://api.argentinadatos.com/v1/cotizaciones/dolares', {
    cacheKey: 'api:ad:dolares:all',
    cacheTtlSeconds: 300
  });

  var cotizaciones = data.filter(function(item) {
    return item.fecha === fechaISO;
  });

  if (cotizaciones.length === 0) {
    throw new Error("No se encontraron cotizaciones para la fecha especificada");
  }

  var resultado = [["Tipo", "Compra", "Venta", "Fecha"]];

  cotizaciones.forEach(function(cotizacion) {
    resultado.push([
      cotizacion.casa,
      cotizacion.compra,
      cotizacion.venta,
      cotizacion.fecha
    ]);
  });

  return resultado;
}
