Contribuir a FinTracker

Gracias por querer contribuir a FinTracker. Esta guía rápida explica cómo preparar y enviar cambios para que el proceso sea fluido.

1) Abrir un issue primero
- Antes de trabajar en una funcionalidad mayor o corrección, abre un `issue` describiendo el problema o propuesta. Esto evita trabajo duplicado y facilita la discusión.

2) Flujo de ramas
- Crea una rama descriptiva desde `main` o `master`:

```powershell
git checkout -b feat/<breve-descripcion>
# o
git checkout -b fix/<breve-descripcion>
```

3) Estilo de commits
- Usa mensajes de commit claros. Ejemplos:
  - `feat: añadir uploader CSV con validación básica`
  - `fix: corregir parseo de fechas MM/DD/YYYY`
  - `docs: actualizar README con formatos aceptados`

4) Ejecutar la app localmente
- Instala dependencias y ejecuta en modo desarrollo:

```powershell
npm install
npm start
```

5) Tests
- Ejecuta los tests antes de crear el PR (si existen):

```powershell
npm test
```

- Añade tests unitarios para nuevas utilidades o correcciones críticas.

6) Lint y formato
- Este repositorio actualmente no exige una herramienta de lint/format por defecto en los scripts. Recomendamos usar `ESLint` y `Prettier` en tu editor o añadir scripts en `package.json`.

7) Pull Request
- Empuja tu rama al remoto y crea un PR.
- En el PR incluye:
  - Descripción corta del cambio.
  - Screenshots o datos de ejemplo si aplica.
  - Comandos para reproducir localmente.
  - Referencias a issues relacionados.

8) Revisión y merge
- El PR será revisado. Responde a los comentarios y actualiza la rama si es necesario.
- Mantén los PRs pequeños y enfocados para facilitar la revisión.

9) Seguridad y datos sensibles
- No subas datos reales ni secretos (tokens, contraseñas). Si necesitas compartir ejemplos, usa datos ficticios o anonimiza.

10) Otras consideraciones
- Si añades dependencias, explica por qué son necesarias.
- Añade notas de migración si cambias la forma de los datos (por ejemplo, la estructura de `Transaction`).

## Política de uso comercial

Este proyecto se publica bajo la licencia Creative Commons Atribución-NoComercial
4.0 (CC BY-NC 4.0). Esto significa que **no se permite el uso comercial** del
código o los recursos asociados sin una licencia comercial explícita del autor.

Si planeas usar el proyecto con fines comerciales (por ejemplo, integrarlo en
un producto o servicio de pago, o redistribuirlo como parte de una oferta de
pago), por favor contacta al autor abriendo un `issue` titulado
"Licencia comercial / Contacto" y describe brevemente el uso comercial
propuesto. El autor te responderá para discutir términos y una posible licencia
comercial.

Gracias por colaborar — cualquier aporte es bienvenido.
