import React, { useState } from "react";
import CsvUploader from "./components/CsvUploader";
import DuplicateResolver from "./components/DuplicateResolver";
import Filtering from "./components/Filtering";
import TransactionTable from "./components/TransactionTable";
import TransactionChart from "./components/TransactionChart";
import { Transaction } from "./models/transaction";
import { findDuplicates } from "./utils/deduplicate";
import { loadFile, saveFile, useFilteredTransactions } from "./utils/transaction";
import "./App.css";
import TabSelector from "./components/TabSelector";
import Analytics from "./components/Analytics";
import { BrowserRouter, Router } from "react-router-dom/dist";

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duplicates, setDuplicates] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("table");

  const filteredTransactions = useFilteredTransactions(transactions);
  // Load transactions from a local JSON or msgpack file
  const loadTransactions = async () => {
    try {
      console.log("Opening file...");
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
    <BrowserRouter basename="/fintrack">
    <div className="app-container">
      <h1 className="app-title">Finanzas personales</h1>
      <div className="app-controls">
        <button className="action-button" onClick={loadTransactions}>
          Subir movimientos
        </button>
        <button className="action-button" onClick={saveTransactions}>
          Guardar movimientos
        </button>
        <CsvUploader onUpload={handleUpload} />
      </div>
      <Filtering />
      <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="tab-content">
        {activeTab === "table" && (
          <><TransactionTable
            transactions={filteredTransactions}
            onEdit={(transaction: Transaction) =>
              console.log("Edit:", transaction)
            }
            onDelete={(id: string) =>
              setTransactions((prev: Transaction[]) =>
                prev.filter((tx) => tx.id !== id)
              )
            }
          />
          {duplicates.length > 0 && (
            <DuplicateResolver
              duplicates={duplicates}
              onResolve={handleResolveDuplicate}
            />
          )}</>
        )}
        {activeTab === "chart" && <TransactionChart transactions={filteredTransactions} />}
        {activeTab === "pie" && <Analytics transactions={filteredTransactions} />}
      </div>
    </div></BrowserRouter>
  );
};

export default App;
