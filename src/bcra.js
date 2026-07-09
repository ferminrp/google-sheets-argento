/**
 * Devuelve un array con todas las variables disponibles del BCRA (Banco Central de la República Argentina).
 * Cada elemento contiene el ID de la variable y su valor actual.
 *
 * @return {Array} Un array de variables del BCRA donde cada elemento es [idVariable, valor]
 * @customfunction
 */
function bcraVariables() {
  try {
    var data = fetchBcraMonetarias_();
    return data.results.map(function(item) {
      return [item.categoria, item.idVariable, item.descripcion, item.valor, item.fecha];
    });
  } catch (error) {
    throw new Error("Error al consultar el BCRA: " + error.message);
  }
}

/**
 * Obtiene datos de la API del BCRA (Banco Central de la República Argentina)
 * y devuelve el último valor para una variable específica según su ID.
 *
 * @param {number} id - The ID of the variable to fetch
 * @return The value of the specified variable
 * @customfunction
 */
function bcra(id) {
  if (id === undefined || id === null || id === '' || isNaN(parseInt(id, 10))) {
    throw new Error("ID inválido. Debe ser un número válido (1, 4, 5, 6, etc).");
  }

  var variableId = parseInt(id, 10);

  try {
    var data = fetchBcraMonetarias_();
    var variable = data.results.find(function(item) {
      return Number(item.idVariable) === variableId;
    });

    if (variable) {
      return variable.valor;
    }
    throw new Error(
      "Variable con ID " + variableId + " no encontrada. IDs disponibles: " +
      data.results.map(function(item) { return item.idVariable; }).join(', ') + "."
    );
  } catch (error) {
    throw new Error("Error al consultar el BCRA: " + error.message);
  }
}

/**
 * @return {{status: number, results: Array}}
 */
function fetchBcraMonetarias_() {
  var data = fetchJson("https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias", {
    cacheKey: 'api:bcra:monetarias',
    cacheTtlSeconds: 300
  });

  if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
    throw new Error("Error en la respuesta de la API del BCRA.");
  }
  return data;
}
