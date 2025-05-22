# Función Rendimientos

Esta función devuelve el APY (rendimiento anual) de diferentes criptomonedas ofrecido por proveedores en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=rendimientos("moneda"; "proveedor")
```

## Parámetros

**moneda (string):**
- Símbolo de la criptomoneda o moneda fiat (ej: "BTC", "ETH", "USDT", "ARS")

**proveedor (string):** [Opcional]
- Nombre del proveedor (ej: "buenbit", "ripio", "letsbit")
- Si se omite, devuelve el mejor rendimiento disponible entre todos los proveedores

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=rendimientos("USDT")` | Mejor rendimiento disponible para USDT entre todos los proveedores |
| `=rendimientos("BTC"; "buenbit")` | Rendimiento anual de Bitcoin en Buenbit |
| `=rendimientos("USDC"; "ripio")` | Rendimiento anual de USDC en Ripio |
| `=rendimientos("SOL"; "letsbit")` | Rendimiento anual de Solana en Letsbit |

## Errores comunes

**Moneda no encontrada**  
"Moneda 'xyz' no encontrada. Algunas monedas disponibles: BTC, ETH, USDT, USDC, DAI..."

**Proveedor no encontrado**  
"Proveedor 'xyz' no encontrado. Proveedores disponibles: buenbit, ripio, letsbit, belo, lemoncash, satoshitango, fiwind."

**Moneda no disponible en el proveedor**  
"La moneda 'xyz' no está disponible en el proveedor 'abc'."
