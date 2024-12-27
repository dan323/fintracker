## Plan para Aplicación Client-Side de Finanzas Personales

### **Tecnologías Base**

- **UI**: React con TypeScript.
- **Gestor de Estado**: React Context API o React Reducer (sin librerías adicionales).
- **Parsers**: PapaParse para leer archivos CSV.
- **Formato de Almacenamiento Local**: Archivos JSON para persistencia en el sistema de archivos del usuario.

---

## **1. Arquitectura del Proyecto**

### **Estructura del Proyecto**

1. **src/models**:
   - Definir interfaces y tipos.
2. **src/components**:
   - Componentes React modulares.
3. **src/context**:
4. **src/utils**:

---

## **2. Funcionalidades Principales**

### **2.1. Gestor de Transacciones**

- Tabla para visualizar transacciones.✅
- Detección y resolución de duplicados.✅
- Soporte para categorías personalizables (opcional).
- Editar transacciones.
- Borrar transacciones.✅

### **2.2. Sistema de Plug-ins**

- Create a small backend for security porpuses.
- Integrate Plaid.

### **2.3. Gestor de Archivos Locales**

- Guardar datos en el sistema de archivos local como JSON u otros.✅
- Monitorear cambios en el archivo JSON para actualizar la UI (opcional).

### **2.4. Subida Manual de CSV y Resolución de Duplicados**

- Parsear archivos CSV.✅ (Not tested)
- Detectar duplicados comparando atributos clave: **fecha**, **monto**, **cuenta**.✅ (Not tested)
- Proporcionar opciones para manejar duplicados: mantener, reemplazar o ignorar.✅ (Not tested)

### **2.5. Calcular la huella de carbono**

- Computar la huella de carbono en función de los gastos.✅
- Computar la huella de carbono en función del área geográfica

### **2.6. Filtrar por categorías, rango de fechas, fuente del movimiento**

- Filtrar por grupo de categorías.✅
- Cuando se filtra por todas las subcategorías de una categoría, añadirla al filtrar y borrar las subcategorías (opcional).
- Filtrar por rango de fechas.✅
- Filtrar por fuente del movimiento.✅

### **2.7. Hacer mejoras de UI**

### **2.7. Internacinalización del texto**

---