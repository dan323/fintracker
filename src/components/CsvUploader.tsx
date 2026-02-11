import React from "react";
import Papa from "papaparse";
import { Transaction } from "../models/transaction";
import { useTranslation } from "../i18n";

const parseDate = (dateString: string): Date => {

    // First try direct Date parsing
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
        return date;
    }

    // If that fails, try manual parsing for common formats
    if (dateString.includes('/')) {
        const parts = dateString.split('/');
        if (parts.length === 3) {
            // Assume MM/DD/YYYY format first
            const month = parseInt(parts[0]) - 1; // JavaScript months are 0-indexed
            const day = parseInt(parts[1]);
            const year = parseInt(parts[2]);
            
            const parsedDate = new Date(year, month, day);
            if (!isNaN(parsedDate.getTime())) {
                return parsedDate;
            }
        }
    }

    console.warn(`Could not parse date: ${dateString}`);
    return new Date(); // Return current date as fallback
};

interface Props {
    onUpload: (transactions: Transaction[]) => void;
    disabled?: boolean;
}

interface PreTransaction {
    amount: string,
    date: string,
    description?: string,
    category?: string,
    account?: string,
}

const CsvUploader: React.FC<Props> = ({ onUpload, disabled = false }) => {
    const { t } = useTranslation();

    const normalizeTransaction = (rawTransaction: any): Transaction => {
    return {
      ...rawTransaction,
      date: typeof rawTransaction.date === 'string' 
        ? parseDate(rawTransaction.date) 
        : rawTransaction.date,
      amount: typeof rawTransaction.amount === 'string' 
        ? parseFloat(rawTransaction.amount) 
        : rawTransaction.amount,
    };
  };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<PreTransaction>) => {
                    const transactions: any[] = results.data.map((row: PreTransaction) => ({
                        id: crypto.randomUUID(),
                        date: row.date,
                        description: row.description || "",
                        amount: row.amount,
                        category: row.category || t('categories.other'),
                        account: row.account || t('account.unknown'),
                    }));
                    onUpload(transactions.map(normalizeTransaction));
                },
            });
        }
    };

    return <input type="file" accept=".csv" onChange={handleFileChange} disabled={disabled} />;
};

export default CsvUploader;