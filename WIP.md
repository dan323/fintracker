# WIP — Plan de lanzamiento a producción (v1.0)

**Objetivo**: publicar FinTracker v1.0 en GitHub Pages (`https://dan323.github.io/fintracker`), estable y usable, lo antes posible. Todo lo que no sea esencial para la v1.0 pasa al backlog post-lanzamiento (sección final).

**Estrategia**: primero corregir bugs reales, después poner el CI en verde (tests + typecheck + audit), después completar el mínimo de producto, y por último pulir y lanzar. No se añade ninguna feature nueva que no esté en las Fases 1–4.

---

## Estado actual (última revisión: 2026-06-12)

Verificado ejecutando build, tests y audit en local:

- ✅ Build de producción funciona (`npm run build`, Vite, chunks vendor separados, charts lazy-loaded)
- ✅ 57 tests pasan (17 ficheros, Vitest + Testing Library)
- ✅ Import CSV (PapaParse), carga/guardado JSON + MessagePack con File System Access API y fallbacks
- ✅ Detección de duplicados + UI de resolución (bugs de Fase 1 corregidos)
- ✅ Filtros: categorías jerárquicas, cuenta (coincidencia parcial, sin acentos), rango de fechas
- ✅ Tabla con edición inline, gráfico de barras, gráfico circular, huella de carbono con recomendaciones
- ✅ i18n ES/EN con selector y persistencia en localStorage
- ✅ ErrorBoundary, estados de carga, CI con deploy automático a gh-pages
- ✅ `npm audit`: 0 vulnerabilidades (dependencias actualizadas, lock regenerado)
- ❌ `tsc --noEmit` falla (`@types/react-router-dom` v5 obsoleto junto a router v7, tsconfig incompleto). El CI no hace typecheck.
- ✅ Fase 1 completa: modelo de categorías unificado sobre ids canónicos (filtro por categoría funciona)

---

## Fase 1 — Bugs bloqueantes (corregir antes de nada)

Cada fix debe llevar su test de regresión.

