# Función UVA

Esta función devuelve el valor del índice UVA (Unidad de Valor Adquisitivo) de Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=uva(fecha)
```

## Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el valor del índice UVA
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=uva()` | Valor del UVA más reciente |
| `=uva("2023-03-31")` | Valor del UVA para el 31 de marzo de 2023 |
| `=uva("03/31/2023")` | Mismo resultado que el anterior |
| `=uva(A1)` | Valor del UVA para la fecha en la celda A1 |

## Errores comunes

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."
