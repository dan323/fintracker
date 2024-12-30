import { useMemo } from "react";
import { Transaction } from "../models/transaction";
import { categories } from "../models/categories";
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

/**
 * Helper function to check if a category matches or belongs to any of the provided categories or their subcategories.
 */
const isCategoryMatch = (
    transactionCategory: string,
    filterCategories: string[]
): boolean => {
    // Iterate over the list of categories and check if the transactionCategory matches any category or its subcategories
    return filterCategories.some((filterCategory) =>
        matchCategory(transactionCategory, filterCategory)
    );
};

/**
 * Helper function to recursively check if a category matches or belongs to its subcategories.
 */
const matchCategory = (
    transactionCategory: string,
    category: string
): boolean => {
    if (transactionCategory === category) {
        return true;
    }
    if (!categories[transactionCategory]) {
        return category === 'Others';
    }

    if (categories[transactionCategory].parentId) {
        return matchCategory(categories[transactionCategory].parentId, category);
    } else {
        return false;
    }
};

export const useFilteredTransactions = (transactions: Transaction[]) => {
    const { filters } = useFilters();

    return useMemo(() => {
        if (process.env.NODE_ENV === 'development') {
            console.log("Recomputing filtered transactions...");
        }

        return transactions.filter((transaction) => {
            // Filter by date range
            if (filters.dateRange) {
                const transactionDate = new Date(transaction.date);
                const { start, end } = filters.dateRange;
                if (transactionDate < start || transactionDate > end) {
                    return false;
                }
            }

            // Filter by account
            if (filters.account && transaction.account !== filters.account) {
                return false;
            }

            // Filter by category or subcategory
            if (filters.categories && filters.categories.length > 0) {
                const filterCategories = filters.categories;
                if (!isCategoryMatch(transaction.category, filterCategories)) {
                    return false;
                }
            }

            return true; // Passes all filters
        });
    }, [transactions, filters]);
};
