# Función Inflación

Esta función devuelve el índice de inflación mensual de Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=inflacion(fecha)
```

## Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el índice de inflación
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=inflacion()` | Índice de inflación más reciente |
| `=inflacion("2023-03-31")` | Índice de inflación para marzo de 2023 |
| `=inflacion("03/31/2023")` | Mismo resultado que el anterior |
| `=inflacion(A1)` | Índice de inflación para la fecha en la celda A1 |

## Errores comunes

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."