- [x] **Auto-guardado tras importar CSV guarda estado obsoleto** — corregido (PR #12): `handleUpload` ahora persiste la lista nueva explícitamente; con test de regresión.
- [x] **"Reemplazar" duplicado no hace nada** — corregido (PR #13): se busca la transacción existente por la clave de duplicado y se reemplaza solo la primera coincidencia; con test de regresión.
- [x] **Botón "Editar" no funciona** — corregido (PR #17): edición inline en la tabla, preservando timestamps y con estilo propio para cancelar; con tests.
- [x] **Cancelar el selector de ficheros muestra error** — corregido (PR #14): el `AbortError`/cancelación del file picker ya no muestra el banner de error; con test de regresión.
- [x] **`$` literal visible en los fallbacks de Suspense** — corregido (PR #15): eliminado el `$` en los 3 fallbacks; con test de regresión.
- [x] **Modelo de categorías inconsistente (ids vs nombres)** — corregido (2026-06-12), implementando la propuesta del id canónico:
  - `Transaction.category` contiene siempre el **id** canónico. Nuevo helper `toCategoryId()` en `src/utils/categories.ts` que resuelve cualquier entrada (id, nombre, texto libre legacy; sin acentos, case-insensitive) a un id, con fallback a `miscellaneous-others`; y `categoryName()` para mostrar.
  - Import CSV (`CsvUploader.tsx`): mapea nombre→id con `toCategoryId` (eliminado el fallback traducido `t('categories.other')`).
  - Filtro (`useFilteredTransactions`): normaliza la categoría de la transacción a id antes de comparar y sube por `parentId`; eliminado el literal `'Others'` que dejaba la lista vacía.
  - Calculadora de carbono: busca por id (antes `findCategoryByName` hacía que las transacciones con id cayeran al factor genérico 0.5 de "Others").
  - Tabla: muestra el nombre (`categoryName`) y la edición inline usa un desplegable de categorías canónicas en vez de texto libre; al guardar se normaliza el id.
  - Gráficos (pie y barras): resuelven por id; los movimientos internos se detectan por id `miscellaneous-internal` en vez del nombre traducido. `getColorForTransaction` resuelve por id.
  - Tests de regresión: mapeo CSV nombre/desconocido/vacío→id, filtro con nombres legacy, fallback a `miscellaneous-others` (y que no coincide con otras categorías), factor de emisión correcto por id, y unit tests de `toCategoryId`/`categoryName`.
- [x] **Filtro de cuenta con coincidencia exacta sobre input libre** — corregido (PR #16): coincidencia parcial case-insensitive, sin acentos y con trim del input; con tests de regresión.

---

## Fase 2 — Salud técnica: CI en verde

- [x] **Resolver `npm audit`** — hecho: dependencias actualizadas a últimas versiones estables y lock regenerado; `npm audit` reporta 0 vulnerabilidades.
- [ ] **Sanear TypeScript** (parcial: `typescript` ya está en `^5`):
  - Eliminar `@types/react-router-dom` (router v7 trae sus propios tipos; es la causa actual de que `tsc --noEmit` falle).
  - tsconfig moderno: `"module": "esnext"`, `"moduleResolution": "bundler"`, `"skipLibCheck": true`, `"include": ["src"]`, `"types": ["vitest/globals"]`. Activar `strict` (si genera demasiado ruido, activarlo por flags en dos pasos, pero antes de v1).
- [ ] **Añadir typecheck al CI** — script `"typecheck": "tsc --noEmit"` en package.json y paso correspondiente en `ci.yml`. Vite no comprueba tipos al hacer build; ahora mismo nada lo hace.
- [ ] **Decidir el router** — `BrowserRouter` no tiene ninguna ruta definida y pesa ~33 kB: quitarlo (las pestañas ya son estado local), **o** mover las pestañas a la URL. Si se queda un router en gh-pages, hace falta fallback `404.html`. Recomendación para v1: quitarlo.
- [ ] **Limpieza de producción**:
  - `reportWebVitals(console.log)` en `index.tsx` — eliminar o condicionar a DEV.
  - `console.log`/`console.warn` repartidos por la app — quitar o condicionar a DEV.
  - Campo `bussines?: boolean` (typo, sin uso) en `models/transaction.ts` — eliminar.
  - Categorías de ingresos comentadas en `models/categories.ts` ("// ... rest of income categories") — completarlas o eliminar el bloque muerto.
  - `dependency-scan.yml` sube un artefacto `audit.json` que nunca se genera — generar el fichero o quitar el paso.

---

## Fase 3 — Mínimos de producto para v1.0

- [ ] **Alta manual de transacciones** — ahora mismo solo se pueden importar CSV; un gestor de finanzas necesita poder añadir un movimiento a mano (formulario simple con validación de fecha/importe).
- [x] **Edición de transacciones** — hecha (edición inline en la tabla, PR #17).
- [ ] **No perder datos al recargar** — auto-guardar el estado en IndexedDB/localStorage y ofrecer restaurarlo al abrir (el guardado a fichero sigue siendo el export explícito). Sin esto, un refresh accidental pierde la sesión entera.
- [ ] **Completar i18n**:
  - Recomendaciones de la huella de carbono están hardcodeadas en español (`carbon-calculator.ts`) — moverlas al diccionario.
  - `toLocaleDateString('es-ES', ...)` hardcodeado en `CarbonFootPrint.tsx` — usar el locale activo.
  - Nombres de categoría: mostrarlos traducidos (depende de la decisión id-canónico de Fase 1).
  - `<html lang>` dinámico según locale.
- [ ] **Import CSV robusto para bancos españoles** — decimales con coma (`"12,50"` hoy se convierte en `12` con `parseFloat`) y aviso de filas inválidas en vez de fallar en silencio. PapaParse ya autodetecta `;` como separador.

---

## Fase 4 — Pulido, pruebas y lanzamiento

- [ ] **index.html / PWA mínima**:
  - Quitar la referencia a `logo192.png` (no existe) o añadir iconos reales 192/512 al manifest.
  - Añadir `<meta name="description">`.
  - Etiquetas Open Graph (`og:title`, `og:description`, `og:image` + `twitter:card`) para que el enlace muestre una tarjeta correcta al compartirlo (WhatsApp, X…). Requiere una imagen estática en `public/`.
- [ ] **Donativos** — crear `.github/FUNDING.yml` (activa el botón "Sponsor" en el repo; GitHub Sponsors y/o Ko-fi/Liberapay) y añadir un enlace discreto "Donar" en la UI (footer). Sin backend: el pago ocurre en la plataforma del tercero, la app sigue siendo 100 % client-side.
- [ ] **Pasada rápida de responsive + accesibilidad** — probar en móvil (tabla y filtros son los críticos); labels/aria en botones de la tabla y el resolver de duplicados; foco visible.
- [ ] **Tests de regresión de los bugs de Fase 1** (hechos para los 6 bugs corregidos) + un test de integración del flujo completo (importar → detectar duplicados → resolver → filtrar). Añadir umbral de cobertura razonable al CI (p. ej. 60–70 %) usando `@vitest/coverage-v8` que ya está instalado.
- [ ] **Verificar el fixture `data/transactions.msgpack`** — está commiteado en un repo público; confirmar que es 100 % sintético (no datos bancarios reales). Si no, sustituirlo y purgar historial.
- [ ] **Smoke test manual del deploy** — tras el deploy a gh-pages: cargar la página con el base path `/fintracker/`, importar un CSV de prueba, guardar/cargar msgpack, cambiar idioma ES↔EN, probar las 4 pestañas.
- [ ] **Release**: versión `1.0.0` en package.json, `CHANGELOG.md` (generar desde el historial git), actualizar README si cambió algo del flujo. Consolidar el deploy en una sola vía (workflow de CI; el script `npm run deploy` manual queda como respaldo).

---

## Criterios de lanzamiento (Definition of Done v1.0)

1. CI completamente en verde: tests + typecheck + build + dependency-scan.
2. 0 vulnerabilidades high/critical en dependencias de runtime.
3. Todos los items de Fase 1 cerrados con test de regresión.
4. Sin UI muerta (botones que no hacen nada) ni texto sin traducir en ES/EN.
5. Smoke test manual del deploy en gh-pages superado.

---

## Backlog post-v1.0 (no bloquea el lanzamiento)

Heredado del plan anterior, por orden aproximado de valor:

- **Datos**: validación de esquemas con Zod; preview y mapeo de columnas al importar CSV; export a CSV/Excel/PDF; backup automático y versionado; encriptación opcional del fichero local.
- **UX**: dark mode; filtros guardados; filtro por rango de importes y texto libre; drag & drop de ficheros; tooltips/ayuda contextual; categorías personalizables por el usuario.
- **Rendimiento**: virtualización de la tabla para >5.000 movimientos; memoización de gráficos; Web Workers para filtrado pesado (solo si se detecta degradación real).
- **Huella de carbono**: selector de región en la UI (el cálculo ya soporta regiones); base de factores de emisión actualizable; comparativas con promedios nacionales.
- **SEO/difusión**: dominio propio (CNAME en GH Pages — sustituye la URL `github.io` y mejora marca/SEO); landing estática con contenido indexable (qué hace la app, capturas); sitemap.
- **Plataforma**: PWA completa offline (service worker); E2E con Playwright; Storybook; backend ligero + Plaid (requiere repensar el modelo de privacidad: hoy todo es client-side).
- **Estado**: migrar a Zustand/Redux solo si el Context actual se queda corto (hoy es suficiente).
