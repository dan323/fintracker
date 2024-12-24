import React from "react";
import "./transaction-table.css";
import { Transaction } from "../models/transaction";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {

  const sortedTransactions = transactions.sort((t1, t2) => new Date(t1.date).getTime() - new Date(t2.date).getTime());
  return (
    <div>
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