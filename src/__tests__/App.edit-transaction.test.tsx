import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { I18nProvider } from '../i18n';
import { FilterProvider } from '../context/FilterContext';
import { Transaction } from '../models/transaction';

vi.mock('../utils/transaction', async () => {
  const actual = await vi.importActual<typeof import('../utils/transaction')>('../utils/transaction');
  return {
    ...actual,
    loadFile: vi.fn(() => Promise.resolve()),
    saveFile: vi.fn(() => Promise.resolve()),
  };
});

const importedTransaction: Transaction = {
  id: 'tx-1',
  date: new Date('2024-03-01T00:00:00.000Z'),
  description: 'Original description',
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

describe('editing a transaction from the table', () => {
  beforeEach(() => {
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it('updates the transaction in the app state', async () => {
    render(
      <I18nProvider>
        <FilterProvider>
          <App />
        </FilterProvider>
      </I18nProvider>
    );

    fireEvent.click(screen.getByText('mock-csv-upload'));
    expect(screen.getByText('Original description')).toBeTruthy();

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Edited description' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    await waitFor(() => {
      expect(screen.getByText('Edited description')).toBeTruthy();
      expect(screen.queryByText('Original description')).toBeNull();
    });
  });
});
