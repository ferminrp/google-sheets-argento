# Función OBLIGACIONES

Esta función devuelve información sobre las obligaciones negociables que cotizan en el mercado argentino.

## Uso

En cualquier celda de la hoja, escribe:

```
=OBLIGACIONES("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo de la obligación negociable (ej: "AEC1D", "YMCHO", "BYCNO")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=OBLIGACIONES("AEC1D"; "c")` | Precio actual de la obligación negociable AEC1D |
| `=OBLIGACIONES("YMCHO"; "px_ask")` | Precio de oferta de venta de la obligación negociable YMCHO |
| `=OBLIGACIONES("BYCNO"; "pct_change")` | Variación porcentual diaria de la obligación negociable BYCNO |

## Función OBLIGACIONESLISTA

En cualquier celda de la hoja, escribe:

```
=OBLIGACIONESLISTA()
```

Esta función devuelve una tabla con todas las obligaciones negociables disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=OBLIGACIONESLISTA()` | Tabla completa de todas las obligaciones negociables con sus datos actuales |
