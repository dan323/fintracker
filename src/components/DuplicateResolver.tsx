import React from "react";
import { Transaction } from "../models/transaction";
import { useTranslation } from "../i18n";

interface Props {
    duplicates: Transaction[];
    onResolve: (transaction: Transaction, action: "keep" | "replace" | "ignore") => void;
}

const DuplicateResolver: React.FC<Props> = ({ duplicates, onResolve }) => {
    const { t } = useTranslation();
    return (
        <div>
            <h3>{t('duplicates.detected')}</h3>
            {duplicates.map((tx) => (
                <div key={tx.id}>
                    <p>
                        {tx.date.toISOString()} - {tx.description} - {tx.amount}
                    </p>
                    <button onClick={() => onResolve(tx, "keep")}>{t('duplicate.keep')}</button>
                    <button onClick={() => onResolve(tx, "replace")}>{t('duplicate.replace')}</button>
                    <button onClick={() => onResolve(tx, "ignore")}>{t('duplicate.ignore')}</button>
                </div>
            ))}
        </div>
    );
};

export default DuplicateResolver;