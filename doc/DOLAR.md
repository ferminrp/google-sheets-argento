# Función Dólar

Esta función devuelve la cotización de los distintos tipos de dólar en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=dolar("tipo"; "operación")
```

## Parámetros

**tipo (string):**
- Tipo de dólar a consultar
- Tipos de la API: `oficial`, `blue`, `bolsa`, `contadoconliqui`, `mayorista`, `cripto`, `tarjeta`
- **Aliases:**
  - `mep` → `bolsa`
  - `ccl`, `contado` → `contadoconliqui`

**operación (string):** [Opcional]
- Tipo de operación: `compra`, `venta`, `promedio`
- Por defecto: `venta`

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar("blue")` | Precio de venta del dólar blue |
| `=dolar("oficial"; "compra")` | Precio de compra del dólar oficial |
| `=dolar("mep"; "venta")` | MEP (alias de bolsa) |
| `=dolar("ccl"; "promedio")` | CCL (alias de contadoconliqui) |
| `=dolar("mayorista"; "promedio")` | Precio promedio del dólar mayorista |

## Notas

- Las cotizaciones se cachean ~60 segundos en Apps Script (`CacheService`) para reducir llamadas a la API cuando muchas celdas piden el mismo dato.

## Errores comunes

**Tipo inválido**  
"Tipo inválido: 'xyz'. Tipos disponibles: oficial, blue, bolsa, contadoconliqui, mayorista, cripto, tarjeta (aliases: mep→bolsa, ccl→contadoconliqui)."

**Operación inválida**  
"Operación inválida: 'xyz'. Usa 'compra', 'venta' o 'promedio'."
