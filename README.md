# Google Sheets Argento
Scripts de Apps Script que añaden a tu Google Sheet funciones tipicas para el dia a dia de un Argentino de bien.

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_1.svg)](https://cafecito.app/ferminrp)

## Indice

1. **[Funciones](#funciones)** <details><summary>(expandir)</summary>
	- [Información de Opciones Argentinas](#información-de-opciones-argentinas)
	- [Información de Obligaciones Negociables](#información-de-obligaciones-negociables)
	- [Índices de Inflación](#índices-de-inflación)
	- [Cotizaciones del dolar](#cotizaciones-del-dolar)
	- [Cotizaciones históricas del dólar](#cotizaciones-históricas-del-dólar)
	- [Información de CEDEARs](#información-de-cedears)
	- [Archivo JSON de CEDEARs](#archivo-json-de-cedears)
	- [Información de Acciones Argentinas](#información-de-acciones-argentinas)
	- [Información de Acciones de EE.UU.](#información-de-acciones-de-eeuu)
	- [Información de Bonos Argentinos](#información-de-bonos-argentinos)
	- [Información de Letras del Tesoro](#información-de-letras-del-tesoro)
	- [Información de Opciones Argentinas](#información-de-opciones-argentinas)
	- [Índices de Inflación](#índices-de-inflación)
	- [Precios de Criptomonedas](#precios-de-criptomonedas)
	- [Índices UVA](#índices-uva)
	- [Riesgo País](#riesgo-país)
	- [Rendimientos de Criptomonedas](#rendimientos-de-criptomonedas)
	- [Tasas de Plazos Fijos](#tasas-de-plazos-fijos)
	- [Fondos Comunes de Inversión](#fondos-comunes-de-inversión)
	- [Comparador de Precios de Criptomonedas (CriptoYa)](#comparador-de-precios-de-criptomonedas-criptoya)
	- [Variables del Banco Central](#variables-del-banco-central)
	- [Cauciones](#cauciones)
	- [Función AccionesLista](#función-accioneslista)
	- [Función Bonos](#función-bonos)
	- [Función BonosLista](#función-bonoslista)
	- [Función Letras](#función-letras)
	- [Función LetrasLista](#función-letraslista)
	- [Función Opciones](#función-opciones)
	- [Función OpcionesLista](#función-opcioneslista)
	- [Función CEDEAR](#función-cedear)
	- [Función CedearLista](#función-cedearlista)
	- [Función USA Stocks](#función-usa-stocks)
	- [Función USA_StocksLista](#función-usa_stockslista)
	- [Información de Obligaciones Negociables](#información-de-obligaciones-negociables)
	- [Función Obligaciones](#función-obligaciones)
	- [Función ObligacionesLista](#función-obligacioneslista)
	- [Función Inflación](#función-inflación)
	- [Función Crypto](#función-crypto)
	- [Función UVA](#función-uva)
	- [Función Riesgo País](#función-riesgo-país)
	- [Función Rendimientos](#función-rendimientos)
	- [Función CriptoYa](#función-criptoya)
	- [Función Plazo Fijo](#función-plazo-fijo)
	- [Función FCI](#función-fci)
	- [Función BCRA](#función-bcra)
	- [Función Caución](#función-caución)
	- [Función Dólar Histórico](#función-dólar-histórico)
	- [Función Dólar](#función-dólar)
	- [Errores de la función Dólar Histórico](#errores-de-la-función-dólar-histórico)
	- [Errores de la función Dólar](#errores-de-la-función-dólar)</details>
1. **[Actualización automática](#-actualización-automática)**
1. **[Errores comunes](#%EF%B8%8F-errores-comunes)**
1. **[Agradecimientos](#-agradecimientos)**
1. **[Archivos principales](#archivos-principales)**


## Funciones

### Información de Opciones Argentinas
Devuelve información sobre las opciones que cotizan en el mercado argentino.

```
=opciones("symbol"; "valor")
```

### Información de Obligaciones Negociables
Devuelve información sobre las obligaciones negociables que cotizan en el mercado argentino.

```
=obligaciones("symbol"; "valor")
```

### Índices de Inflación
Devuelve el índice de inflación mensual de Argentina.

```
=inflacion(fecha)
```

### Cotizaciones del dolar
Devuelve la cotización de los distintos tipos de dólar en Argentina.

```
=dolar("tipo"; "operación")
```

### Cotizaciones históricas del dólar
Devuelve la cotización histórica de los distintos tipos de dólar en Argentina.

```
=dolar_historico("tipo"; "fecha"; "valor")
```

### Información de CEDEARs
Devuelve información sobre los CEDEARs (Certificados de Depósito Argentinos) que cotizan en Argentina.

```
=cedear("symbol"; "valor")
```

### Archivo JSON de CEDEARs
El proyecto incluye un archivo `data/cedears.json` que contiene información útil sobre todos los CEDEARs disponibles en el mercado argentino. Este archivo puede ser utilizado como referencia o para importar en tus propias aplicaciones.

Cada entrada del archivo contiene:
- **Cedears**: Símbolo/ticker del CEDEAR
- **Name**: Nombre completo de la empresa
- **Ratio**: Ratio de conversión entre el CEDEAR y la acción subyacente

Ejemplo de uso:
```json
{
  "Cedears": "AAPL",
  "Name": "Apple Inc",
  "Ratio": "20"
}
```

### Información de Acciones Argentinas
Devuelve información sobre las acciones que cotizan en el mercado argentino.

```
=acciones("symbol"; "valor")
```

### Información de Acciones de EE.UU.
Devuelve información sobre las acciones que cotizan en el mercado estadounidense.

```
=usa_stocks("symbol"; "valor")
```

### Información de Bonos Argentinos
Devuelve información sobre los bonos que cotizan en el mercado argentino.

```
=bonos("symbol"; "valor")
```

### Información de Letras del Tesoro
Devuelve información sobre las letras del tesoro que cotizan en el mercado argentino.

```
=letras("symbol"; "valor")
```

### Información de Opciones Argentinas
Devuelve información sobre las opciones que cotizan en el mercado argentino.

```
=opciones("symbol"; "valor")
```

### Índices de Inflación
Devuelve el índice de inflación mensual de Argentina.

```
=inflacion(fecha)
```

### Precios de Criptomonedas
Devuelve el precio actual de criptomonedas desde Coinbase.

```
=crypto("symbol"; "moneda")
```

### Índices UVA
Devuelve el valor del índice UVA (Unidad de Valor Adquisitivo) de Argentina.

```
=uva(fecha)
```

### Riesgo País
Devuelve el valor del riesgo país de Argentina.

```
=riesgopais(fecha)
```

### Rendimientos de Criptomonedas
Devuelve el APY (rendimiento anual) de diferentes criptomonedas ofrecido por proveedores en Argentina.

```
=rendimientos("moneda"; "proveedor")
```

### Tasas de Plazos Fijos
Devuelve las tasas de plazos fijos (TNA) ofrecidas por bancos en Argentina.

```
=plazofijo("banco"; "tipoCliente")
```

### Fondos Comunes de Inversión
Devuelve información sobre Fondos Comunes de Inversión (FCI) en Argentina.

```
=fci("tipoFondo"; "nombreFondo"; "fecha"; "campo")
```

### Comparador de Precios de Criptomonedas (CriptoYa)
Devuelve y compara precios de criptomonedas en diferentes exchanges argentinos e internacionales.

```
=criptoya("coin"; "fiat"; volumen; "exchange"; "operacion")
```

### Variables del Banco Central
Devuelve valores de variables económicas del Banco Central de la República Argentina (BCRA).

```
=bcra(id)
```

### Cauciones
Devuelve información sobre operaciones de caución (colocadora y tomadora) en el mercado argentino.

```
=caucion(dias, tna, importeBruto[, arancelCaucionColocadoraTna][, arancelCaucionTomadoraTna])
=caucionColocadora(dias, tna, importeBruto[, arancelCaucionColocadoraTna])
=caucionTomadora(dias, tna, importeBruto[, arancelCaucionTomadoraTna])
```

### Función AccionesLista
En cualquier celda de la hoja, escribe:

```
=accionesLista()
```

Esta función devuelve una tabla con todas las acciones argentinas disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=accionesLista()` | Tabla completa de todas las acciones argentinas con sus datos actuales |

### Función Bonos
En cualquier celda de la hoja, escribe:

```
=bonos("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo del bono argentino (ej: "AL30", "GD30", "AE38")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bonos("AL30"; "c")` | Precio actual del bono AL30 |
| `=bonos("GD30"; "px_ask")` | Precio de oferta de venta del bono GD30 |
| `=bonos("AE38"; "pct_change")` | Variación porcentual diaria del bono AE38 |

### Función BonosLista
En cualquier celda de la hoja, escribe:

```
=bonosLista()
```

Esta función devuelve una tabla con todos los bonos argentinos disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bonosLista()` | Tabla completa de todos los bonos argentinos con sus datos actuales |

### Función Letras
En cualquier celda de la hoja, escribe:

```
=letras("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo de la letra del tesoro (ej: "BB2Y5", "BNA6D", "S31L5")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=letras("BB2Y5"; "c")` | Precio actual de la letra BB2Y5 |
| `=letras("BNA6D"; "px_ask")` | Precio de oferta de venta de la letra BNA6D |
| `=letras("S31L5"; "pct_change")` | Variación porcentual diaria de la letra S31L5 |

### Función LetrasLista
En cualquier celda de la hoja, escribe:

```
=letrasLista()
```

Esta función devuelve una tabla con todas las letras del tesoro disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=letrasLista()` | Tabla completa de todas las letras del tesoro con sus datos actuales |

### Función Opciones
En cualquier celda de la hoja, escribe:

```
=opciones("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo de la opción (ej: "ALUC1000JU", "GGALV53000S")
- El formato típico es: [TICKER][C/V][STRIKE][VENCIMIENTO]
  - C/V: C = Call, V = Put (Venta)
  - STRIKE: Precio de ejercicio
  - VENCIMIENTO: Mes de vencimiento (J = Julio, A = Agosto, S = Septiembre, etc.)

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=opciones("YPFC49000J"; "c")` | Precio actual de la opción CALL de YPF con strike 490 y vencimiento en Julio |
| `=opciones("ALUC800JU"; "px_ask")` | Precio de oferta de venta de la opción CALL de Aluar con strike 800 |
| `=opciones("GGALV53000S"; "pct_change")` | Variación porcentual diaria de la opción PUT de Grupo Galicia con strike 530 y vencimiento en Septiembre |

### Función OpcionesLista
En cualquier celda de la hoja, escribe:

```
=opcionesLista()
```

Esta función devuelve una tabla con todas las opciones disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=opcionesLista()` | Tabla completa de todas las opciones con sus datos actuales |

### Función CEDEAR
En cualquier celda de la hoja, escribe:

```
=cedear("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo del CEDEAR (ej: "AAPL", "MSFT", "GOOGL")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria
- "name" - Nombre completo de la empresa
- "ratio" - Ratio de conversión entre el CEDEAR y la acción subyacente

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=cedear("AAPL"; "c")` | Precio actual del CEDEAR de Apple |
| `=cedear("MSFT"; "px_ask")` | Precio de oferta de venta del CEDEAR de Microsoft |
| `=cedear("GOOGL"; "pct_change")` | Variación porcentual diaria del CEDEAR de Google |
| `=cedear("TSLA"; "name")` | Nombre completo de la empresa Tesla |
| `=cedear("AMZN"; "ratio")` | Ratio de conversión del CEDEAR de Amazon |

### Función CedearLista
En cualquier celda de la hoja, escribe:

```
=cedearLista()
```

Esta función devuelve una tabla con todos los CEDEARs disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=cedearLista()` | Tabla completa de todos los CEDEARs con sus datos actuales |

### Función USA Stocks
En cualquier celda de la hoja, escribe:

```
=usa_stocks("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo de la acción estadounidense (ej: "AAPL", "MSFT", "GOOGL")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=usa_stocks("AAPL"; "c")` | Precio actual de la acción de Apple |
| `=usa_stocks("MSFT"; "px_ask")` | Precio de oferta de venta de Microsoft |
| `=usa_stocks("GOOGL"; "pct_change")` | Variación porcentual diaria de Google |

### Función USA_StocksLista
En cualquier celda de la hoja, escribe:

```
=usa_stocksLista()
```

Esta función devuelve una tabla con todas las acciones estadounidenses disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=usa_stocksLista()` | Tabla completa de todas las acciones estadounidenses con sus datos actuales |

### Información de Obligaciones Negociables
Devuelve información sobre las obligaciones negociables que cotizan en el mercado argentino.

```
=obligaciones("symbol"; "valor")
```

### Función Obligaciones
En cualquier celda de la hoja, escribe:

```
=obligaciones("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo de la obligación negociable (ej: "AEC1D", "YMCHO", "BYCNO")

**valor (string):**
- "c" - Precio actual
- "v" - Volumen de operaciones
- "q_bid" - Cantidad en oferta de compra
- "px_bid" - Precio de oferta de compra
- "px_ask" - Precio de oferta de venta
- "q_ask" - Cantidad en oferta de venta
- "q_op" - Operaciones diarias
- "pct_change" - Variación porcentual diaria

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=obligaciones("AEC1D"; "c")` | Precio actual de la obligación negociable AEC1D |
| `=obligaciones("YMCHO"; "px_ask")` | Precio de oferta de venta de la obligación negociable YMCHO |
| `=obligaciones("BYCNO"; "pct_change")` | Variación porcentual diaria de la obligación negociable BYCNO |

### Función ObligacionesLista
En cualquier celda de la hoja, escribe:

```
=obligacionesLista()
```

Esta función devuelve una tabla con todas las obligaciones negociables disponibles y sus datos actuales, incluyendo precio, variación porcentual, volumen y otras métricas.

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=obligacionesLista()` | Tabla completa de todas las obligaciones negociables con sus datos actuales |

### Función Inflación
En cualquier celda de la hoja, escribe:

```
=inflacion(fecha)
```

#### Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el índice de inflación
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=inflacion()` | Índice de inflación más reciente |
| `=inflacion("2023-03-31")` | Índice de inflación para marzo de 2023 |
| `=inflacion("03/31/2023")` | Mismo resultado que el anterior |
| `=inflacion(A1)` | Índice de inflación para la fecha en la celda A1 |

### Función Crypto
En cualquier celda de la hoja, escribe:

```
=crypto("symbol"; "moneda")
```

#### Parámetros

**symbol (string):**
- Símbolo de la criptomoneda (ej: "BTC", "ETH", "SOL")

**moneda (string):** [Opcional]
- Moneda en la que se quiere obtener el precio (ej: "USD", "EUR")
- Por defecto: "USD"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=crypto("BTC")` | Precio actual de Bitcoin en USD |
| `=crypto("ETH"; "EUR")` | Precio actual de Ethereum en euros |
| `=crypto("SOL"; "USD")` | Precio actual de Solana en USD |
| `=crypto("MATIC"; "ARS")` | Precio actual de Polygon en pesos argentinos |

### Función UVA
En cualquier celda de la hoja, escribe:

```
=uva(fecha)
```

#### Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el valor del índice UVA
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=uva()` | Valor del UVA más reciente |
| `=uva("2023-03-31")` | Valor del UVA para el 31 de marzo de 2023 |
| `=uva("03/31/2023")` | Mismo resultado que el anterior |
| `=uva(A1)` | Valor del UVA para la fecha en la celda A1 |

### Función Riesgo País
En cualquier celda de la hoja, escribe:

```
=riesgopais(fecha)
```

#### Parámetros

**fecha (string o Date):** [Opcional]
- Fecha para la cual se quiere obtener el valor del riesgo país
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve el valor más reciente disponible

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=riesgopais()` | Valor del riesgo país más reciente |
| `=riesgopais("2023-03-31")` | Valor del riesgo país para el 31 de marzo de 2023 |
| `=riesgopais("03/31/2023")` | Mismo resultado que el anterior |
| `=riesgopais(A1)` | Valor del riesgo país para la fecha en la celda A1 |

### Función Rendimientos
En cualquier celda de la hoja, escribe:

```
=rendimientos("moneda"; "proveedor")
```

#### Parámetros

**moneda (string):**
- Símbolo de la criptomoneda o moneda fiat (ej: "BTC", "ETH", "USDT", "ARS")

**proveedor (string):** [Opcional]
- Nombre del proveedor (ej: "buenbit", "ripio", "letsbit")
- Si se omite, devuelve el mejor rendimiento disponible entre todos los proveedores

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=rendimientos("USDT")` | Mejor rendimiento disponible para USDT entre todos los proveedores |
| `=rendimientos("BTC"; "buenbit")` | Rendimiento anual de Bitcoin en Buenbit |
| `=rendimientos("USDC"; "ripio")` | Rendimiento anual de USDC en Ripio |
| `=rendimientos("SOL"; "letsbit")` | Rendimiento anual de Solana en Letsbit |

### Función CriptoYa
En cualquier celda de la hoja, escribe:

```
=criptoya("coin"; "fiat"; volumen; "exchange"; "operacion")
```

#### Parámetros

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

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=criptoya("BTC"; "ARS")` | Mejor precio de compra de Bitcoin en pesos argentinos |
| `=criptoya("ETH"; "USD"; 0.5; "binance"; "venta")` | Precio de venta de 0.5 ETH en USD en Binance |
| `=criptoya("DAI"; "ARS"; 100; ; "totalVenta")` | Mejor precio de venta (con comisiones) de 100 DAI en pesos |
| `=criptoya("USDT"; "ARS"; 1000; "ripio")` | Precio de compra de 1000 USDT en pesos en Ripio |

### Función Plazo Fijo
En cualquier celda de la hoja, escribe:

```
=plazofijo("banco"; "tipoCliente")
```

#### Parámetros

**banco (string):** [Opcional]
- Nombre del banco (ej: "Nacion", "Galicia", "Provincia")
- Si se omite, devuelve la mejor tasa disponible entre todos los bancos

**tipoCliente (string):** [Opcional]
- Tipo de cliente: "cliente" o "nocliente"
- Por defecto: "cliente"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=plazofijo()` | Mejor tasa de plazo fijo para clientes entre todos los bancos |
| `=plazofijo("Nacion")` | Tasa de plazo fijo para clientes del Banco Nación |
| `=plazofijo("Provincia"; "nocliente")` | Tasa de plazo fijo para no clientes del Banco Provincia |
| `=plazofijo(; "nocliente")` | Mejor tasa de plazo fijo para no clientes entre todos los bancos |

### Función FCI
En cualquier celda de la hoja, escribe:

```
=fci("tipoFondo"; "nombreFondo"; "fecha"; "campo")
```

#### Parámetros

**tipoFondo (string):**
- Tipo de fondo a consultar: "mercadoDinero", "rentaVariable", "rentaFija", "rentaMixta"

**nombreFondo (string):**
- Nombre del fondo a consultar (ej: "Balanz Money Market USD - Clase A")

**fecha (string):** [Opcional]
- Fecha para la cual se quiere obtener la información
- Formato aceptado: "YYYY-MM-DD" o "MM/DD/YYYY"
- Si se omite, devuelve la información más reciente

**campo (string):** [Opcional]
- Campo a consultar: 
  - "vcp" - Valor cuotaparte
  - "ccp" - Cantidad cuotapartes
  - "patrimonio" - Patrimonio total del fondo
- Por defecto: "vcp"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=fci("mercadoDinero"; "Balanz Money Market USD - Clase A")` | Valor cuotaparte actual del fondo Balanz Money Market USD |
| `=fci("rentaFija"; "Pionero Renta"; "2023-05-01")` | Valor cuotaparte del fondo Pionero Renta para la fecha indicada |
| `=fci("rentaVariable"; "Alpha Acciones"; ; "patrimonio")` | Patrimonio actual del fondo Alpha Acciones |
| `=fci("rentaMixta"; "Galileo Income"; ; "ccp")` | Cantidad de cuotapartes actual del fondo Galileo Income |

### Función BCRA
En cualquier celda de la hoja, escribe:

```
=bcra(id)
```

#### Parámetros

**id (number):**
- ID de la variable a consultar
- Algunos IDs disponibles:
  - 1: Reservas Internacionales del BCRA (en millones de dólares)
  - 4: Tipo de Cambio Minorista (ARS / USD) - Promedio Venta
  - 5: Tipo de Cambio Mayorista (ARS / USD) - Referencia Comunicación A 3500
  - 6: Tasa de Política Monetaria (TEA %)

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=bcra(1)` | Valor actual de las Reservas Internacionales del BCRA |
| `=bcra(4)` | Tipo de cambio minorista promedio |
| `=bcra(5)` | Tipo de cambio mayorista de referencia |
| `=bcra(6)` | Tasa de Política Monetaria actual |

### Función Caución
En cualquier celda de la hoja, escribe:

```
=caucion(dias, tna, importeBruto[, arancelCaucionColocadoraTna][, arancelCaucionTomadoraTna])
=caucionColocadora(dias, tna, importeBruto[, arancelCaucionColocadoraTna])
=caucionTomadora(dias, tna, importeBruto[, arancelCaucionTomadoraTna])
```

#### Parámetros

**dias (number):**
- Para caucion(): Días de la caución. Un valor negativo indica una caución colocadora, un valor positivo indica una caución tomadora
- Para caucionColocadora() y caucionTomadora(): Días de la caución (debe ser un número positivo)

**tna (number):**
- Tasa nominal anual (TNA) de la operación, expresada en porcentaje (ej: 120%)

**importeBruto (number):**
- Monto bruto de la operación en pesos

**arancelCaucionColocadoraTna (number):** [Opcional]
- Tasa de arancel para caución colocadora
- Por defecto: 1.5%

**arancelCaucionTomadoraTna (number):** [Opcional]
- Tasa de arancel para caución tomadora
- Por defecto: 4.0%

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=caucion(-7, 120%, 1000000)` | Caución colocadora a 7 días con TNA 120% por $1.000.000 |
| `=caucion(30, 150%, 500000)` | Caución tomadora a 30 días con TNA 150% por $500.000 |
| `=caucionColocadora(15, 130%, 750000)` | Caución colocadora a 15 días con TNA 130% por $750.000 |
| `=caucionTomadora(1, 140%, 1500000, 3.5%)` | Caución tomadora a 1 día con TNA 140% por $1.500.000 y arancel personalizado de 3.5% |
| `=caucion(-10, 125%, 2000000, 2, 4.5%)` | Caución colocadora a 10 días con TNA 125% por $2.000.000 y aranceles personalizados de 4.5% |

#### Notas
- Las funciones devuelven el importe neto final de la operación incluyendo todos los gastos (arancel, derechos de mercado, gastos de garantía e IVA)
- Los gastos de garantía solo aplican para cauciones tomadoras
- El IVA se calcula sobre todos los gastos (21%)
- Los derechos de mercado y gastos de garantía se calculan a una tasa diaria proporcional al plazo de la operación (hasta 90 días)

### Función Dólar Histórico
En cualquier celda de la hoja, escribe:

```
=dolar_historico("tipo"; "fecha"; "valor")
```

#### Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: "blue", "oficial", "mayorista")
- Tipos disponibles: blue, oficial, mayorista, y otros disponibles en la API

**fecha (string):** [Opcional]
- Fecha para la cual se quiere obtener la cotización
- Formato aceptado: "YYYY-MM-DD"
- Si se omite, usa la fecha actual

**valor (string):** [Opcional]
- Valor a devolver: "compra" o "venta"
- Por defecto: "venta"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar_historico("blue"; "2023-01-15")` | Valor de venta del dólar blue el 15 de enero de 2023 |
| `=dolar_historico("oficial"; "2023-01-15"; "compra")` | Valor de compra del dólar oficial el 15 de enero de 2023 |
| `=dolar_historico("mayorista")` | Valor de venta del dólar mayorista para la fecha actual |
| `=dolar_historico_todos("2023-01-15")` | Tabla con todas las cotizaciones disponibles para el 15 de enero de 2023 |

### Función Dólar
En cualquier celda de la hoja, escribe:

```
=dolar("tipo"; "operación")
```

#### Parámetros

**tipo (string):**
- Tipo de dólar a consultar (ej: "blue", "oficial", "mayorista")
- Tipos disponibles: blue, oficial, mayorista, y otros disponibles en la API

**operación (string):**
- Tipo de operación a consultar: "compra", "venta", "promedio"
- Por defecto: "venta"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar("blue")` | Precio de venta del dólar blue |
| `=dolar("oficial")` | Precio de venta del dólar oficial |
| `=dolar("mayorista")` | Precio de venta del dólar mayorista |
| `=dolar("blue"; "compra")` | Precio de compra del dólar blue |
| `=dolar("oficial"; "venta")` | Precio de compra del dólar oficial |
| `=dolar("mayorista"; "promedio")` | Precio promedio del dólar mayorista |

### Errores de la función Dólar Histórico

**Tipo inválido**  
"Error: Debe especificar un tipo de dólar"

**Valor inválido**  
"Error: El valor debe ser 'compra' o 'venta'"

**Cotización no encontrada**  
"No se encontró cotización para la fecha y tipo especificados"

### Errores de la función Dólar

**Tipo inválido**  
"Tipo inválido: 'xyz'. Tipos disponibles: oficial, blue, bolsa, contadoconliqui, mayorista, cripto, tarjeta."

**Operación inválida**  
"Operación inválida: 'xyz'. Usa 'compra', 'venta' o 'promedio'."

## 🔄 Actualización automática
Google Sheets recalcula las fórmulas al:

- Abrir la hoja
- Editar cualquier celda

Forzar recálculo:
- Ctrl + R (Windows) o ⌘ + R (Mac)
- Archivo → Configuración de hoja de cálculo → Cálculo → "Al cambiar" o "Cada minuto"

## ⚠️ Errores comunes

### Errores de la función Dólar

**Tipo inválido**  
"Tipo inválido: 'xyz'. Tipos disponibles: oficial, blue, bolsa, contadoconliqui, mayorista, cripto, tarjeta."

**Operación inválida**  
"Operación inválida: 'xyz'. Usa 'compra', 'venta' o 'promedio'."

### Errores de la función CEDEAR

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de CEDEARs disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función Acciones

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de acciones disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función Bonos

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de bonos disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función Letras

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de letras disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función Inflación

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."

### Errores de la función Crypto

**Par de trading no encontrado**  
"Par de trading no encontrado: 'XYZ-USD'. Verifica que el símbolo y la moneda sean correctos."

**Error de conexión**  
"Error al consultar el precio de XYZ: [mensaje de error detallado]"

### Errores de la función UVA

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."

### Errores de la función Riesgo País

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."

### Errores de la función Rendimientos

**Moneda no encontrada**  
"Moneda 'xyz' no encontrada. Algunas monedas disponibles: BTC, ETH, USDT, USDC, DAI..."

**Proveedor no encontrado**  
"Proveedor 'xyz' no encontrado. Proveedores disponibles: buenbit, ripio, letsbit, belo, lemoncash, satoshitango, fiwind."

**Moneda no disponible en el proveedor**  
"La moneda 'xyz' no está disponible en el proveedor 'abc'."

### Errores de la función Plazo Fijo

**Banco no encontrado**  
"Banco 'xyz' no encontrado. Algunos bancos disponibles: BANCO DE LA NACION ARGENTINA, BANCO SANTANDER ARGENTINA S.A., BANCO DE GALICIA Y BUENOS AIRES S.A.U..."

**Plazo fijo no disponible para no clientes**  
"El banco 'Banco XYZ' no ofrece plazo fijo para no clientes."

**Información no disponible**  
"No se encontró información de tasa para el banco 'Banco XYZ'."

### Errores de la función FCI

**Tipo de fondo inválido**  
"Tipo de fondo inválido. Tipos permitidos: mercadoDinero, rentaVariable, rentaFija, rentaMixta."

**Fondo no encontrado**  
"Fondo 'xyz' no encontrado para el tipo 'abc'. Algunos fondos disponibles: Balanz Money Market USD - Clase A, Schroder Liquidez - Clase B..."

**Campo inválido**  
"Campo inválido. Campos permitidos: vcp (valor cuotaparte), ccp (cantidad cuotapartes), patrimonio."

**Fecha inválida**  
"Fecha inválida: 'xyz'. Usar formato 'YYYY-MM-DD' o 'MM/DD/YYYY'."

**Sin valor disponible**  
"El fondo 'xyz' no tiene valor para el campo 'abc'."

### Errores de la función Opciones

**Símbolo inválido**  
"Símbolo de opción inválido: 'xyz'. No se encontró en la lista de opciones disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función CriptoYa

**Par de trading no encontrado**  
"Par BTC/XYZ no encontrado. Verifica que la cripto y la moneda sean correctas."

**Exchange no disponible**  
"Exchange 'xyz' no disponible. Exchanges disponibles: binance, ripio, letsbit, ..."

**Operación inválida**  
"Operación inválida: 'xyz'. Operaciones disponibles: compra, totalCompra, venta, totalVenta."

### Errores de la función USA Stocks

**Símbolo inválido**  
"Símbolo inválido: 'xyz'. No se encontró en la lista de acciones estadounidenses disponibles."

**Atributo inválido**  
"Atributo inválido: 'xyz'. Atributos disponibles: c, v, q_bid, px_bid, px_ask, q_ask, q_op, pct_change."

### Errores de la función BCRA

**ID inválido**  
"ID inválido. Debe ser un número válido (1, 4, 5, 6, etc)."

**Variable no encontrada**  
"Variable con ID X no encontrada. IDs disponibles: 1, 4, 5, 6, ..."

**Error de conexión**  
"Error al consultar el BCRA: [mensaje de error detallado]"

## 👏 Agradecimientos

- A [Argentina Datos](https://argentinadatos.com/) y su creador [Enzo Notario](https://github.com/enzonotario/) por las APIs de inflación, UVA y cotizaciones históricas de dólares.
- A [@JohnGalt_is_www](https://x.com/JohnGalt_is_www) por sus APIs de bonos, letras, CEDEARs y acciones argentinas y estadounidenses.
- A [@http://criptoya.com/](http://criptoya.com/) por su API de comparación de precios de criptomonedas.
- A [Banco Central de la República Argentina](https://www.bcra.gob.ar/) por su API de variables económicas.

## Archivos principales

- dolar.js – Código fuente de Apps Script para cotizaciones de dólar
- dolar_historico.js – Código fuente de Apps Script para cotizaciones históricas de dólar
- cedear.js – Código fuente de Apps Script para información de CEDEARs
- acciones.js – Código fuente de Apps Script para información de acciones argentinas
- usa_stocks.js – Código fuente de Apps Script para información de acciones estadounidenses
- bonos.js – Código fuente de Apps Script para información de bonos argentinos
- letras.js – Código fuente de Apps Script para información de letras del tesoro
- opciones.js – Código fuente de Apps Script para información de opciones argentinas
- obligaciones.js – Código fuente de Apps Script para información de obligaciones negociables
- inflacion.js – Código fuente de Apps Script para índices de inflación
- crypto.js – Código fuente de Apps Script para precios de criptomonedas
- uva.js – Código fuente de Apps Script para índices UVA
- riesgopais.js – Código fuente de Apps Script para valores del riesgo país
- rendimientos.js – Código fuente de Apps Script para rendimientos de criptomonedas
- plazofijo.js – Código fuente de Apps Script para tasas de plazos fijos
- fci.js – Código fuente de Apps Script para fondos comunes de inversión
- criptoya.js – Código fuente de Apps Script para comparador de precios de criptomonedas
- bcra.js – Código fuente de Apps Script para variables del Banco Central
- caucion.js – Código fuente de Apps Script para cálculo de cauciones tomadoras y colocadoras
- all-in-one.js – Archivo único con todas las funciones combinadas (para instalación simplificada)
- README.md – Esta documentación





