/**
 * Extrae un valor específico desde la tabla de Finviz para un símbolo dado.
 * Limpia el HTML y maneja errores comunes (ticker/campo vacío, campo mal escrito, HTML modificado).
 *
 * @param {string} ticker - El símbolo bursátil (ejemplo: "AAPL").
 * @param {string} campo - El nombre exacto del campo (ejemplo: "Forward P/E", "ROE", "P/E").
 * @return {string} El valor limpio o mensaje de error amigable.
 * @customfunction
 */
function obtenerDatoFinviz(ticker, campo) {
  if (!ticker || typeof ticker !== 'string' || ticker.trim() === '') {
    return "Error: El símbolo (ticker) no puede estar vacío.";
  }

  if (!campo || typeof campo !== 'string' || campo.trim() === '') {
    return "Error: El campo no puede estar vacío.";
  }

  const url = `https://finviz.com/quote.ashx?t=${encodeURIComponent(ticker.trim())}`;
  const opciones = {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    muteHttpExceptions: true
  };

  try {
    const respuesta = UrlFetchApp.fetch(url, opciones);
    const html = respuesta.getContentText();

    // Buscar <td>Campo</td><td><b>valor</b></td> (y dentro puede venir un <span>)
    const campoRegex = new RegExp(`<td[^>]*>${campo}<\\/td>\\s*<td[^>]*><b>(.*?)<\\/b>`, 'i');
    const coincidencia = html.match(campoRegex);

    if (coincidencia && coincidencia[1]) {
      let valor = coincidencia[1];

      // Eliminar cualquier etiqueta HTML que esté adentro del <b> (como <span>)
      valor = valor.replace(/<[^>]+>/g, '');

      // Convertir punto decimal a coma
      valor = valor.replace(/\./g, ',');
      return valor;
    } else {
      return `Campo no encontrado: "${campo}". Verifica que esté escrito igual que en Finviz.`;
    }
  } catch (error) {
    return `Error al obtener datos: ${error.message}`;
  }
}
