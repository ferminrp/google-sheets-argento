# Google Sheets Argento
Scripts de Apps Script que añaden a tu Google Sheet funciones tipicas para el dia a dia de un Argentino de bien.

## Funciones

### Cotizaciones del dolar
Devuelve la cotización de los distintos tipos de dólar en Argentina.

```
=dolar("tipo"; "operación")
```

### Información de CEDEARs
Devuelve información sobre los CEDEARs (Certificados de Depósito Argentinos) que cotizan en Argentina.

```
=cedear("symbol"; "valor")
```

### Información de Acciones Argentinas
Devuelve información sobre las acciones que cotizan en el mercado argentino.

```
=acciones("symbol"; "valor")
```

## 📦 Estructura del repositorio
- dolar.js – Código fuente de Apps Script para cotizaciones de dólar
- cedear.js – Código fuente de Apps Script para información de CEDEARs
- acciones.js – Código fuente de Apps Script para información de acciones argentinas
- README.md – Esta documentación

## 🔧 Instalación
1. Abrí tu Google Sheet.
2. Andá a Extensiones → Apps Script.
3. Borra cualquier código existente y pega el contenido de dolar.js, cedear.js y/o acciones.js
4. Guarda el proyecto (por ejemplo, "ArgentinaFinance").
5. Volvé a la hoja y espera unos segundos para que se registren las funciones.

## 🚀 Uso

### Función Dólar
En cualquier celda de la hoja, escribe:

```
=dolar("tipo"; "operación")
```

#### Parámetros

**tipo (string):**
- "oficial"
- "blue"
- "bolsa"
- "contadoconliqui"
- "mayorista"
- "cripto"
- "tarjeta"

**operación (string):**
- "compra"
- "venta"
- "promedio"

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar("blue"; "venta")` | Precio de venta del dólar Blue |
| `=dolar("mayorista"; "compra")` | Precio de compra del dólar Mayorista |
| `=dolar("oficial"; "promedio")` | Promedio entre compra y venta oficial |

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

#### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=cedear("AAPL"; "c")` | Precio actual del CEDEAR de Apple |
| `=cedear("MSFT"; "px_ask")` | Precio de oferta de venta del CEDEAR de Microsoft |
| `=cedear("GOOGL"; "pct_change")` | Variación porcentual diaria del CEDEAR de Google |

### Función Acciones
En cualquier celda de la hoja, escribe:

```
=acciones("symbol"; "valor")
```

#### Parámetros

**symbol (string):**
- Símbolo de la acción argentina (ej: "YPFD", "ALUA", "PAMP")

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
| `=acciones("YPFD"; "c")` | Precio actual de la acción de YPF |
| `=acciones("ALUA"; "px_ask")` | Precio de oferta de venta de Aluar |
| `=acciones("PAMP"; "pct_change")` | Variación porcentual diaria de Pampa Energía |

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





