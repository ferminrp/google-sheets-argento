# Función Dólar Histórico

Esta función devuelve la cotización histórica de los distintos tipos de dólar en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=DOLARHISTORICO("tipo"; "fecha"; "valor")
=DOLARHISTORICOTODOS("fecha")
```

## Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: `blue`, `oficial`, `mayorista`)
- Mismos aliases que `DOLAR()`: `mep` → `bolsa`, `ccl` → `contadoconliqui`

**fecha (string):** [Opcional]
- Fecha para la cual se quiere obtener la cotización
- Formato aceptado: `YYYY-MM-DD` o `DD/MM/YYYY`
- Si se omite, usa la fecha actual (Argentina, GMT-3)

**valor (string):** [Opcional]
- Valor a devolver: `compra` o `venta`
- Por defecto: `venta`

## Cómo funciona

- `DOLARHISTORICO` consulta el endpoint filtrado de ArgentinaDatos:
  `GET /v1/cotizaciones/dolares/{casa}/{YYYY}/{MM}/{DD}`
- `DOLARHISTORICOTODOS` usa la serie completa (cacheada ~5 min) y filtra por fecha en cliente

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=DOLARHISTORICO("blue"; "2023-01-15")` | Venta del blue el 15 de enero de 2023 |
| `=DOLARHISTORICO("oficial"; "15/01/2023"; "compra")` | Compra del oficial (formato AR) |
| `=DOLARHISTORICO("mep"; "2023-01-15")` | MEP histórico |
| `=DOLARHISTORICO("mayorista")` | Venta del mayorista para hoy |
| `=DOLARHISTORICOTODOS("2023-01-15")` | Tabla con todas las casas de esa fecha |

## Errores comunes

**Tipo inválido**  
"Error: Debe especificar un tipo de dólar"

**Valor inválido**  
"Error: El valor debe ser 'compra' o 'venta'"

**Cotización no encontrada**  
"No se encontró cotización para la fecha y tipo especificados"
