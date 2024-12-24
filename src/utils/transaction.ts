import { Transaction } from "../models/transaction";
import { saveTransactionsToFile, loadTransactionsFromFile, saveTransactionsFallback, msgpackTransformer, jsonTransformer } from "./message-pack";
import { useFilters } from "../context/FilterContext";

const normalizeKeys = (obj: any): any => {
    if (Array.isArray(obj)) {
        return obj.map(normalizeKeys);
    } else if (obj !== null && typeof obj === "object") {
        return Object.keys(obj).reduce((acc, key) => {
            acc[key.toLowerCase()] = normalizeKeys(obj[key]);
            return acc;
        }, {} as any);
    }
    return obj;
};

export async function saveFile(transactions: any[]) {
    if ("showSaveFilePicker" in window) {
        try {
            const fileHandle = await (window as any).showSaveFilePicker({
                suggestedName: "transactions.msgpack",
                types: [
                    {
                        description: "MessagePack File",
                        accept: { "application/octet-stream": [".msgpack"] },
                    },
                ],
            });

            // Save using File System Access API
            saveTransactionsToFile(transactions, fileHandle);
        } catch (err) {
            console.error("Error saving file:", err);
        }
    } else {
        // Fallback to Blob-based download
        saveTransactionsFallback(transactions);
    }
}

export async function loadFile(): Promise<Transaction[]> {
    const [fileHandle]: FileSystemFileHandle[] = await (window as any).showOpenFilePicker({
        types: [
            {
                description: "MessagePack File",
                accept: { "application/octet-stream": [".msgpack"] },
            },
            {
                description: "JSON File",
                accept: { "application/json": [".json"] },
            },
        ],
    });

    let transformer: (file: File) => Promise<Transaction[]>;
    if ((await fileHandle.getFile()).name.includes(".msgpack")) {
        transformer = msgpackTransformer;
    } else {
        transformer = jsonTransformer;
    }
    return normalizeKeys(await loadTransactionsFromFile(fileHandle, transformer)) as Transaction[];
}

export const useFilteredTransactions = (transactions: Transaction[]) => {
    const { filters } = useFilters();

    return transactions.filter((transaction: Transaction) => {
        if (filters.dateRange) {
            const date = new Date(transaction.date);
            if (date < filters.dateRange.start || date > filters.dateRange.end) {
                return false;
            }
        }
        if (filters.account && transaction.account !== filters.account) {
            return false;
        }
        if (filters.category && transaction.category !== filters.category) {
            return false;
        }
        if (filters.type === 'positive' && transaction.amount < 0) {
            return false;
        } if (filters.type === 'negative' && transaction.amount > 0) {
            return false;
        }
        return true;
    });
};