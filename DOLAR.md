# Función Dólar

Esta función devuelve la cotización de los distintos tipos de dólar en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=dolar("tipo"; "operación")
```

## Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: "blue", "oficial", "mayorista")
- Tipos disponibles: blue, oficial, mayorista, y otros disponibles en la API

**operación (string):**
- Tipo de operación a consultar: "compra", "venta", "promedio"
- Por defecto: "venta"

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar("blue")` | Precio de venta del dólar blue |
| `=dolar("oficial")` | Precio de venta del dólar oficial |
| `=dolar("mayorista")` | Precio de venta del dólar mayorista |
| `=dolar("blue"; "compra")` | Precio de compra del dólar blue |
| `=dolar("oficial"; "venta")` | Precio de compra del dólar oficial |
| `=dolar("mayorista"; "promedio")` | Precio promedio del dólar mayorista |

## Errores comunes

**Tipo inválido**  
"Tipo inválido: 'xyz'. Tipos disponibles: oficial, blue, bolsa, contadoconliqui, mayorista, cripto, tarjeta."

**Operación inválida**  
"Operación inválida: 'xyz'. Usa 'compra', 'venta' o 'promedio'."
