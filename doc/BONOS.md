### Función Bonos
En cualquier celda de la hoja, escribe:

```
=bonos("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo del bono argentino (ej: "AL30", "GD30", "AE38")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bonos("AL30"; "c")` | Precio actual del bono AL30 |
| `=bonos("GD30"; "px_ask")` | Precio de oferta de venta del bono GD30 |
| `=bonos("AE38"; "pct_change")` | Variación porcentual diaria del bono AE38 |

### Función BonosLista
En cualquier celda de la hoja, escribe:

```
=bonosLista()
```

Esta función devuelve una tabla con todos los bonos argentinos disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bonosLista()` | Tabla completa de todos los bonos argentinos con sus datos actuales |