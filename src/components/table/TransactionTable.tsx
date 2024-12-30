import React, { useState } from "react";
import "./transaction-table.css";
import { Transaction } from "../../models/transaction";
import ToggleMultiple from "../toggle-switch/ToggleMultiple";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const [type, setType] = useState<"" | "positive" | "negative">("");

  const sortedTransactions = transactions.filter((tx) => {
    if (type === 'negative') {
      return tx.amount < 0;
    } else if (type === 'positive') {
      return tx.amount > 0;
    } else {
      return true;
    }
  }).sort((t1, t2) => new Date(t1.date).getTime() - new Date(t2.date).getTime());

  const map: Map<string,string> = new Map();
  map.set('', 'Ingresos y Gastos');
  map.set('positive', 'Ingresos');
  map.set('negative', 'Gastos');

  return (
    <div>
      {/* Toggle Switch */}
      <ToggleMultiple className="toggle-container" label="siendo mostrados" states={['','positive','negative']} stateTexts={map} onToggle={(st) => setType(st as ("" | "negative" | "positive"))}/>

      {/* Transaction Table */}
      <table className="transaction-table">
        <thead>
          <tr key="header-row">
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Monto</th>
            <th>Categoría</th>
            <th>Cuenta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx: Transaction) =>
          (<tr key={tx.id}>
            <td>{`${tx.date.toISOString().slice(0, 10)}`}</td>
            <td>{tx.description}</td>
            <td>{tx.amount.toFixed(2)}</td>
            <td>{tx.category}</td>
            <td>{tx.account}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(tx)}>
                Editar
              </button>
              <button className="delete-btn" onClick={() => onDelete(tx.id)}>
                Eliminar
              </button>
            </td>
          </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;