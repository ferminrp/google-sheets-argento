/**
 * Fetches data from the API and returns information about Argentine treasury bills (letras).
 *
 * @param {string} symbol - The symbol of the treasury bill
 * @param {string} valor - The value to return (c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change)
 * @return The specified value for the given treasury bill
 * @customfunction
 */
function letras(symbol, valor) {
  // Validate inputs
  if (!symbol) {
    throw new Error("Símbolo no proporcionado. Debe ingresar un símbolo válido (ej: BB2Y5, BNA6D, etc).");
  }
  
  if (!valor) {
    throw new Error("Valor no proporcionado. Valores disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.");
  }
  
  // Standardize symbol and value
  symbol = symbol.toUpperCase().trim();
  valor = valor.toLowerCase().trim();
  
  // Validate valor parameter
  const validValues = ["c", "v", "q_bid", "px_bid", "px_ask", "q_ask", "q_op", "pct_change"];
  if (!validValues.includes(valor)) {
    throw new Error(`Atributo inválido: '${valor}'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change.`);
  }
  
  try {
    // Fetch data from the API
    const url = "https://data912.com/live/arg_notes";
    const response = UrlFetchApp.fetch(url);
    const letrasList = JSON.parse(response.getContentText());
    
    // Find the requested treasury bill
    const letra = letrasList.find(letra => letra.symbol === symbol);
    
    // Return the value if found, otherwise throw an error
    if (letra) {
      return letra[valor];
    } else {
      throw new Error(`Símbolo inválido: '${symbol}'. No se encontró en la lista de letras disponibles.`);
    }
  } catch (error) {
    throw new Error(`Error al consultar datos de letras: ${error.message}`);
  }
} 