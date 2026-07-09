/**
 * Test suite de integración para las funciones de Google Sheets Argento
 *
 * Estos tests realizan llamadas reales a las APIs, por lo que pueden fallar
 * si hay cambios en las APIs o si no hay conexión a Internet.
 */

global.Logger = {
  log: console.log,
};

const {
  CAUCIONCOLOCADORA,
  CAUCIONTOMADORA,
  CALCULARCAUCION,
} = require("./test-wrapper");

describe("CAUCIONCOLOCADORA", () => {
  test("debe calcular correctamente el resultado de una caución colocadora", () => {
    const dias = 30;
    const tna = 1.2; // 120% TNA (formato porcentaje de Sheets)
    const importeBruto = 1000000;

    const resultado = CAUCIONCOLOCADORA(dias, tna, importeBruto);

    const tasaEfectiva = (tna * dias) / 365;
    const interes = importeBruto * tasaEfectiva;
    const importeConInteres = importeBruto + interes;

    expect(typeof resultado).toBe("number");
    expect(resultado).toBeGreaterThan(importeBruto);
    expect(resultado).toBeLessThan(importeConInteres);
  });
});

describe("CAUCIONTOMADORA", () => {
  test("debe calcular correctamente el resultado de una caución tomadora", () => {
    const dias = 30;
    const tna = 1.2; // 120% TNA (formato porcentaje de Sheets)
    const importeBruto = 1000000;

    const resultado = CAUCIONTOMADORA(dias, tna, importeBruto);

    expect(typeof resultado).toBe("number");
    expect(resultado).toBeGreaterThan(importeBruto);
  });
});

describe("CALCULARCAUCION validación", () => {
  test("rechaza dias === 0", () => {
    expect(() => CALCULARCAUCION(0, 1.2, 1000000)).toThrow("no puede ser 0");
  });
});

describe("ACCIONES validación", () => {
  test("símbolo vacío lanza error legible", () => {
    const { ACCIONES } = require("./test-wrapper");
    expect(() => ACCIONES("", "c")).toThrow("Símbolo no proporcionado");
  });
});

afterAll(() => {
  console.log("Tests de integración completados.");
});
