# Función CEDEAR

Esta función devuelve información sobre los CEDEARs (Certificados de Depósito Argentinos) que cotizan en Argentina.

## Archivo JSON de CEDEARs

El proyecto incluye un archivo `data/cedears.json` que contiene información útil sobre todos los CEDEARs disponibles en el mercado argentino. Este archivo puede ser utilizado como referencia o para importar en tus propias aplicaciones.

Cada entrada del archivo contiene:
- **Cedears**: Símbolo/ticker del CEDEAR
- **Name**: Nombre completo de la empresa
- **Ratio**: Ratio de conversión entre el CEDEAR y la acción subyacente

Ejemplo de uso:
```json
{
  "Cedears": "AAPL",
  "Name": "Apple Inc",
  "Ratio": "20"
}
```

## Uso

En cualquier celda de la hoja, escribe:

```
=cedear("symbol"; "valor")
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

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=cedear("AAPL"; "c")` | Precio actual del CEDEAR de Apple |
| `=cedear("MSFT"; "px_ask")` | Precio de oferta de venta del CEDEAR de Microsoft |
| `=cedear("GOOGL"; "pct_change")` | Variación porcentual diaria del CEDEAR de Google |
| `=cedear("TSLA"; "name")` | Nombre completo de la empresa Tesla |
| `=cedear("AMZN"; "ratio")` | Ratio de conversión del CEDEAR de Amazon |

## Función CedearLista

En cualquier celda de la hoja, escribe:

```
=cedearLista()
```

Esta función devuelve una tabla con todos los CEDEARs disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=cedearLista()` | Tabla completa de todos los CEDEARs con sus datos actuales |

## Errores comunes

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de CEDEARs disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."
