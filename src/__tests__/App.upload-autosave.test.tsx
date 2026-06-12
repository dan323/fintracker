import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { FilterProvider } from '../context/FilterContext';
import { Transaction } from '../models/transaction';

const saveFileMock = vi.fn(() => Promise.resolve());

vi.mock('../utils/transaction', async () => {
  const actual = await vi.importActual<typeof import('../utils/transaction')>('../utils/transaction');
  return {
    ...actual,
    saveFile: (...args: any[]) => saveFileMock(...args),
    loadFile: vi.fn(() => Promise.resolve([])),
  };
});

const importedTransaction: Transaction = {
  id: 'imported-1',
  date: new Date('2024-03-01T00:00:00.000Z'),
  description: 'Imported from CSV',
  amount: -42.5,
  category: 'miscellaneous-others',
  account: 'main',
};

vi.mock('../components/CsvUploader', () => ({
  default: ({ onUpload }: { onUpload: (txs: Transaction[]) => void }) => (
    <button onClick={() => onUpload([importedTransaction])}>mock-csv-upload</button>
  ),
}));

import App from '../App';

describe('auto-save after CSV import', () => {
  beforeEach(() => {
    saveFileMock.mockClear();
    // App wraps everything in <BrowserRouter basename={BASE_URL}>, which renders
    // nothing unless the URL starts with the basename.
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it('persists the freshly imported transactions, not the stale previous state', async () => {
    render(
      <I18nProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </I18nProvider>
    );

    screen.getByText('mock-csv-upload').click();

    await waitFor(() => expect(saveFileMock).toHaveBeenCalledTimes(1));

    const savedTransactions = saveFileMock.mock.calls[0][0] as Transaction[];
    expect(savedTransactions).toHaveLength(1);
    expect(savedTransactions[0].id).toBe('imported-1');
  });
});
