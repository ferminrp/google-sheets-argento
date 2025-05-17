/**
 * Devuelve un array con todas las variables disponibles del BCRA (Banco Central de la República Argentina).
 * Cada elemento contiene el ID de la variable y su valor actual.
 *
 * @return {Array} Un array de variables del BCRA donde cada elemento es [idVariable, valor]
 * @customfunction
 */
function bcraVariables() {
  try {
    // Fetch data from the BCRA API
    const url = "https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Check if the API response is valid
    if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
      throw new Error("Error en la respuesta de la API del BCRA.");
    }
    
    // Return the array of results
    return data.results.map(item => [item.categoria, item.idVariable, item.descripcion, item.valor, item.fecha]);
  } catch (error) {
    throw new Error(`Error al consultar el BCRA: ${error.message}`);
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
  // Validate input
  if (!id || isNaN(parseInt(id))) {
    throw new Error("ID inválido. Debe ser un número válido (1, 4, 5, 6, etc).");
  }
  
  // Convert to integer in case it's passed as a string
  const variableId = parseInt(id);
  
  try {
    // Fetch data from the BCRA API
    const url = "https://api.bcra.gob.ar/estadisticas/v3.0/Monetarias";
    const response = UrlFetchApp.fetch(url);
    const data = JSON.parse(response.getContentText());
    
    // Check if the API response is valid
    if (data.status !== 200 || !data.results || !Array.isArray(data.results)) {
      throw new Error("Error en la respuesta de la API del BCRA.");
    }
    
    // Find the variable with the specified ID
    const variable = data.results.find(item => item.idVariable === variableId);
    
    // Return the value if found, otherwise throw an error
    if (variable) {
      return variable.valor;
    } else {
      throw new Error(`Variable con ID ${variableId} no encontrada. IDs disponibles: ${data.results.map(item => item.idVariable).join(', ')}.`);
    }
  } catch (error) {
    throw new Error(`Error al consultar el BCRA: ${error.message}`);
  }
}