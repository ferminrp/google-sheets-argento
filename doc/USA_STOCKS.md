# Función USA Stocks

Esta función devuelve información sobre las acciones que cotizan en el mercado estadounidense.

## Uso

En cualquier celda de la hoja, escribe:

```
=usa_stocks("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo de la acción estadounidense (ej: "AAPL", "MSFT", "GOOGL")

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
| `=usa_stocks("AAPL"; "c")` | Precio actual de la acción de Apple |
| `=usa_stocks("MSFT"; "px_ask")` | Precio de oferta de venta de Microsoft |
| `=usa_stocks("GOOGL"; "pct_change")` | Variación porcentual diaria de Google |

## Función USA_StocksLista

En cualquier celda de la hoja, escribe:

```
=usa_stocksLista()
```

Esta función devuelve una tabla con todas las acciones estadounidenses disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=usa_stocksLista()` | Tabla completa de todas las acciones estadounidenses con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de acciones estadounidenses disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."
