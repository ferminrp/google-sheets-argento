/**
 * Obtiene la cotización histórica del dólar según el tipo y fecha especificados
 * 
 * @param {string} tipo - Tipo de dólar (blue, oficial, mayorista, etc.)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD o DD/MM/YYYY
 * @param {string} valor - Opcional: "compra" o "venta" (por defecto es "venta")
 * @return {number} Valor de la cotización para el tipo y fecha solicitados
 * @customfunction
 */
function dolar_historico(tipo, fecha, valor) {
  valor = valor || "venta";

  // URL de la API de ArgentinaDatos para cotizaciones de dólares
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';

  if (!tipo) {
    throw new Error("Debe especificar un tipo de dólar");
  }

  // Si no se proporciona fecha, usar la fecha actual en Argentina
  if (!fecha) {
    const hoy = new Date();
    fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fecha = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  if (valor.toLowerCase() !== "compra" && valor.toLowerCase() !== "venta") {
    throw new Error("El valor debe ser 'compra' o 'venta'");
  }

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const cotizacion = data.filter(item =>
    item.casa.toLowerCase() === tipo.toLowerCase() &&
    item.fecha === fecha
  );

  if (cotizacion.length > 0) {
    return cotizacion[0][valor.toLowerCase()];
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
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';

  if (!fecha) {
    const hoy = new Date();
    fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
  } else {
    try {
      fecha = formatearFechaISO(fecha);
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  const response = UrlFetchApp.fetch(url);
  const data = JSON.parse(response.getContentText());

  const cotizaciones = data.filter(item => item.fecha === fecha);

  if (cotizaciones.length === 0) {
    throw new Error("No se encontraron cotizaciones para la fecha especificada");
  }

  const resultado = [["Tipo", "Compra", "Venta", "Fecha"]];

  cotizaciones.forEach(cotizacion => {
    resultado.push([
      cotizacion.casa,
      cotizacion.compra,
      cotizacion.venta,
      cotizacion.fecha
    ]);
  });

  return resultado;
}
