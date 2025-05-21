# Google Sheets Argento

Scripts de Apps Script que añaden a tu Google Sheet funciones típicas para el día a día de un Argentino de bien.

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_1.svg)](https://cafecito.app/ferminrp)

## Instalación

Puedes utilizar el archivo `all-in-one.js` que incluye todas las funciones combinadas para una instalación simplificada.

## Documentación de Funciones

### Cotizaciones y tipos de cambio
- [Dólar](DOLAR.md) - Cotizaciones actuales del dólar
- [Dólar Histórico](DOLAR_HISTORICO.md) - Cotizaciones históricas del dólar
- [BCRA](BCRA.md) - Variables económicas del Banco Central

### Instrumentos financieros argentinos
- [Acciones](ACCIONES.md) - Información de acciones argentinas
- [Bonos](BONOS.md) - Información de bonos argentinos
- [Letras](LETRAS.md) - Información de letras del tesoro
- [Opciones](OPCIONES.md) - Información de opciones argentinas
- [Obligaciones Negociables](OBLIGACIONES.md) - Información de ONs
- [Caución](CAUCION.md) - Cálculo de cauciones tomadoras y colocadoras

### Instrumentos financieros internacionales
- [CEDEAR](CEDEAR.md) - Información de CEDEARs
- [USA Stocks](USA_STOCKS.md) - Información de acciones estadounidenses

### Indicadores económicos
- [Inflación](INFLACION.md) - Índices de inflación mensual
- [UVA](UVA.md) - Valores del índice UVA
- [Riesgo País](RIESGOPAIS.md) - Valores del riesgo país

### Criptomonedas
- [Crypto](CRYPTO.md) - Precios de criptomonedas
- [CriptoYa](CRIPTOYA.md) - Comparador de precios de criptomonedas
- [Rendimientos](RENDIMIENTOS.md) - APY de criptomonedas en Argentina

### Inversiones y plazos fijos
- [Plazo Fijo](PLAZOFIJO.md) - Tasas de plazos fijos
- [FCI](FCI.md) - Información de Fondos Comunes de Inversión

## 🔄 Actualización automática
Google Sheets recalcula las fórmulas al:

- Abrir la hoja
- Editar cualquier celda

Forzar recálculo:
- Ctrl + R (Windows) o ⌘ + R (Mac)
- Archivo → Configuración de hoja de cálculo → Cálculo → "Al cambiar" o "Cada minuto"

## 👏 Agradecimientos

- A [Argentina Datos](https://argentinadatos.com/) y su creador [Enzo Notario](https://github.com/enzonotario/) por las APIs de inflación, UVA y cotizaciones históricas de dólares.
- A [@JohnGalt_is_www](https://x.com/JohnGalt_is_www) por sus APIs de bonos, letras, CEDEARs y acciones argentinas y estadounidenses.
- A [@http://criptoya.com/](http://criptoya.com/) por su API de comparación de precios de criptomonedas.
- A [Banco Central de la República Argentina](https://www.bcra.gob.ar/) por su API de variables económicas.

## Archivos principales

- [dolar.js](DOLAR.md) – Código fuente para cotizaciones de dólar
- [dolar_historico.js](DOLAR_HISTORICO.md) – Código fuente para cotizaciones históricas de dólar
- [cedear.js](CEDEAR.md) – Código fuente para información de CEDEARs
- [acciones.js](ACCIONES.md) – Código fuente para información de acciones argentinas
- [usa_stocks.js](USA_STOCKS.md) – Código fuente para información de acciones estadounidenses
- [bonos.js](BONOS.md) – Código fuente para información de bonos argentinos
- [letras.js](LETRAS.md) – Código fuente para información de letras del tesoro
- [opciones.js](OPCIONES.md) – Código fuente para información de opciones argentinas
- [obligaciones.js](OBLIGACIONES.md) – Código fuente para información de obligaciones negociables
- [inflacion.js](INFLACION.md) – Código fuente para índices de inflación
- [crypto.js](CRYPTO.md) – Código fuente para precios de criptomonedas
- [uva.js](UVA.md) – Código fuente para índices UVA
- [riesgopais.js](RIESGOPAIS.md) – Código fuente para valores del riesgo país
- [rendimientos.js](RENDIMIENTOS.md) – Código fuente para rendimientos de criptomonedas
- [plazofijo.js](PLAZOFIJO.md) – Código fuente para tasas de plazos fijos
- [fci.js](FCI.md) – Código fuente para fondos comunes de inversión
- [criptoya.js](CRIPTOYA.md) – Código fuente para comparador de precios de criptomonedas
- [bcra.js](BCRA.md) – Código fuente para variables del Banco Central
- [caucion.js](CAUCION.md) – Código fuente para cálculo de cauciones
- all-in-one.js – Archivo único con todas las funciones combinadas
