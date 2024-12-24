import React, { useState } from "react";
import "./transaction-table.css";
import { Transaction } from "../models/transaction";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const [type, setType] = useState<""|"positive"|"negative">("");
  const [txs, setTransactions] = useState<Transaction[]>(transactions);

  const sortedTransactions = txs.sort((t1, t2) => new Date(t1.date).getTime() - new Date(t2.date).getTime());
  return (
    <div>
      <select
        value={type}
        onChange={(e) => {
          const newType = e.target.value as '' | 'positive' | 'negative';
          setType(newType);
          setTransactions(transactions.filter((tx) => {
            if (newType === 'negative') {
              return tx.amount < 0;
            } else if (newType === 'positive') {
              return tx.amount > 0;
            } else {
              return true;
            }
          }))
        }}
      >
        <option value="">Todos</option>
        <option value="positive">Ingresos</option>
        <option value="negative">Gastos</option>
      </select>

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
          {sortedTransactions.map((tx: Transaction) => (
            <tr key={tx.id}>
              <td>{tx.date}</td>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;