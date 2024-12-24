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

   ```bash
   npx create-react-app fintracker --template typescript
   cd fintracker
   ```

2. Definir el modelo de datos en `src/models/transaction.ts`:

   ```typescript
   export interface Transaction {
     id: string;
     date: string; // Formato ISO (YYYY-MM-DD)
     description: string;
     amount: number;
     category: string;
     account: string;
   }
   ```

3. Crear un estado inicial con datos mock para las transacciones:

   ```typescript
   export const mockTransactions: Transaction[] = [
     {
       id: "1",
       date: "2023-12-01",
       description: "Supermercado",
       amount: -50.25,
       category: "Compras",
       account: "Tarjeta 1234",
     },
   ];
   ```

4. Crear la estructura de componentes inicial:

   - **App.tsx**: Punto de entrada.
   - **TransactionTable.tsx**: Componente para mostrar transacciones.
   - **CsvUploader.tsx**: Componente para importar transacciones desde CSV.

---

### **Semana 2: Gestor de Transacciones**

1. Implementar el componente `TransactionTable`:

   ```typescript
   import React from "react";
   import { Transaction } from "../models/transaction";

   interface Props {
     transactions: Transaction[];
     onEdit: (transaction: Transaction) => void;
     onDelete: (id: string) => void;
   }

   const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
     return (
       <table>
         <thead>
           <tr>
             <th>Fecha</th>
             <th>Descripción</th>
             <th>Monto</th>
             <th>Categoría</th>
             <th>Cuenta</th>
             <th>Acciones</th>
           </tr>
         </thead>
         <tbody>
           {transactions.map((tx) => (
             <tr key={tx.id}>
               <td>{tx.date}</td>
               <td>{tx.description}</td>
               <td>{tx.amount.toFixed(2)}</td>
               <td>{tx.category}</td>
               <td>{tx.account}</td>
               <td>
                 <button onClick={() => onEdit(tx)}>Editar</button>
                 <button onClick={() => onDelete(tx.id)}>Eliminar</button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     );
   };

   export default TransactionTable;
   ```

2. Implementar el componente `CsvUploader`:

   ```typescript
   import React from "react";
   import Papa from "papaparse";
   import { Transaction } from "../models/transaction";

   interface Props {
     onUpload: (transactions: Transaction[]) => void;
   }

   const CsvUploader: React.FC<Props> = ({ onUpload }) => {
     const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
       const file = event.target.files?.[0];
       if (file) {
         Papa.parse(file, {
           header: true,
           skipEmptyLines: true,
           complete: (results) => {
             const transactions = results.data.map((row: any) => ({
               id: crypto.randomUUID(),
               date: row.date,
               description: row.description,
               amount: parseFloat(row.amount),
               category: row.category || "Sin Categoría",
               account: row.account || "Desconocida",
             }));
             onUpload(transactions);
           },
         });
       }
     };

     return <input type="file" accept=".csv" onChange={handleFileChange} />;
   };

   export default CsvUploader;
   ```

---

### **Semana 3: Detección de Duplicados**

1. Implementar la lógica para detectar duplicados en `src/utils/deduplicate.ts`:

   ```typescript
   import { Transaction } from "../models/transaction";

   export const findDuplicates = (
     newTransactions: Transaction[],
     existingTransactions: Transaction[]
   ): Transaction[] => {
     return newTransactions.filter((newTx) =>
       existingTransactions.some(
         (existingTx) =>
           newTx.date === existingTx.date &&
           newTx.description === existingTx.description &&
           newTx.amount === existingTx.amount &&
           newTx.account === existingTx.account
       )
     );
   };
   ```

2. Crear el componente `DuplicateResolver`:

   ```typescript
   import React from "react";
   import { Transaction } from "../models/transaction";

   interface Props {
     duplicates: Transaction[];
     onResolve: (transaction: Transaction, action: "keep" | "replace" | "ignore") => void;
   }

   const DuplicateResolver: React.FC<Props> = ({ duplicates, onResolve }) => {
     return (
       <div>
         <h3>Duplicados detectados</h3>
         {duplicates.map((tx) => (
           <div key={tx.id}>
             <p>
               {tx.date} - {tx.description} - {tx.amount}
             </p>
             <button onClick={() => onResolve(tx, "keep")}>Mantener</button>
             <button onClick={() => onResolve(tx, "replace")}>Reemplazar</button>
             <button onClick={() => onResolve(tx, "ignore")}>Ignorar</button>
           </div>
         ))}
       </div>
     );
   };

   export default DuplicateResolver;
   ```

---

### **Semana 4: Integración Final y Pruebas**

1. Integrar los componentes `TransactionTable`,

