# Función FCI

Esta función devuelve información sobre Fondos Comunes de Inversión (FCI) en Argentina.

## Uso

En cualquier celda de la hoja, escribe:

```
=fci("tipoFondo"; "nombreFondo"; "fecha"; "campo")
```

## Parámetros

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

## Ejemplos

| Fórmula | Descripción |
|---------|-------------|
| `=fci("mercadoDinero"; "Balanz Money Market USD - Clase A")` | Valor cuotaparte actual del fondo Balanz Money Market USD |
| `=fci("rentaFija"; "Pionero Renta"; "2023-05-01")` | Valor cuotaparte del fondo Pionero Renta para la fecha indicada |
| `=fci("rentaVariable"; "Alpha Acciones"; ; "patrimonio")` | Patrimonio actual del fondo Alpha Acciones |
| `=fci("rentaMixta"; "Galileo Income"; ; "ccp")` | Cantidad de cuotapartes actual del fondo Galileo Income |

## Errores comunes

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
