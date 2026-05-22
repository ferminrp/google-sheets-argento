/**
 * Utilidades de parseo de fechas para funciones de Google Sheets.
 * Evita desfases UTC y soporta formatos usados en Argentina.
 */

function esFechaValida(year, month, day) {
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return false;
  }
  var fechaUTC = new Date(Date.UTC(year, month - 1, day));
  var fechaLocal = new Date(year, month - 1, day);
  return fechaUTC.getUTCFullYear() === year &&
         (fechaUTC.getUTCMonth() + 1) === month &&
         fechaUTC.getUTCDate() === day &&
         fechaLocal.getFullYear() === year &&
         (fechaLocal.getMonth() + 1) === month &&
         fechaLocal.getDate() === day;
}

/**
 * Parsea una fecha y devuelve componentes year/month/day.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {{year: string, month: string, day: string}}
 */
function obtenerComponentesFecha(fechaInput) {
  var year;
  var month;
  var day;

  if (fechaInput instanceof Date) {
    if (isNaN(fechaInput.getTime())) {
      throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
    year = fechaInput.getFullYear();
    month = fechaInput.getMonth() + 1;
    day = fechaInput.getDate();
  } else {
    var fechaStr = fechaInput.toString().trim();
    var matchISO = fechaStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    var matchSlash = fechaStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (matchISO) {
      year = parseInt(matchISO[1], 10);
      month = parseInt(matchISO[2], 10);
      day = parseInt(matchISO[3], 10);
    } else if (matchSlash) {
      day = parseInt(matchSlash[1], 10);
      month = parseInt(matchSlash[2], 10);
      year = parseInt(matchSlash[3], 10);
    } else {
      throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  }

  if (!esFechaValida(year, month, day)) {
    throw new Error("Fecha inválida: '" + fechaInput + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
  }

  return {
    year: year.toString(),
    month: month.toString().padStart(2, '0'),
    day: day.toString().padStart(2, '0')
  };
}

/**
 * Formatea una fecha de entrada a 'YYYY-MM-DD'.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {string}
 */
function formatearFechaISO(fechaInput) {
  var componentes = obtenerComponentesFecha(fechaInput);
  return componentes.year + '-' + componentes.month + '-' + componentes.day;
}

/**
 * Crea un objeto Date en hora local para comparaciones de rango.
 *
 * @param {*} fechaInput Fecha como Date, 'YYYY-MM-DD' o 'DD/MM/YYYY'
 * @return {Date}
 */
function parsearFechaLocal(fechaInput) {
  var componentes = obtenerComponentesFecha(fechaInput);
  return new Date(
    parseInt(componentes.year, 10),
    parseInt(componentes.month, 10) - 1,
    parseInt(componentes.day, 10)
  );
}
