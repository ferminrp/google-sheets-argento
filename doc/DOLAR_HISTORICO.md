# Función Dólar Histórico

Esta función devuelve la cotización histórica de los distintos tipos de dólar en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=dolar_historico("tipo"; "fecha"; "valor")
```

## Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: "blue", "oficial", "mayorista")
- Tipos disponibles: blue, oficial, mayorista, y otros disponibles en la API

**fecha (string):** [Opcional]
- Fecha para la cual se quiere obtener la cotización
- Formato aceptado: "YYYY-MM-DD"
- Si se omite, usa la fecha actual

**valor (string):** [Opcional]
- Valor a devolver: "compra" o "venta"
- Por defecto: "venta"

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar_historico("blue"; "2023-01-15")` | Valor de venta del dólar blue el 15 de enero de 2023 |
| `=dolar_historico("oficial"; "2023-01-15"; "compra")` | Valor de compra del dólar oficial el 15 de enero de 2023 |
| `=dolar_historico("mayorista")` | Valor de venta del dólar mayorista para la fecha actual |
| `=dolar_historico_todos("2023-01-15")` | Tabla con todas las cotizaciones disponibles para el 15 de enero de 2023 |

## Errores comunes

**Tipo inválido**  
"Error: Debe especificar un tipo de dólar"

**Valor inválido**  
"Error: El valor debe ser 'compra' o 'venta'"

**Cotización no encontrada**  
"No se encontró cotización para la fecha y tipo especificados"
