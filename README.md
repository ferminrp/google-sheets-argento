# Google Sheets Argento
Scripts de Apps Script que añaden a tu Google Sheet funciones tipicas para el dia a dia de un Argentino de bien.

## Funciones

### Cotizaciones del dolar
Devuelve la cotización de los distintos tipos de dólar en Argentina.

```
=dolar("tipo"; "operación")
```

## 📦 Estructura del repositorio
- dolar.js – Código fuente de Apps Script
- README.md – Esta documentación

## 🔧 Instalación
1. Abrí tu Google Sheet.
2. Andá a Extensiones → Apps Script.
3. Borra cualquier código existente y pega el contenido de dolar.js
4. Guarda el proyecto (por ejemplo, "CotizacionesDolar").
5. Volvé a la hoja y espera unos segundos para que se registre la función.

## 🚀 Uso
En cualquier celda de la hoja, escribe:

```
=dolar("tipo"; "operación")
```

### Parámetros

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

### Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=dolar("blue"; "venta")` | Precio de venta del dólar Blue |
| `=dolar("mayorista"; "compra")` | Precio de compra del dólar Mayorista |
| `=dolar("oficial"; "promedio")` | Promedio entre compra y venta oficial |

## 🔄 Actualización automática
Google Sheets recalcula las fórmulas al:

- Abrir la hoja
- Editar cualquier celda

Forzar recálculo:
- Ctrl + R (Windows) o ⌘ + R (Mac)
- Archivo → Configuración de hoja de cálculo → Cálculo → "Al cambiar" o "Cada minuto"

## ⚠️ Errores comunes

**Tipo inválido**  
"Tipo inválido: 'xyz'. Tipos disponibles: oficial, blue, bolsa, contadoconliqui, mayorista, cripto, tarjeta."

**Operación inválida**  
"Operación inválida: 'xyz'. Usa 'compra', 'venta' o 'promedio'."





