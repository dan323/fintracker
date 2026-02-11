import React, { useState } from "react";
import "./transaction-table.css";
import { Transaction } from "../../models/transaction";
import ToggleMultiple from "../toggle-switch/ToggleMultiple";
import { useTranslation } from '../../i18n';

interface Props {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<"" | "positive" | "negative">("");

  const sortedTransactions = transactions.filter((tx) => {
    if (type === 'negative') {
      return tx.amount < 0;
    } else if (type === 'positive') {
      return tx.amount > 0;
    } else {
      return true;
    }
  }).sort((t1, t2) => new Date(t1.date).getTime() - new Date(t2.date).getTime());

  const map: Map<string,string> = new Map();
  map.set('', t('chart.toggle.total'));
  map.set('positive', t('chart.toggle.positive'));
  map.set('negative', t('chart.toggle.negative'));

  return (
    <div>
      {/* Toggle Switch */}
      <ToggleMultiple className="toggle-container" label={t('chart.toggle.show')} states={['','positive','negative']} stateTexts={map} onToggle={(st) => setType(st as ("" | "negative" | "positive"))}/>

      {/* Transaction Table */}
      <table className="transaction-table">
        <thead>
          <tr key="header-row">
            <th>{t('table.date')}</th>
            <th>{t('table.description')}</th>
            <th>{t('table.amount')}</th>
            <th>{t('table.category')}</th>
            <th>{t('table.account')}</th>
            <th>{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx: Transaction) =>
          (<tr key={tx.id}>
            <td>{`${tx.date.toISOString().slice(0, 10)}`}</td>
            <td>{tx.description}</td>
            <td>{tx.amount.toFixed(2)}</td>
            <td>{tx.category}</td>
            <td>{tx.account}</td>
            <td>
              <button className="edit-btn" onClick={() => onEdit(tx)}>
                {t('table.edit')}
              </button>
              <button className="delete-btn" onClick={() => onDelete(tx.id)}>
                {t('table.delete')}
              </button>
            </td>
          </tr>
          ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;