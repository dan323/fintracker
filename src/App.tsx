import React, { useState, Suspense } from "react";
import ErrorBoundary from "./components/common/ErrorBoundary";
import CsvUploader from "./components/CsvUploader";
import DuplicateResolver from "./components/DuplicateResolver";
import Filtering from "./components/Filtering";
import TransactionTable from "./components/table/TransactionTable";
const PieChartCategoryAccount = React.lazy(() => import("./components/pie-charts/PieChartCategoryAccount"));
const TransactionChart = React.lazy(() => import("./components/bar-charts/TransactionChart"));
const CarbonFootPrint = React.lazy(() => import("./components/line-charts/CarbonFootPrint"));
import { Transaction } from "./models/transaction";
import { findDuplicates, isDuplicateOf } from "./utils/deduplicate";
import { isFilePickerCancel, loadFile, saveFile, useFilteredTransactions } from "./utils/transaction";
import "./App.css";
import TabSelector from "./components/TabSelector";
import { BrowserRouter } from "react-router-dom";
import { useTranslation } from "./i18n";
import LanguageSwitcher from "./components/LanguageSwitcher";

const App: React.FC = () => {
  const { t } = useTranslation();
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
      if (!isFilePickerCancel(error)) {
        console.log("Error loading file:", error);
        setError(t('error.load'));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Save transactions to a local msgpack file
  const saveTransactions = async (transactionsToSave: Transaction[] = transactions) => {
    try {
      setIsLoading(true);
      setError(null);
      await saveFile(transactionsToSave);
    } catch (error) {
      if (!isFilePickerCancel(error)) {
        console.log("Error saving file:", error);
        setError(t('error.save'));
      }
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

    // setTransactions is async: build the updated list explicitly so the
    // auto-save below persists the newly imported transactions too.
    const updatedTransactions = [...transactions, ...nonDuplicates];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const handleResolveDuplicate = (
    transaction: Transaction,
    action: "keep" | "replace" | "ignore"
  ) => {
    if (action === "keep") {
      setTransactions((prev) => [...prev, transaction]);
    } else if (action === "replace") {
      // The incoming duplicate has a freshly generated id, so it can never
      // match an existing transaction by id. Locate the existing transaction
      // through the duplicate key (date + amount + account) instead. Only the
      // first match is replaced: several existing rows can share the key
      // (e.g. after "keep"), and replacing them all would clone the incoming
      // id across rows.
      setTransactions((prev) => {
        const index = prev.findIndex((tx) => isDuplicateOf(tx, transaction));
        if (index === -1) {
          return prev;
        }
        const next = [...prev];
        next[index] = transaction;
        return next;
      });
    }

    setDuplicates((prev) => prev.filter((dup) => dup.id !== transaction.id));
  };

  return (
    <ErrorBoundary>
    <BrowserRouter basename={import.meta.env.BASE_URL || '/'}>
      <div className="app-container">
        <header className="app-header">
          <h1 className="app-title">{t('app.title')}</h1>
          <div className="app-controls">
            <button className="action-button" onClick={loadTransactions}>
              {isLoading ? t('loading.thinking') : t('action.upload')}
            </button>
            <button className="action-button" onClick={() => saveTransactions()}>
              {isLoading ? t('loading.thinking') : t('action.save')}
            </button>
            <CsvUploader onUpload={handleUpload} disabled={isLoading} />
            <LanguageSwitcher />
          </div>
        </header>
        {error && (
            <div className="error-message">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
          {isLoading && <div className="loading-spinner">{t('loading')}</div>}
        <Filtering />
        <TabSelector activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="tab-content">
          {activeTab === "table" && (
            <>
              <TransactionTable
                transactions={filteredTransactions}
                onEdit={(updated: Transaction) =>
                  setTransactions((prev) =>
                    prev.map((tx) => (tx.id === updated.id ? updated : tx))
                  )
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
            <Suspense fallback={<div>{t('loading')}</div>}>
              <TransactionChart transactions={filteredTransactions} />
            </Suspense>
          )}
          {activeTab === "pie" && (
            <Suspense fallback={<div>{t('loading')}</div>}>
              <PieChartCategoryAccount transactions={filteredTransactions} />
            </Suspense>
          )}
          {activeTab === "carbon" && (
            <Suspense fallback={<div>{t('loading')}</div>}>
              <CarbonFootPrint transactions={filteredTransactions} />
            </Suspense>
          )}
        </div>
      </div>
    </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
