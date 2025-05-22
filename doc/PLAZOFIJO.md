# Función Plazo Fijo

Esta función devuelve las tasas de plazos fijos (TNA) ofrecidas por bancos en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=plazofijo("banco"; "tipoCliente")
```

## Parámetros

**banco (string):** [Opcional]
- Nombre del banco (ej: "Nacion", "Galicia", "Provincia")
- Si se omite, devuelve la mejor tasa disponible entre todos los bancos

**tipoCliente (string):** [Opcional]
- Tipo de cliente: "cliente" o "nocliente"
- Por defecto: "cliente"

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=plazofijo()` | Mejor tasa de plazo fijo para clientes entre todos los bancos |
| `=plazofijo("Nacion")` | Tasa de plazo fijo para clientes del Banco Nación |
| `=plazofijo("Provincia"; "nocliente")` | Tasa de plazo fijo para no clientes del Banco Provincia |
| `=plazofijo(; "nocliente")` | Mejor tasa de plazo fijo para no clientes entre todos los bancos |

## Errores comunes

**Banco no encontrado**  
"Banco 'xyz' no encontrado. Algunos bancos disponibles: BANCO DE LA NACION ARGENTINA, BANCO SANTANDER ARGENTINA S.A., BANCO DE GALICIA Y BUENOS AIRES S.A.U..."

**Plazo fijo no disponible para no clientes**  
"El banco 'Banco XYZ' no ofrece plazo fijo para no clientes."

**Información no disponible**  
"No se encontró información de tasa para el banco 'Banco XYZ'."
