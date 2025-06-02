# Función CriptoYa

Esta función devuelve y compara precios de criptomonedas en diferentes exchanges argentinos e internacionales.

## Uso

En cualquier celda de la hoja, escribe:

```
=criptoya("coin"; "fiat"; volumen; "exchange"; "operacion")
```

## Parámetros

**coin (string):**
- Criptomoneda a consultar (ej: "BTC", "ETH", "DAI", "USDT")
- [Lista completa](https://criptoya.com/api) incluye: BTC, ETH, USDT, USDC, DAI, UXD, USDP, WLD, BNB, SOL, XRP, ADA, AVAX, DOGE, etc.

**fiat (string):**
- Moneda contra la que se opera (ej: "ARS", "USD", "EUR")
- [Lista completa](https://criptoya.com/api) incluye: ARS, USD, EUR, BRL, CLP, COP, MXN, PEN, VES, etc.

**volumen (number):** [Opcional]
- Volumen a operar (utiliza el punto como separador decimal)
- Por defecto: 1

**exchange (string):** [Opcional]
- Exchange específico a consultar (ej: "binance", "ripio", "letsbit")
- Si se omite, devuelve el mejor precio entre todos los exchanges

**operacion (string):** [Opcional]
- Tipo de operación a consultar:
  - "compra" - Precio de compra sin comisiones (campo "ask")
  - "totalCompra" - Precio de compra con comisiones (campo "totalAsk")
  - "venta" - Precio de venta sin comisiones (campo "bid")
  - "totalVenta" - Precio de venta con comisiones (campo "totalBid")
- Por defecto: "totalCompra"

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=criptoya("BTC"; "ARS")` | Mejor precio de compra de Bitcoin en pesos argentinos |
| `=criptoya("ETH"; "USD"; 0.5; "binance"; "venta")` | Precio de venta de 0.5 ETH en USD en Binance |
| `=criptoya("DAI"; "ARS"; 100; ; "totalVenta")` | Mejor precio de venta (con comisiones) de 100 DAI en pesos |
| `=criptoya("USDT"; "ARS"; 1000; "ripio")` | Precio de compra de 1000 USDT en pesos en Ripio |

## Errores comunes

**Par de trading no encontrado**  
"Par BTC/XYZ no encontrado. Verifica que la cripto y la moneda sean correctas."

**Exchange no disponible**  
"Exchange 'xyz' no disponible. Exchanges disponibles: binance, ripio, letsbit, ..."

**Operación inválida**  
"Operación inválida: 'xyz'. Operaciones disponibles: compra, totalCompra, venta, totalVenta."
