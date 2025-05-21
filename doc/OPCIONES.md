# Función Opciones

Esta función devuelve información sobre las opciones que cotizan en el mercado argentino.

## Uso

En cualquier celda de la hoja, escribe:

```
=opciones("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo de la opción (ej: "ALUC1000JU", "GGALV53000S")
- El formato típico es: [TICKER][C/V][STRIKE][VENCIMIENTO]
  - C/V: C = Call, V = Put (Venta)
  - STRIKE: Precio de ejercicio
  - VENCIMIENTO: Mes de vencimiento (J = Julio, A = Agosto, S = Septiembre, etc.)

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
| `=opciones("YPFC49000J"; "c")` | Precio actual de la opción CALL de YPF con strike 490 y vencimiento en Julio |
| `=opciones("ALUC800JU"; "px_ask")` | Precio de oferta de venta de la opción CALL de Aluar con strike 800 |
| `=opciones("GGALV53000S"; "pct_change")` | Variación porcentual diaria de la opción PUT de Grupo Galicia con strike 530 y vencimiento en Septiembre |

## Función OpcionesLista

En cualquier celda de la hoja, escribe:

```
=opcionesLista()
```

Esta función devuelve una tabla con todas las opciones disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=opcionesLista()` | Tabla completa de todas las opciones con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo de opción inválido: 'xyz'. No se encontró en la lista de opciones disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."
