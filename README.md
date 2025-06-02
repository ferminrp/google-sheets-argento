# Google Sheets Argento

Scripts de Apps Script que añaden a tu Google Sheet funciones típicas para el día a día de un Argentino de bien.

[![Invitame un café en cafecito.app](https://cdn.cafecito.app/imgs/buttons/button_1.svg)](https://cafecito.app/ferminrp)

## Instalación

Puedes utilizar el archivo `all-in-one.js` que incluye todas las funciones combinadas para una instalación simplificada.

## Documentación de Funciones

### Cotizaciones y tipos de cambio
- [Dólar](doc/DOLAR.md) - Cotizaciones actuales del dólar
- [Dólar Histórico](doc/DOLAR_HISTORICO.md) - Cotizaciones históricas del dólar
- [BCRA](doc/BCRA.md) - Variables económicas del Banco Central

### Instrumentos financieros argentinos
- [Acciones](doc/ACCIONES.md) - Información de acciones argentinas
- [Bonos](doc/BONOS.md) - Información de bonos argentinos
- [Letras](doc/LETRAS.md) - Información de letras del tesoro
- [Opciones](doc/OPCIONES.md) - Información de opciones argentinas
- [Obligaciones Negociables](doc/OBLIGACIONES.md) - Información de ONs
- [Caución](doc/CAUCION.md) - Cálculo de cauciones tomadoras y colocadoras

### Instrumentos financieros internacionales
- [CEDEAR](doc/CEDEAR.md) - Información de CEDEARs
- [USA Stocks](doc/USA_STOCKS.md) - Información de acciones estadounidenses

### Indicadores económicos
- [Inflación](doc/INFLACION.md) - Índices de inflación mensual
- [UVA](doc/UVA.md) - Valores del índice UVA
- [Riesgo País](doc/RIESGOPAIS.md) - Valores del riesgo país

### Criptomonedas
- [Crypto](doc/CRYPTO.md) - Precios de criptomonedas
- [CriptoYa](doc/CRIPTOYA.md) - Comparador de precios de criptomonedas
- [Rendimientos](doc/RENDIMIENTOS.md) - APY de criptomonedas en Argentina

### Inversiones y plazos fijos
- [Plazo Fijo](doc/PLAZOFIJO.md) - Tasas de plazos fijos
- [FCI](doc/FCI.md) - Información de Fondos Comunes de Inversión

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

- [src/dolar.js](src/dolar.js) – Código fuente para cotizaciones de dólar
- [src/dolar_historico.js](src/dolar_historico.js) – Código fuente para cotizaciones históricas de dólar
- [src/cedear.js](src/cedear.js) – Código fuente para información de CEDEARs
- [src/acciones.js](src/acciones.js) – Código fuente para información de acciones argentinas
- [src/usa_stocks.js](src/usa_stocks.js) – Código fuente para información de acciones estadounidenses
- [src/bonos.js](src/bonos.js) – Código fuente para información de bonos argentinos
- [src/letras.js](src/letras.js) – Código fuente para información de letras del tesoro
- [src/opciones.js](src/opciones.js) – Código fuente para información de opciones argentinas
- [src/obligaciones.js](src/obligaciones.js) – Código fuente para información de obligaciones negociables
- [src/inflacion.js](src/inflacion.js) – Código fuente para índices de inflación
- [src/crypto.js](src/crypto.js) – Código fuente para precios de criptomonedas
- [src/uva.js](src/uva.js) – Código fuente para índices UVA
- [src/riesgopais.js](src/riesgopais.js) – Código fuente para valores del riesgo país
- [src/rendimientos.js](src/rendimientos.js) – Código fuente para rendimientos de criptomonedas
- [src/plazofijo.js](src/plazofijo.js) – Código fuente para tasas de plazos fijos
- [src/fci.js](src/fci.js) – Código fuente para fondos comunes de inversión
- [src/criptoya.js](src/criptoya.js) – Código fuente para comparador de precios de criptomonedas
- [src/bcra.js](src/bcra.js) – Código fuente para variables del Banco Central
- [src/caucion.js](src/caucion.js) – Código fuente para cálculo de cauciones
- [all-in-one.js](all-in-one.js) – Archivo único con todas las funciones combinadas

## Desarrollo

- Ejecutar 'npm run build' para generar [all-in-one.js](all-in-one.js)
- Ejecutar 'npm run test' para ejecutar tests unitarios [tests\all-in-one.test.js](atests\all-in-one.test.js)
