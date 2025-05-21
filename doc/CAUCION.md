### Cauciones
Devuelve información sobre operaciones de caución (colocadora y tomadora) en el mercado argentino.

```
=caucion(dias, tna, importeBruto[, arancelCaucionColocadoraTna][, arancelCaucionTomadoraTna])
=caucionColocadora(dias, tna, importeBruto[, arancelCaucionColocadoraTna])
=caucionTomadora(dias, tna, importeBruto[, arancelCaucionTomadoraTna])
```

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