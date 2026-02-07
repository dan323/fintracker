# FinTracker

FinTracker es una aplicación cliente (React + TypeScript) para gestionar finanzas personales: importar transacciones desde CSV, detectar duplicados, filtrar y visualizar gastos, y calcular una estimación de la huella de carbono asociada a los movimientos.

## Estado del repositorio

El contenido original del plan y roadmap se ha movido a `WIP.md` para mantener este `README.md` limpio y enfocado en instalar y ejecutar el proyecto.

## Rápido: instalar y ejecutar (desarrollo)

Requisitos:
- Node.js 22+ (recomendado)
- npm (incluido con Node.js)

Sugerencia: usa `nvm` o `nvm-windows` para gestionar versiones de Node y asegura reproducibilidad usando el fichero `.nvmrc` que contiene la versión 22.

Instalar dependencias:

```powershell
npm install
```

Ejecutar en modo desarrollo (abre http://localhost:3000):

```powershell
npm start
```

Construir para producción:

```powershell
npm run build
```

Ejecutar tests (si los hay):

```powershell
npm test
```

## Estructura relevante del proyecto

- `src/` - código fuente React + TypeScript
  - `components/` - componentes UI reutilizables
  - `context/` - React Context y providers
  - `models/` - tipos e interfaces del dominio (Transactions, Categories)
  - `utils/` - utilidades (parsings, deduplicación, messagepack)
- `public/` - archivos estáticos (index.html, manifest, favicon)
- `data/transactions.msgpack` - ejemplo de datos serializados (puede usarse como fixture)

## Formatos aceptados (CSV / JSON / MessagePack)

La aplicación soporta importar transacciones en los formatos más comunes. A continuación se indican las expectativas y ejemplos para cada formato (basado en el código de `src/components/CsvUploader.tsx`, `src/models/transaction.ts` y `src/utils/message-pack.ts`).

1) CSV
- El uploader CSV acepta archivos con extensión `.csv`.
- Se espera una fila de cabecera con nombres de columnas (case-sensitive recomendada):
  - `amount` (obligatorio) — número (ej.: `-12.50` para gasto, `1000` para ingreso).
  - `date` (obligatorio) — fecha en formato ISO (`YYYY-MM-DD`) o otros formatos parseables (el parser intenta Date.parse y también `MM/DD/YYYY`). Si no puede parsear, se usa la fecha actual como fallback y se emite una advertencia.
  - `description` (opcional) — texto descriptivo.
  - `category` (opcional) — texto; si falta, se asigna `Others`.
  - `account` (opcional) — texto; si falta, se asigna `Desconocida`.

- Ejemplo mínimo (archivo `transactions.csv`):

```csv
amount,date,description,category,account
-12.50,2025-12-01,Café,Cafetería,Cuenta Corriente
1000,12/15/2025,Salario,Ingresos,Cuenta Nomina
```

- Notas:
  - Los separadores decimales deben usar `.` (puntos) como en `12.50`.
  - Las filas vacías se saltan.
  - Si el CSV no incluye `id`, la aplicación genera `id` automáticamente al importar.

2) JSON
- Se espera un array de objetos con la forma de `Transaction`:
  - `id` (string) — opcional; si falta, se puede generar.
  - `date` — preferiblemente una cadena ISO (`"2025-12-01"`) o un timestamp; el transformer intentará convertirlo a `Date`.
  - `description` (string)
  - `amount` (number)
  - `category` (string)
  - `account` (string)

- Ejemplo mínimo (`transactions.json`):

```json
[
  {
    "id": "abc-123",
    "date": "2025-12-01",
    "description": "Café",
    "amount": -12.5,
    "category": "Cafetería",
    "account": "Cuenta Corriente"
  }
]
```

- El helper `jsonTransformer` en `src/utils/message-pack.ts` parsea esto y lo convierte en `Transaction[]`.

3) MessagePack (`.msgpack`)
- MessagePack es un formato binario compacto; la app incluye utilidades para serializar y deserializar con `@msgpack/msgpack`.
- El archivo suele tener extensión `.msgpack` y contiene la misma estructura (array de transacciones) serializada en binary.
- El helper `msgpackTransformer` en `src/utils/message-pack.ts` decodifica el buffer en `Transaction[]`. El guardado por defecto utiliza el nombre `transactions.msgpack`.
- Nota: dado que MessagePack es binario, no es legible en un editor de texto; usa las utilidades de la aplicación o la librería `@msgpack/msgpack` para crear/leer estos ficheros.

## Scripts útiles

- `npm start` - ejecuta la app en desarrollo
- `npm run build` - empaqueta la app para producción
- `npm test` - ejecuta la suite de tests

## Desarrollo y contribución

- Mantén PRs pequeños y enfocados.
- Ejecuta tests y lint antes de abrir PRs (añade scripts si no existen).
- Si introduces dependencias nuevas, añade una nota en el README o CHANGELOG.

## Notas de seguridad y privacidad

- Esta aplicación guarda datos del usuario localmente (archivos JSON / messagepack). Si trabajas con datos reales, considera encriptarlos antes de persistirlos.

## Enlaces

- Página GitHub Pages (si está configurada): `https://dan323.github.io/fintracker`
