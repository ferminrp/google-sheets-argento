# Función Dólar Histórico

Esta función devuelve la cotización histórica de los distintos tipos de dólar en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=dolar_historico("tipo"; "fecha"; "valor")
=dolar_historico_todos("fecha")
```

## Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: `blue`, `oficial`, `mayorista`)
- Mismos aliases que `dolar()`: `mep` → `bolsa`, `ccl` → `contadoconliqui`

**fecha (string):** [Opcional]
- Fecha para la cual se quiere obtener la cotización
- Formato aceptado: `YYYY-MM-DD` o `DD/MM/YYYY`
- Si se omite, usa la fecha actual (Argentina, GMT-3)

**valor (string):** [Opcional]
- Valor a devolver: `compra` o `venta`
- Por defecto: `venta`

## Cómo funciona

- `dolar_historico` consulta el endpoint filtrado de ArgentinaDatos:
  `GET /v1/cotizaciones/dolares/{casa}/{YYYY}/{MM}/{DD}`
- `dolar_historico_todos` usa la serie completa (cacheada ~5 min) y filtra por fecha en cliente

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar_historico("blue"; "2023-01-15")` | Venta del blue el 15 de enero de 2023 |
| `=dolar_historico("oficial"; "15/01/2023"; "compra")` | Compra del oficial (formato AR) |
| `=dolar_historico("mep"; "2023-01-15")` | MEP histórico |
| `=dolar_historico("mayorista")` | Venta del mayorista para hoy |
| `=dolar_historico_todos("2023-01-15")` | Tabla con todas las casas de esa fecha |

## Errores comunes

**Tipo inválido**  
"Error: Debe especificar un tipo de dólar"

**Valor inválido**  
"Error: El valor debe ser 'compra' o 'venta'"

**Cotización no encontrada**  
"No se encontró cotización para la fecha y tipo especificados"
