# Función Riesgo País

Esta función devuelve el valor del riesgo país de Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=riesgopais(fecha)
```

## Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el valor del riesgo país
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=riesgopais()` | Valor del riesgo país más reciente |
| `=riesgopais("2023-03-31")` | Valor del riesgo país para el 31 de marzo de 2023 |
| `=riesgopais("03/31/2023")` | Mismo resultado que el anterior |
| `=riesgopais(A1)` | Valor del riesgo país para la fecha en la celda A1 |

## Errores comunes

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."
