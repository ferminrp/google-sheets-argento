/**
 * Obtiene la cotización histórica del dólar según el tipo y fecha especificados
 * 
 * @param {string} tipo - Tipo de dólar (blue, oficial, mayorista, etc.)
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @param {string} valor - Opcional: "compra" o "venta" (por defecto es "venta")
 * @return {number} Valor de la cotización para el tipo y fecha solicitados
 * @customfunction
 */
function dolar_historico(tipo, fecha, valor = "venta") {
  // URL de la API de ArgentinaDatos para cotizaciones de dólares
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';
  
  try {
    // Validar parámetros
    if (!tipo) {
      return "Error: Debe especificar un tipo de dólar";
    }
    
    // Si no se proporciona fecha, usar la fecha actual
    if (!fecha) {
      const hoy = new Date();
      fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
    }
    
    // Validar valor (compra o venta)
    if (valor.toLowerCase() !== "compra" && valor.toLowerCase() !== "venta") {
      return "Error: El valor debe ser 'compra' o 'venta'";
    }
    
    // Realizar la solicitud GET a la API
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Filtrar los resultados por tipo de dólar y fecha
    const cotizacion = data.filter(item => 
      item.casa.toLowerCase() === tipo.toLowerCase() && 
      item.fecha === fecha
    );
    
    // Si se encontró una cotización, devolver el valor solicitado
    if (cotizacion.length > 0) {
      return cotizacion[0][valor.toLowerCase()];
    } else {
      return "No se encontró cotización para la fecha y tipo especificados";
    }
  } catch (error) {
    return "Error: " + error.toString();
  }
}

/**
 * Obtiene todas las cotizaciones de dólar para una fecha específica
 * 
 * @param {string} fecha - Fecha en formato YYYY-MM-DD
 * @return {Array} Matriz con las cotizaciones de cada tipo de dólar para la fecha
 * @customfunction
 */
function dolar_historico_todos(fecha) {
  // URL de la API de ArgentinaDatos para cotizaciones de dólares
  const url = 'https://api.argentinadatos.com/v1/cotizaciones/dolares';
  
  try {
    // Si no se proporciona fecha, usar la fecha actual
    if (!fecha) {
      const hoy = new Date();
      fecha = Utilities.formatDate(hoy, "GMT-3", "yyyy-MM-dd");
    }
    
    // Realizar la solicitud GET a la API
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Filtrar los resultados por fecha
    const cotizaciones = data.filter(item => item.fecha === fecha);
    
    // Si no hay cotizaciones para esa fecha
    if (cotizaciones.length === 0) {
      return [["No se encontraron cotizaciones para la fecha especificada"]];
    }
    
    // Crear encabezados para la tabla
    const resultado = [["Tipo", "Compra", "Venta", "Fecha"]];
    
    // Agregar cada cotización a la matriz
    cotizaciones.forEach(cotizacion => {
      resultado.push([
        cotizacion.casa,
        cotizacion.compra,
        cotizacion.venta,
        cotizacion.fecha
      ]);
    });
    
    return resultado;
  } catch (error) {
    return [["Error: " + error.toString()]];
  }
} 