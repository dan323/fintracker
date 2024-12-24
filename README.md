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
3. **src/hooks**:
   - Hooks personalizados para manejar lógica reutilizable (e.g., manejo de transacciones, detección de duplicados).
4. **src/plugins**:
   - Controladores de plug-ins.

---

## **2. Funcionalidades Principales**

### **2.1. Gestor de Transacciones**

- Tabla para visualizar transacciones.
- Importación manual desde CSV.
- Detección y resolución de duplicados.
- Soporte para categorías personalizables (opcional).

### **2.2. Sistema de Plug-ins**

- Permitir cargar plug-ins en tiempo de ejecución.
- Cada plug-in debe tener un formato estándar, exportando un método para importar transacciones de su fuente.

### **2.3. Gestor de Archivos Locales**

- Guardar datos en el sistema de archivos local como JSON.
- Monitorear cambios en el archivo JSON para actualizar la UI (opcional).

### **2.4. Subida Manual de CSV y Resolución de Duplicados**

- Parsear archivos CSV.
- Detectar duplicados comparando atributos clave: **fecha**, **descripción**, **monto**, **cuenta**.
- Proporcionar opciones para manejar duplicados: mantener, reemplazar o ignorar.

---

## **3. Plan de Implementación Detallado**

### **Semana 1: Configuración Inicial**

1. Crear el proyecto React con soporte para TypeScript:

2. Definir el modelo de datos en `src/models/transaction.ts`:

3. Crear un estado inicial con datos mock para las transacciones:

4. Crear la estructura de componentes inicial:

   - **App.tsx**: Punto de entrada.
   - **TransactionTable.tsx**: Componente para mostrar transacciones.
   - **CsvUploader.tsx**: Componente para importar transacciones desde CSV.

---

### **Semana 2: Gestor de Transacciones**

1. Implementar el componente `TransactionTable`:

2. Implementar el componente `CsvUploader`:

---

### **Semana 3: Detección de Duplicados**

1. Implementar la lógica para detectar duplicados en `src/utils/deduplicate.ts`:

2. Crear el componente `DuplicateResolver`:

---

### **Semana 4: Integración Final y Pruebas**

Integrar los componentes

