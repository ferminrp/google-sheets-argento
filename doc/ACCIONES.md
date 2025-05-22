# Función Acciones

Esta función devuelve información sobre las acciones que cotizan en el mercado argentino.

## Uso

En cualquier celda de la hoja, escribe:

```
=acciones("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo de la acción argentina (ej: "GGAL", "YPF", "PAMP")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

## Función AccionesLista

En cualquier celda de la hoja, escribe:

```
=accionesLista()
```

Esta función devuelve una tabla con todas las acciones argentinas disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=accionesLista()` | Tabla completa de todas las acciones argentinas con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de acciones disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."
