import { useMemo } from "react";
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
    if ((window as any).showOpenFilePicker) {
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
    } else {
        alert('Your browser does not support advanced file selection. Using fallback.');
        return new Promise((resolve, reject) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = ".msgpack,.json"; // Supported file types

            input.onchange = async () => {
                if (input.files && input.files[0]) {
                    try {
                        const file = input.files[0];
                        let transformer: (file: File) => Promise<Transaction[]>;
                        if (file.name.endsWith(".msgpack")) {
                            transformer = msgpackTransformer;
                        } else {
                            transformer = jsonTransformer;
                        }
                        const transactions = await transformer(file);
                        resolve(normalizeKeys(transactions) as Transaction[]);
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error("No file selected."));
                }
            };

            input.click(); // Trigger file picker dialog
        });
    }
}

export const useFilteredTransactions = (transactions: Transaction[]) => {
    const { filters } = useFilters();

    return useMemo(() => {
        console.log("Recomputing filtered transactions...");
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
            return true;
        });
    },[transactions,filters]);
};