# Función BONOSHISTORICO

Devuelve un valor histórico OHLC de un bono argentino (data912).

## Uso

```
=BONOSHISTORICO("symbol")
=BONOSHISTORICO("symbol"; "fecha")
=BONOSHISTORICO("symbol"; "fecha"; "campo")
```

## Parámetros

**symbol (string):** requerido  
Símbolo del bono (ej: `AL30`, `GD30`, `AE38`).

**fecha (string):** opcional  
`YYYY-MM-DD` o `DD/MM/YYYY`. Sin fecha → último bar.  
Sin rueda ese día → último día hábil ≤ fecha.

**campo (string):** opcional — por defecto `c`  
Valores: `o`, `h`, `l`, `c`, `v`, `dr`, `sa` (ver [ACCIONESHISTORICO](ACCIONES_HISTORICO.md)).

## Cómo funciona

Consulta `GET https://data912.com/historical/bonds/{ticker}`.  
Cache de valor escalar igual que en acciones históricas.

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=BONOSHISTORICO("AL30")` | Último cierre de AL30 |
| `=BONOSHISTORICO("AL30"; "2024-06-01")` | Cierre del 1/06/2024 |
| `=BONOSHISTORICO("GD30"; "01/06/2024"; "dr")` | Retorno diario ese día |

## Notas

- Relacionado: [`BONOS`](BONOS.md) para panel live.
- No hay históricos data912 para letras, ONs u opciones en esta versión.
