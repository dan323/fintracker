import React, { useState } from "react";
import "./transactionTable.css";
import { Transaction } from "../models/transaction";

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterAccount, setFilterAccount] = useState<string>("");
  const [filterAmountType, setFilterAmountType] = useState<string>("");

  const filteredTransactions = transactions.filter((tx: Transaction) => {
    const matchesCategory = filterCategory
      ? tx.category.toLowerCase().includes(filterCategory.toLowerCase())
      : true;
    const matchesAccount = filterAccount
      ? tx.account.toLowerCase().includes(filterAccount.toLowerCase())
      : true;
    const matchesAmountType =
      filterAmountType === "positive"
        ? tx.amount > 0
        : filterAmountType === "negative"
        ? tx.amount < 0
        : true;

    return matchesCategory && matchesAccount && matchesAmountType;
  });


  const sortedTransactions = filteredTransactions.sort((t1, t2) => new Date(t1.date).getTime() - new Date(t2.date).getTime());
  return (
    <div>
      {/* Filter Section */}
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Filtrar por categoría"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Filtrar por cuenta"
          value={filterAccount}
          onChange={(e) => setFilterAccount(e.target.value)}
        />
        <select
          value={filterAmountType}
          onChange={(e) => setFilterAmountType(e.target.value)}
        >
          <option value="">Todos</option>
          <option value="positive">Ingresos</option>
          <option value="negative">Gastos</option>
        </select>
      </div>

      {/* Transaction Table */}
      <table className="transaction-table">
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