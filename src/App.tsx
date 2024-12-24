import React, { useState } from "react";
import CsvUploader from "./components/CsvUploader";
import DuplicateResolver from "./components/DuplicateResolver";
import TransactionTable from "./components/TransactionTable";
import TransactionChart from "./components/TransactionChart";
import { Transaction } from "./models/transaction";
import { findDuplicates } from "./utils/deduplicate";
import { loadFile, saveFile } from "./utils/transaction";
import "./App.css";

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duplicates, setDuplicates] = useState<Transaction[]>([]);

  // Load transactions from a local JSON or msgpack file
  const loadTransactions = async () => {
    try {
      console.log("opening file...");
      await loadFile().then(setTransactions);
    } catch (error) {
      console.log("No file selected or error loading file:", error);
    }
  };

  // Save transactions to a local msgpack file
  const saveTransactions = async () => {
    try {
      await saveFile(transactions);
    } catch (error) {
      console.log("Error saving file:", error);
    }
  };

  const handleUpload = (newTransactions: Transaction[]) => {
    const detectedDuplicates = findDuplicates(newTransactions, transactions);
    setDuplicates(detectedDuplicates);

    const nonDuplicates = newTransactions.filter(
      (tx) => !detectedDuplicates.some((dup) => dup.id === tx.id)
    );

    setTransactions((prev) => [...prev, ...nonDuplicates]);
  };

  const handleResolveDuplicate = (
    transaction: Transaction,
    action: "keep" | "replace" | "ignore"
  ) => {
    if (action === "keep") {
      setTransactions((prev) => [...prev, transaction]);
    } else if (action === "replace") {
      setTransactions((prev) =>
        prev.map((tx) => (tx.id === transaction.id ? transaction : tx))
      );
    }

    setDuplicates((prev) => prev.filter((dup) => dup.id !== transaction.id));
  };

  return (
    <div className="app-container">
      <h1 className="app-title">Personal Finance Tracker</h1>
      <div className="app-controls">
        <button className="action-button" onClick={loadTransactions}>
          Load Transactions
        </button>
        <button className="action-button" onClick={saveTransactions}>
          Save Transactions
        </button>
        <CsvUploader onUpload={handleUpload} />
      </div>
      <TransactionTable
        transactions={transactions}
        onEdit={(transaction: Transaction) => console.log("Edit:", transaction)}
        onDelete={(id: string) =>
          setTransactions((prev: Transaction[]) =>
            prev.filter((tx) => tx.id !== id)
          )
        }
      />
      <TransactionChart transactions={transactions} />
      {duplicates.length > 0 && (
        <DuplicateResolver
          duplicates={duplicates}
          onResolve={handleResolveDuplicate}
        />
      )}
    </div>
  );
};

export default App;
