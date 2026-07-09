/**
 * Obtiene información de Fondos Comunes de Inversión (FCI) de Argentina.
 *
 * @param {string} tipoFondo El tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta", "retornoTotal"
 * @param {string} nombreFondo El nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")
 * @param {string} fecha [Opcional] Fecha en formato 'YYYY-MM-DD' o 'DD/MM/YYYY'. Si no se proporciona, devuelve la información más reciente.
 * @param {string} campo [Opcional] Campo a consultar: "vcp" (valor cuotaparte), "ccp" (cantidad cuotapartes), "patrimonio". Por defecto: "vcp".
 * @return El valor solicitado para el fondo especificado.
 * @customfunction
 */
function fci(tipoFondo, nombreFondo, fecha, campo) {
  var tipo = tipoFondo ? tipoFondo.toString().toLowerCase().trim() : '';
  var nombre = nombreFondo ? nombreFondo.toString().trim() : '';
  var campoDatos = campo ? campo.toString().toLowerCase().trim() : 'vcp';

  var tipoNormalizado = tipo.replace(/\s+/g, '').replace(/[óo]/g, 'o');
  var tiposPermitidos = ['mercadodinero', 'rentavariable', 'rentafija', 'rentamixta', 'retornototal'];
  if (!tiposPermitidos.includes(tipoNormalizado)) {
    throw new Error("Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta, retornoTotal.");
  }

  var tipoAPI = tipoNormalizado;
  switch (tipoAPI) {
    case 'mercadodinero': tipoAPI = 'mercadoDinero'; break;
    case 'rentavariable': tipoAPI = 'rentaVariable'; break;
    case 'rentafija': tipoAPI = 'rentaFija'; break;
    case 'rentamixta': tipoAPI = 'rentaMixta'; break;
    case 'retornototal': tipoAPI = 'retornoTotal'; break;
  }

  var camposPermitidos = ['vcp', 'ccp', 'patrimonio'];
  if (!camposPermitidos.includes(campoDatos)) {
    throw new Error("Campo inválido. Campos permitidos: vcp (valor cuotaparte), ccp (cantidad cuotapartes), patrimonio.");
  }

  if (!nombre) {
    throw new Error("Debe especificar un nombre de fondo.");
  }

  var url;
  var cacheKey = null;
  if (fecha) {
    try {
      var componentesFecha = obtenerComponentesFecha(fecha);
      url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/' + componentesFecha.year + '/' + componentesFecha.month + '/' + componentesFecha.day + '/';
    } catch (e) {
      throw new Error("Fecha inválida: '" + fecha + "'. Usar formato 'YYYY-MM-DD' o 'DD/MM/YYYY'.");
    }
  } else {
    url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipoAPI + '/ultimo';
    cacheKey = 'api:ad:fci:' + tipoAPI + ':ultimo';
  }

  try {
    var datos = fetchJson(url, cacheKey ? {
      cacheKey: cacheKey,
      cacheTtlSeconds: 120
    } : { skipCache: true });

    function esFondoValido(item) {
      return item.fondo && !item.fondo.startsWith("Region:") &&
          !item.fondo.startsWith("Duration:") &&
          !item.fondo.startsWith("Benchmark:") &&
          !item.fondo.startsWith("Moneda:");
    }

    function valorCampoFondo(item) {
      var valor = item[campoDatos];
      if (valor === null || valor === undefined) {
        throw new Error("El fondo '" + item.fondo + "' no tiene valor para el campo '" + campo + "'.");
      }
      return valor;
    }

    var nombreLower = nombre.toLowerCase();
    var coincidenciasExactas = [];
    var coincidenciasExactasCI = [];
    var coincidenciasParciales = [];
    var coincidenciasParcialesCI = [];

    for (var i = 0; i < datos.length; i++) {
      if (!esFondoValido(datos[i])) continue;
      var fondoNombre = datos[i].fondo;
      var fondoLower = fondoNombre.toLowerCase();

      if (fondoNombre === nombre) {
        coincidenciasExactas.push(datos[i]);
      } else if (fondoLower === nombreLower) {
        coincidenciasExactasCI.push(datos[i]);
      } else if (fondoNombre.includes(nombre)) {
        coincidenciasParciales.push(datos[i]);
      } else if (fondoLower.includes(nombreLower)) {
        coincidenciasParcialesCI.push(datos[i]);
      }
    }

    function resolverCoincidencias(lista) {
      if (lista.length === 1) return valorCampoFondo(lista[0]);
      if (lista.length > 1) {
        throw new Error("Varios fondos coinciden con '" + nombre + "': " + lista.slice(0, 10).map(function(f) { return f.fondo; }).join(', ') + (lista.length > 10 ? "..." : "."));
      }
      return null;
    }

    var r = resolverCoincidencias(coincidenciasExactas);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasExactasCI);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasParciales);
    if (r !== null) return r;
    r = resolverCoincidencias(coincidenciasParcialesCI);
    if (r !== null) return r;

    var fondosDisponibles = datos
      .filter(esFondoValido)
      .map(function(d) { return d.fondo; })
      .slice(0, 10)
      .join(", ") + "...";

    throw new Error("Fondo '" + nombre + "' no encontrado para el tipo '" + tipoFondo + "'. Algunos fondos disponibles: " + fondosDisponibles);
  } catch (e) {
    if (e.message.includes("Error HTTP") || e.message.includes("Error al consultar")) {
      throw e;
    }
    throw new Error("Error al consultar información de '" + tipoFondo + "': " + e.message);
  }
}

/**
 * Obtiene la lista completa de Fondos Comunes de Inversión (FCI) disponibles en Argentina.
 *
 * @return {Array} Una matriz con todos los fondos disponibles, incluyendo el nombre, tipo y valor de cuotaparte.
 * @customfunction
 */
function fciLista() {
  var tipos = ['mercadoDinero', 'rentaVariable', 'rentaFija', 'rentaMixta', 'retornoTotal'];
  var todosLosFondos = [['Nombre del Fondo', 'Tipo de Fondo', 'Valor Cuotaparte']];

  tipos.forEach(function(tipo) {
    try {
      var url = 'https://api.argentinadatos.com/v1/finanzas/fci/' + tipo + '/ultimo';
      var datos = fetchJson(url, {
        cacheKey: 'api:ad:fci:' + tipo + ':ultimo',
        cacheTtlSeconds: 120
      });

      var fondosValidos = datos.filter(function(d) {
        return d.fondo &&
               !d.fondo.startsWith("Region:") &&
               !d.fondo.startsWith("Duration:") &&
               !d.fondo.startsWith("Benchmark:") &&
               !d.fondo.startsWith("Moneda:");
      });

      fondosValidos.forEach(function(fondo) {
        var nombreFormateado = tipo;
        switch (tipo) {
          case 'mercadoDinero': nombreFormateado = 'Mercado de Dinero'; break;
          case 'rentaVariable': nombreFormateado = 'Renta Variable'; break;
          case 'rentaFija': nombreFormateado = 'Renta Fija'; break;
          case 'rentaMixta': nombreFormateado = 'Renta Mixta'; break;
          case 'retornoTotal': nombreFormateado = 'Retorno Total'; break;
        }

        todosLosFondos.push([
          fondo.fondo,
          nombreFormateado,
          fondo.vcp
        ]);
      });
    } catch (e) {
      Logger.log("Error al consultar fondos de tipo '" + tipo + "': " + e.message);
    }
  });

  return todosLosFondos;
}
