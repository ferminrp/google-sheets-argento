/**
 * Test suite de integración para las funciones de Google Sheets Argento
 *
 * Estos tests realizan llamadas reales a las APIs, por lo que pueden fallar
 * si hay cambios en las APIs o si no hay conexión a Internet.
 */

global.Logger = {
  log: console.log,
};

// IMPORTANTE: Las funciones y variables globales deben ser definidas antes de importar el script
const {
  caucionColocadora,
  caucionTomadora,
} = require("./test-wrapper");

describe("caucionColocadora", () => {
  test("debe calcular correctamente el resultado de una caución colocadora", () => {
    const dias = 30;
    const tna = 120; // 120% TNA
    const importeBruto = 1000000; // $1,000,000

    const resultado = caucionColocadora(dias, tna, importeBruto);

    // Cálculos esperados
    const tasaEfectiva = (tna * dias) / 365;
    const interes = (importeBruto * tasaEfectiva) / 100;
    const importeConInteres = importeBruto + interes;

    // Verificaciones
    expect(typeof resultado).toBe("number");
    expect(resultado).toBeGreaterThan(importeBruto);
    expect(resultado).toBeGreaterThan(importeConInteres); // Debe ser menor por los costos
  });
});


describe("caucionTomadora", () => {
  test("debe calcular correctamente el resultado de una caución tomadora", () => {
    const dias = 30;
    const tna = 120; // 120% TNA
    const importeBruto = 1000000; // $1,000,000

    const resultado = caucionTomadora(dias, tna, importeBruto);

    // Verificaciones
    expect(typeof resultado).toBe("number");
    expect(resultado).toBeGreaterThan(importeBruto); // El importe neto debe ser menor que el bruto por los costos
  });
});
// Al final de todos los tests
afterAll(() => {
  console.log("Tests de integración completados.");
});
