// https://www.byma.com.ar/que-es-byma/derechos-membresias-2/
// https://www.byma.com.ar/wp-content/uploads/dlm_uploads/2023/10/BYMA-Derechos-Mercado-sobre-Operaciones-2023-10-11.pdf
// Proporcional al plazo de la operación hasta 90 días, sobre mayor valor
const DERECHOS_MERCADO_TASA_DIARIA = 0.045 / 100 / 90;
const GASTOS_GARANTIA_TASA_DIARIA = 0.045 / 100 / 90;
const IVA_PORCENTAJE = 21 / 100;
const ARANCEL_CAUCION_COLOCADORA_TNA = 1.5 / 100;
const ARANCEL_CAUCION_TOMADORA_TNA = 4.0 / 100;

/**
 * Calcula los costos y rendimientos de operaciones de caución colocadora.
 * En una caución colocadora, el inversor presta dinero y recibe intereses.
 *
 * @param {number} dias Días de la caución (debe ser un número positivo).
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @return {number} Importe neto de la operación.
 * @customfunction
 */
function caucionColocadora(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna
) {
  if (dias <= 0) {
    throw new Error(
      "Para caución colocadora, los días deben ser un número positivo."
    );
  }
  return calcularCaucion(-dias, tna, importeBruto, arancelCaucionColocadoraTna)
    .importeNeto;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución tomadora.
 * En una caución tomadora, el inversor toma prestado dinero y paga intereses.
 *
 * @param {number} dias Días de la caución (debe ser un número positivo).
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {number} Importe neto de la operación.
 * @customfunction
 */
function caucionTomadora(dias, tna, importeBruto, arancelCaucionTomadoraTna) {
  if (dias <= 0) {
    throw new Error(
      "Para caución tomadora, los días deben ser un número positivo."
    );
  }
  return calcularCaucion(
    dias,
    tna,
    importeBruto,
    undefined,
    arancelCaucionTomadoraTna
  ).importeNeto;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución (repo) en el mercado argentino.
 *
 * @param {number} dias Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora.
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {Object} Un objeto con todos los valores calculados de la operación.
 * @customfunction
 */
function caucion(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  const calculoCaucion = calcularCaucion(
    dias,
    tna,
    importeBruto,
    arancelCaucionColocadoraTna,
    arancelCaucionTomadoraTna
  );
  return calculoCaucion.importeNeto;
}

/**
 * Calcula la tasa efectiva para el período de la operación.
 *
 * @param {number} tna - Tasa nominal anual (TNA) de la operación.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Tasa efectiva para el período.
 */
function calcularTasaEfectiva(tna, diasAbs) {
  return Math.abs((tna * diasAbs) / 365);
}

/**
 * Calcula el interés bruto de la operación.
 *
 * @param {number} importeBruto - Monto bruto de la operación.
 * @param {number} tasa - Tasa efectiva para el período.
 * @returns {number} Interés bruto calculado.
 */
function calcularInteres(importeBruto, tasa) {
  return importeBruto * tasa;
}

/**
 * Calcula el arancel (comisión) de la operación.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} arancelTna - Tasa nominal anual del arancel.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Monto del arancel.
 */
function calcularArancel(importeConInteres, arancelTna, diasAbs) {
  return importeConInteres * ((arancelTna * diasAbs) / 365);
}

/**
 * Calcula los derechos de mercado de la operación.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @returns {number} Monto de derechos de mercado.
 */
function calcularDerechosMercado(importeConInteres, diasAbs) {
  return importeConInteres * DERECHOS_MERCADO_TASA_DIARIA * diasAbs;
}

/**
 * Calcula los gastos de garantía de la operación.
 * Solo aplica para cauciones tomadoras.
 *
 * @param {number} importeConInteres - Monto bruto más intereses.
 * @param {number} diasAbs - Cantidad de días absolutos de la operación.
 * @param {boolean} esColocadora - Indica si es una caución colocadora.
 * @returns {number} Monto de gastos de garantía.
 */
function calcularGastosGarantia(importeConInteres, diasAbs, esColocadora) {
  return esColocadora
    ? 0
    : importeConInteres * GASTOS_GARANTIA_TASA_DIARIA * diasAbs;
}

/**
 * Calcula el IVA.
 *
 * @param {number} total - Total sin IVA.
 * @returns {number} Import calculado de IVA.
 */
function calcularIva(total) {
  const iva = total * IVA_PORCENTAJE;
  return iva;
}

/**
 * Calcula los costos y rendimientos de operaciones de caución (repo) en el mercado argentino.
 *
 * @param {number} dias Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora.
 * @param {number} tna Tasa nominal anual (TNA) de la operación.
 * @param {number} importeBruto Monto bruto de la operación.
 * @param {number} [arancelCaucionColocadoraTna] [Opcional] Tasa de arancel para caución colocadora. Si no se proporciona, se usa el valor por defecto (1.5% por defecto para colocadora).
 * @param {number} [arancelCaucionTomadoraTna] [Opcional] Tasa de arancel para caución tomadora. Si no se proporciona, se usa el valor por defecto (4.0% por defecto para tomadora).
 * @return {Object} Un objeto con todos los valores calculados de la operación.
 * @customfunction
 */
function calcularCaucion(
  dias,
  tna,
  importeBruto,
  arancelCaucionColocadoraTna,
  arancelCaucionTomadoraTna
) {
  // Valores por defecto para los aranceles
  arancelCaucionColocadoraTna =
    arancelCaucionColocadoraTna || ARANCEL_CAUCION_COLOCADORA_TNA;
  arancelCaucionTomadoraTna =
    arancelCaucionTomadoraTna || ARANCEL_CAUCION_TOMADORA_TNA;

  // Validación de parámetros
  if (typeof dias !== "number" || !Number.isInteger(dias)) {
    throw new Error("El parámetro 'dias' debe ser un número entero.");
  }
  if (typeof tna !== "number" || tna < 0) {
    throw new Error("El parámetro 'tna' debe ser un número positivo.");
  }
  if (typeof importeBruto !== "number" || importeBruto <= 0) {
    throw new Error("El parámetro 'importeBruto' debe ser un número positivo.");
  }

  const diasAbs = Math.abs(dias);
  const esColocadora = dias < 0;

  // Cálculos usando las nuevas funciones
  const tasa = calcularTasaEfectiva(tna, diasAbs);
  const interes = calcularInteres(importeBruto, tasa);
  const importeConInteres = importeBruto + interes;
  const arancelTna = esColocadora
    ? arancelCaucionColocadoraTna
    : arancelCaucionTomadoraTna;

  const arancel = calcularArancel(importeConInteres, arancelTna, diasAbs);
  const derechosMercado = calcularDerechosMercado(importeConInteres, diasAbs);
  const gastosGarantia = calcularGastosGarantia(
    importeConInteres,
    diasAbs,
    esColocadora
  );

  const gastos = arancel + derechosMercado + gastosGarantia;
  const ivaGastos = calcularIva(gastos);
  const totalGastos = gastos + ivaGastos;

  const [interesNeto, importeNeto] = esColocadora
    ? [interes - totalGastos, importeConInteres - totalGastos]
    : [interes + totalGastos, importeConInteres + totalGastos];

  return {
    dias,
    tna,
    importeBruto,
    tasa,
    esColocadora,
    arancelTna,
    interes,
    interesNeto,
    importeConInteres,
    arancel,
    derechosMercado,
    gastosGarantia,
    gastos,
    ivaGastos,
    totalGastos,
    importeNeto,
  };
}
