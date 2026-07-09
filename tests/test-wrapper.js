/*
El archivo all-in-one.js está escrito para Google Apps Script, que no utiliza el sistema de módulos de Node.js.
Este wrapper permite importar las funciones desde all-in-one.js en los tests, adaptando el código al entorno de Node.js.
*/
const fs = require('fs');
const path = require('path');

function createMemoryCache() {
  const store = new Map();
  return {
    get: (key) => (store.has(key) ? store.get(key) : null),
    put: (key, value) => {
      store.set(key, value);
    },
    remove: (key) => {
      store.delete(key);
    },
  };
}

// Cache en memoria por carga del wrapper (un Map compartido en este contexto)
const memoryCache = createMemoryCache();

const context = {
  CONSTANTS: {},
  UrlFetchApp: global.UrlFetchApp,
  Utilities: global.Utilities,
  DriveApp: global.DriveApp || {},
  Logger: global.Logger || {},
  CacheService: global.CacheService || {
    getScriptCache: () => memoryCache,
  },
  console: console
};

// Cargar el contenido del script
const scriptPath = path.join(__dirname, '../all-in-one.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

// Ejecutar el script en el contexto global
const script = new Function('context', `
  with(context) {
    ${scriptContent}
    return {
      ACCIONES,
      ACCIONESLISTA,
      BCRA,
      BCRAVARIABLES,
      BONOS,
      BONOSLISTA,
      CAUCIONCOLOCADORA,
      CAUCIONTOMADORA,
      CALCULARCAUCION,
      CEDEAR,
      CRIPTOYA,
      CRYPTO,
      DOLAR,
      DOLARHISTORICO,
      DOLARHISTORICOTODOS,
      formatearFechaISO,
      parsearFechaLocal,
      obtenerComponentesFecha,
      fetchJson,
      FCI,
      FCILISTA,
      INFLACION,
      LETRAS,
      LETRASLISTA,
      OBLIGACIONES,
      OBLIGACIONESLISTA,
      OPCIONES,
      OPCIONESLISTA,
      PLAZOFIJO,
      RENDIMIENTOS,
      RIESGOPAIS,
      USASTOCKS,
      USASTOCKSLISTA,
      UVA
    };
  }
`);

module.exports = script(context);
