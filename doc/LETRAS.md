# Función Letras

Esta función devuelve información sobre las letras del tesoro que cotizan en el mercado argentino.

## Uso

En cualquier celda de la hoja, escribe:

```
=letras("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo de la letra del tesoro (ej: "BB2Y5", "BNA6D", "S31L5")

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
| `=letras("BB2Y5"; "c")` | Precio actual de la letra BB2Y5 |
| `=letras("BNA6D"; "px_ask")` | Precio de oferta de venta de la letra BNA6D |
| `=letras("S31L5"; "pct_change")` | Variación porcentual diaria de la letra S31L5 |

## Función LetrasLista

En cualquier celda de la hoja, escribe:

```
=letrasLista()
```

Esta función devuelve una tabla con todas las letras del tesoro disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=letrasLista()` | Tabla completa de todas las letras del tesoro con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de letras disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."
