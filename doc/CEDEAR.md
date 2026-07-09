# Función CEDEAR

Esta función devuelve información sobre los CEDEARs (Certificados de Depósito Argentinos) que cotizan en Argentina.

## Archivo JSON de CEDEARs

El proyecto incluye un archivo `data/cedears.json` que contiene información útil sobre todos los CEDEARs disponibles en el mercado argentino. Este archivo puede ser utilizado como referencia o para importar en tus propias aplicaciones.

### API pública (GitHub Pages)

Para agentes y scripts, preferí el endpoint estático de la página del proyecto (incluye metadata y el listado completo):

```
https://ferminrp.github.io/google-sheets-argento/api/cedears.json
```

El array plano del repo sigue en [`data/cedears.json`](../data/cedears.json).  
`npm run build` publica la versión de Pages en `docs/api/cedears.json`.

Cada entrada del listado contiene:
- **Cedears**: Símbolo/ticker del CEDEAR
- **Name**: Nombre completo de la empresa
- **Market**: Mercado donde cotiza el instrumento subyacente (ej. NYSE, NASDAQ, B3)
- **Ratio**: Ratio de conversión entre el CEDEAR y la acción subyacente (string)

### Formatos de `ratio`

La función `=CEDEAR(symbol; "ratio")` devuelve el string del JSON **sin transformarlo**:

| Formato | Ejemplo | Significado habitual |
|--------|---------|----------------------|
| Número como string | `"20"` | 20 CEDEARs = 1 acción subyacente (ej. AAPL) |
| Razón `A:B` | `"1:3"` | Ratio 1 a 3 (presente en ~16 tickers del listado) |

Si necesitás operar matemáticamente, parseá el string en la hoja (por ejemplo con `SPLIT` / `VALUE`) según el formato del ticker.


## Uso

En cualquier celda de la hoja, escribe:

```
=CEDEAR("symbol"; "valor")
```

## Parámetros

**symbol (string):**
- Símbolo del CEDEAR (ej: "AAPL", "MSFT", "GOOGL")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria
- "name" - Nombre completo de la empresa
- "ratio" - Ratio de conversión entre el CEDEAR y la acción subyacente
- "market" - Mercado donde cotiza el subyacente (ej. NYSE, NASDAQ, B3)

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=CEDEAR("AAPL"; "c")` | Precio actual del CEDEAR de Apple |
| `=CEDEAR("MSFT"; "px_ask")` | Precio de oferta de venta del CEDEAR de Microsoft |
| `=CEDEAR("GOOGL"; "pct_change")` | Variación porcentual diaria del CEDEAR de Google |
| `=CEDEAR("TSLA"; "name")` | Nombre completo de la empresa Tesla |
| `=CEDEAR("AMZN"; "ratio")` | Ratio de conversión del CEDEAR de Amazon |
| `=CEDEAR("AAPL"; "market")` | Mercado donde cotiza Apple (NASDAQ) |

## Función CedearLista

En cualquier celda de la hoja, escribe:

```
=CEDEARLISTA()
```

Esta función devuelve una tabla con todos los CEDEARs disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=CEDEARLISTA()` | Tabla completa de todos los CEDEARs con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de CEDEARs disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change, name, ratio, market."
