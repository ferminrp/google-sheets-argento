/*
El archivo all-in-one.js está escrito para Google Apps Script, que no utiliza el sistema de módulos de Node.js.
Este wrapper permite importar las funciones desde all-in-one.js en los tests, adaptando el código al entorno de Node.js.
*/
const fs = require('fs');
const path = require('path');

// Crear un contexto global para ejecutar el script
const context = {
  CONSTANTS: {},
  UrlFetchApp: global.UrlFetchApp,
  Utilities: global.Utilities,
  DriveApp: global.DriveApp || {},
  Logger: global.Logger || {},
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
      acciones,
      accionesLista,
      bcra,
      bcraVariables,
      bonos,
      bonosLista,
      caucionColocadora,
      caucionTomadora,
      cedear,
      criptoya,
      crypto,
      dolar,
      dolar_historico,
      fci,
      fciLista,
      inflacion,
      letras,
      letrasLista,
      obligaciones,
      obligacionesLista,
      opciones,
      opcionesLista,
      plazofijo,
      rendimientos,
      riesgopais,
      usa_stocks,
      usa_stocksLista,
      uva
    };
  }
`);

module.exports = script(context);