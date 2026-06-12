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

interface Draft {
  date: string;
  description: string;
  amount: string;
  category: string;
  account: string;
}

const toDraft = (tx: Transaction): Draft => ({
  date: tx.date.toISOString().slice(0, 10),
  description: tx.description,
  amount: String(tx.amount),
  category: tx.category,
  account: tx.account,
});

const isDraftValid = (draft: Draft): boolean =>
  !Number.isNaN(parseFloat(draft.amount)) &&
  !Number.isNaN(new Date(draft.date).getTime());

const TransactionTable: React.FC<Props> = ({ transactions, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const [type, setType] = useState<"" | "positive" | "negative">("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);

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

  const startEditing = (tx: Transaction) => {
    setEditingId(tx.id);
    setDraft(toDraft(tx));
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEditing = (tx: Transaction) => {
    if (!draft || !isDraftValid(draft)) {
      return;
    }
    // The date input only carries the day; keep the original timestamp
    // (which may include a time component) when the day was not changed.
    const originalDay = tx.date.toISOString().slice(0, 10);
    onEdit({
      ...tx,
      date: draft.date === originalDay ? tx.date : new Date(draft.date),
      description: draft.description,
      amount: parseFloat(draft.amount),
      category: draft.category,
      account: draft.account,
    });
    cancelEditing();
  };

  const updateDraft = (field: keyof Draft, value: string) =>
    setDraft((prev) => (prev ? { ...prev, [field]: value } : prev));

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
            <th className="amount">{t('table.amount')}</th>
            <th>{t('table.category')}</th>
            <th>{t('table.account')}</th>
            <th>{t('table.actions')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedTransactions.map((tx: Transaction) =>
            editingId === tx.id && draft ? (
              <tr key={tx.id} className="editing-row">
                <td>
                  <input
                    type="date"
                    aria-label={t('table.date')}
                    value={draft.date}
                    onChange={(e) => updateDraft('date', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    aria-label={t('table.description')}
                    value={draft.description}
                    onChange={(e) => updateDraft('description', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    step="0.01"
                    aria-label={t('table.amount')}
                    value={draft.amount}
                    onChange={(e) => updateDraft('amount', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    aria-label={t('table.category')}
                    value={draft.category}
                    onChange={(e) => updateDraft('category', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    aria-label={t('table.account')}
                    value={draft.account}
                    onChange={(e) => updateDraft('account', e.target.value)}
                  />
                </td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => saveEditing(tx)}
                    disabled={!isDraftValid(draft)}
                  >
                    {t('table.save')}
                  </button>
                  <button className="cancel-btn" onClick={cancelEditing}>
                    {t('table.cancel')}
                  </button>
                </td>
              </tr>
            ) : (
              <tr key={tx.id}>
                <td className="date">{`${tx.date.toISOString().slice(0, 10)}`}</td>
                <td>{tx.description}</td>
                <td className={`amount ${tx.amount < 0 ? "debit" : "credit"}`}>
                  {tx.amount.toFixed(2)}
                </td>
                <td>{tx.category}</td>
                <td>{tx.account}</td>
                <td>
                  <button className="edit-btn" onClick={() => startEditing(tx)}>
                    {t('table.edit')}
                  </button>
                  <button className="delete-btn" onClick={() => onDelete(tx.id)}>
                    {t('table.delete')}
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionTable;
