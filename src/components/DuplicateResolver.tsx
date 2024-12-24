import React from "react";
import { Transaction } from "../models/transaction";

interface Props {
    duplicates: Transaction[];
    onResolve: (transaction: Transaction, action: "keep" | "replace" | "ignore") => void;
}

const DuplicateResolver: React.FC<Props> = ({ duplicates, onResolve }) => {
    return (
        <div>
            <h3>Duplicados detectados</h3>
            {duplicates.map((tx) => (
                <div key={tx.id}>
                    <p>
                        {tx.date} - {tx.description} - {tx.amount}
                    </p>
                    <button onClick={() => onResolve(tx, "keep")}>Mantener</button>
                    <button onClick={() => onResolve(tx, "replace")}>Reemplazar</button>
                    <button onClick={() => onResolve(tx, "ignore")}>Ignorar</button>
                </div>
            ))}
        </div>
    );
};

export default DuplicateResolver;