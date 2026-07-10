# Función ACCIONESHISTORICO

Devuelve un valor histórico OHLC de una acción que cotiza en el mercado argentino (data912).

## Uso

```
=ACCIONESHISTORICO("symbol")
=ACCIONESHISTORICO("symbol"; "fecha")
=ACCIONESHISTORICO("symbol"; "fecha"; "campo")
```

## Parámetros

**symbol (string):** requerido  
Símbolo de la acción (ej: `GGAL`, `YPFD`, `PAMP`).

**fecha (string):** opcional  
Fecha de la rueda en `YYYY-MM-DD` o `DD/MM/YYYY`.  
Si se omite, usa el **último bar** disponible de la serie.  
Si no hubo rueda ese día (finde o feriado), usa el **último día hábil ≤ fecha**.

**campo (string):** opcional — por defecto `c`

| Campo | Descripción |
|-------|-------------|
| `o` | Open (apertura) |
| `h` | High (máximo) |
| `l` | Low (mínimo) |
| `c` | Close (cierre) |
| `v` | Volumen nocional |
| `dr` | Daily return (retorno diario) |
| `sa` | Sigma anualizada |

## Cómo funciona

Consulta `GET https://data912.com/historical/stocks/{ticker}` (serie completa OHLC).  
El valor escalar resuelto se cachea en Apps Script (~6 h para fechas pasadas, ~5 min para “último”) para no re-descargar la serie en cada celda con el mismo ticker/fecha/campo.

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=ACCIONESHISTORICO("GGAL")` | Último cierre de Galicia |
| `=ACCIONESHISTORICO("GGAL"; "2024-01-15")` | Cierre del 15/01/2024 |
| `=ACCIONESHISTORICO("YPFD"; "15/01/2024"; "h")` | Máximo del día (formato AR) |
| `=ACCIONESHISTORICO("PAMP"; "2024-01-14"; "c")` | Si el 14 es domingo, devuelve el viernes previo |

## Notas

- Solo disponible para tickers con serie histórica en data912 (panel de acciones AR).
- La API no filtra por fecha: la primera consulta por ticker descarga toda la serie (puede ser grande).
- Relacionado: [`ACCIONES`](ACCIONES.md) para cotización live del panel.
