# Función Crypto

Esta función devuelve el precio actual de criptomonedas desde Coinbase.

## Uso

En cualquier celda de la hoja, escribe:

```
=CRYPTO("symbol"; "moneda")
```

## Parámetros

**symbol (string):**
- Símbolo de la criptomoneda (ej: "BTC", "ETH", "SOL")

**moneda (string):** [Opcional]
- Moneda en la que se quiere obtener el precio (ej: "USD", "EUR")
- Por defecto: "USD"

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=CRYPTO("BTC")` | Precio actual de Bitcoin en USD |
| `=CRYPTO("ETH"; "EUR")` | Precio actual de Ethereum en euros |
| `=CRYPTO("SOL"; "USD")` | Precio actual de Solana en USD |
| `=CRYPTO("MATIC"; "ARS")` | Precio actual de Polygon en pesos argentinos |

## Errores comunes

**Par de trading no encontrado**  
"Par de trading no encontrado: 'XYZ-USD'. Verifica que el símbolo y la moneda sean correctos."

**Error de conexión**  
"Error al consultar el precio de XYZ: [mensaje de error detallado]"
