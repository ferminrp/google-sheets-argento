# Función UVA

Esta función devuelve el valor del índice UVA (Unidad de Valor Adquisitivo) de Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=UVA(fecha)
```

## Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el valor del índice UVA
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=UVA()` | Valor del UVA más reciente |
| `=UVA("2023-03-31")` | Valor del UVA para el 31 de marzo de 2023 |
| `=UVA("03/31/2023")` | Mismo resultado que el anterior |
| `=UVA(A1)` | Valor del UVA para la fecha en la celda A1 |

## Errores comunes

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."
