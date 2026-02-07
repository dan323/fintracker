import React, { useState } from "react";
import { ErrorBoundary } from "./components/common/ErrorBoundary";
import CarbonFootPrint from "./components/line-charts/CarbonFootPrint";
import CsvUploader from "./components/CsvUploader";
import DuplicateResolver from "./components/DuplicateResolver";
import Filtering from "./components/Filtering";
import TransactionTable from "./components/table/TransactionTable";
import PieChartCategoryAccount from "./components/pie-charts/PieChartCategoryAccount";
import TransactionChart from "./components/bar-charts/TransactionChart";
import { Transaction } from "./models/transaction";
import { findDuplicates } from "./utils/deduplicate";
import { loadFile, saveFile, useFilteredTransactions } from "./utils/transaction";
import "./App.css";
import TabSelector from "./components/TabSelector";
import { BrowserRouter } from "react-router-dom";

const App: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [duplicates, setDuplicates] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState<string>("table");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredTransactions = useFilteredTransactions(transactions);

  // Load transactions from a local JSON or msgpack file
  const loadTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Opening file...");
      await loadFile().then(setTransactions);
    } catch (error) {
      console.log("No file selected or error loading file:", error);
      setError("Error al cargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  // Save transactions to a local msgpack file
  const saveTransactions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await saveFile(transactions);
    } catch (error) {
      console.log("Error saving file:", error);
      setError("Error al guardar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = (newTransactions: Transaction[]) => {
    const detectedDuplicates = findDuplicates(newTransactions, transactions);
    setDuplicates(detectedDuplicates);

    const nonDuplicates = newTransactions.filter(
      (tx) => !detectedDuplicates.some((dup) => dup.id === tx.id)
    );

    setTransactions((prev) => [...prev, ...nonDuplicates]);
    saveTransactions();
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
    <ErrorBoundary>
    <BrowserRouter basename="/fintracker">
      <div className="app-container">
        <h1 className="app-title">Finanzas personales</h1>
        {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
        <div className="app-controls">
          <button className="action-button" onClick={loadTransactions}>
            {isLoading ? "Pensando..." : "Subir movimientos"}
          </button>
          <button className="action-button" onClick={saveTransactions}>
            {isLoading ? "Pensando..." : "Guardar movimientos"}
          </button>
          <CsvUploader onUpload={handleUpload} disabled={isLoading} />
        </div>
          {isLoading && <div className="loading-spinner">Cargando...</div>}
        <Filtering />
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tab-content">
          {activeTab === "table" && (
            <>
              <TransactionTable
                transactions={filteredTransactions}
                onEdit={(transaction: Transaction) =>
                  console.log("Edit:", transaction)
                }
                onDelete={(id: string) =>
                  setTransactions((prev) =>
                    prev.filter((tx) => tx.id !== id)
                  )
                }
              />
              {duplicates.length > 0 && (
                <DuplicateResolver
                  duplicates={duplicates}
                  onResolve={handleResolveDuplicate}
                />
              )}
            </>
          )}
          {activeTab === "chart" && (
            <TransactionChart transactions={filteredTransactions} />
          )}
          {activeTab === "pie" && (
            <PieChartCategoryAccount transactions={filteredTransactions} />
          )}
          {activeTab === "carbon" && (
            <CarbonFootPrint transactions={filteredTransactions} />
          )}
        </div>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
