import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { FilterProvider } from '../context/FilterContext';
import { Transaction } from '../models/transaction';

vi.mock('../utils/transaction', async () => {
  const actual = await vi.importActual<typeof import('../utils/transaction')>('../utils/transaction');
  return {
    ...actual,
    saveFile: vi.fn(() => Promise.resolve()),
    loadFile: vi.fn(() => Promise.resolve([])),
  };
});

const existingTransaction: Transaction = {
  id: 'existing-1',
  date: new Date('2024-03-01T00:00:00.000Z'),
  description: 'Original description',
  amount: -42.5,
  category: 'miscellaneous-others',
  account: 'main',
};

// Same duplicate key (date + amount + account) but a different id, as produced
// by a re-import of the same CSV row.
const incomingDuplicate: Transaction = {
  ...existingTransaction,
  id: 'incoming-2',
  description: 'Updated description',
};

vi.mock('../components/CsvUploader', () => ({
  default: ({ onUpload }: { onUpload: (txs: Transaction[]) => void }) => (
    <>
      <button onClick={() => onUpload([existingTransaction])}>mock-upload-original</button>
      <button onClick={() => onUpload([incomingDuplicate])}>mock-upload-duplicate</button>
    </>
  ),
}));

import App from '../App';

describe('resolving a duplicate with "replace"', () => {
  beforeEach(() => {
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it('replaces the existing transaction with the incoming one', async () => {
    render(
      <I18nProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('mock-upload-original'));
    expect(screen.getByText('Original description')).toBeTruthy();

    fireEvent.click(screen.getByText('mock-upload-duplicate'));
    expect(screen.getByText('Duplicados detectados')).toBeTruthy();

    fireEvent.click(screen.getByText('Reemplazar'));

    await waitFor(() => {
      expect(screen.getByText('Updated description')).toBeTruthy();
      expect(screen.queryByText('Original description')).toBeNull();
    });
    // The resolver entry is gone once resolved
    expect(screen.queryByText('Duplicados detectados')).toBeNull();
  });
});
