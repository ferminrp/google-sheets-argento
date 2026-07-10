# Función CEDEARHISTORICO

Devuelve un valor histórico OHLC de un CEDEAR (data912).

## Uso

```
=CEDEARHISTORICO("symbol")
=CEDEARHISTORICO("symbol"; "fecha")
=CEDEARHISTORICO("symbol"; "fecha"; "campo")
```

## Parámetros

**symbol (string):** requerido  
Símbolo del CEDEAR (ej: `AAPL`, `MSFT`, `MELI`).

**fecha (string):** opcional  
`YYYY-MM-DD` o `DD/MM/YYYY`. Sin fecha → último bar.  
Sin rueda ese día → último día hábil ≤ fecha.

**campo (string):** opcional — por defecto `c`  
Valores: `o`, `h`, `l`, `c`, `v`, `dr`, `sa` (ver [ACCIONESHISTORICO](ACCIONES_HISTORICO.md)).

## Cómo funciona

Consulta `GET https://data912.com/historical/cedears/{ticker}`.  
Cache de valor escalar igual que en acciones históricas.

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=CEDEARHISTORICO("AAPL")` | Último cierre del CEDEAR de Apple |
| `=CEDEARHISTORICO("AAPL"; "2024-01-15"; "c")` | Cierre del 15/01/2024 |
| `=CEDEARHISTORICO("MELI"; "15/01/2024"; "v")` | Volumen ese día |

## Notas

- Relacionado: [`CEDEAR`](CEDEAR.md) para panel live, ratio y market.
