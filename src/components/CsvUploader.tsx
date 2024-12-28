import React from "react";
import Papa from "papaparse";
import { Transaction } from "../models/transaction";

interface Props {
    onUpload: (transactions: Transaction[]) => void;
}

interface PreTransaction {
    amount: string,
    date: string,
    description?: string,
    category?: string,
    account?: string,
}

const CsvUploader: React.FC<Props> = ({ onUpload }) => {
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: (results: Papa.ParseResult<PreTransaction>) => {
                    const transactions: Transaction[] = results.data.map((row: PreTransaction) => ({
                        id: crypto.randomUUID(),
                        date: row.date,
                        description: row.description || "",
                        amount: parseFloat(row.amount),
                        category: row.category || "Others",
                        account: row.account || "Desconocida",
                    }));
                    onUpload(transactions);
                },
            });
        }
    };

    return <input type="file" accept=".csv" onChange={handleFileChange} />;
};

export default CsvUploader;