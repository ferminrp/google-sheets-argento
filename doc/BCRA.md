# Función BCRA

Esta función devuelve valores de variables económicas del Banco Central de la República Argentina (BCRA).

## Uso

En cualquier celda de la hoja, escribe:

```
=bcra(id)
```

## Parámetros

**id (number):**
- ID de la variable a consultar
- Algunos IDs disponibles:
  - 1: Reservas Internacionales del BCRA (en millones de dólares)
  - 4: Tipo de Cambio Minorista (ARS / USD) - Promedio Venta
  - 5: Tipo de Cambio Mayorista (ARS / USD) - Referencia Comunicación A 3500
  - 6: Tasa de Política Monetaria (TEA %)

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bcra(1)` | Valor actual de las Reservas Internacionales del BCRA |
| `=bcra(4)` | Tipo de cambio minorista promedio |
| `=bcra(5)` | Tipo de cambio mayorista de referencia |
| `=bcra(6)` | Tasa de Política Monetaria actual |

## Errores comunes

**ID inválido**  
"ID inválido. Debe ser un número válido (1, 4, 5, 6, etc)."

**Variable no encontrada**  
"Variable con ID X no encontrada. IDs disponibles: 1, 4, 5, 6, ..."

**Error de conexión**  
"Error al consultar el BCRA: [mensaje de error detallado]"
