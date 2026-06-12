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

// Defined via vi.hoisted: vi.mock factories are hoisted above top-level
// declarations and must not close over uninitialized bindings.
const { existingTransaction, firstDuplicate, secondDuplicate } = vi.hoisted(() => {
  const existingTransaction = {
    id: 'existing-1',
    date: new Date('2024-03-01T00:00:00.000Z'),
    description: 'Original description',
    amount: -42.5,
    category: 'miscellaneous-others',
    account: 'main',
  };
  return {
    existingTransaction,
    // Same duplicate key (date + amount + account) but different ids, as
    // produced by re-imports of the same CSV row.
    firstDuplicate: { ...existingTransaction, id: 'incoming-2', description: 'Updated description' },
    secondDuplicate: { ...existingTransaction, id: 'incoming-3', description: 'Third description' },
  };
});

vi.mock('../components/CsvUploader', () => ({
  default: ({ onUpload }: { onUpload: (txs: Transaction[]) => void }) => (
    <>
      <button onClick={() => onUpload([existingTransaction])}>mock-upload-original</button>
      <button onClick={() => onUpload([firstDuplicate])}>mock-upload-duplicate</button>
      <button onClick={() => onUpload([secondDuplicate])}>mock-upload-second-duplicate</button>
    </>
  ),
}));

import App from '../App';

const renderApp = () =>
  render(
    <I18nProvider>
      <FilterProvider>
        <App />
      </FilterProvider>
    </I18nProvider>
  );

describe('resolving a duplicate with "replace"', () => {
  beforeEach(() => {
    // The tests assert Spanish UI strings; pin the locale so a stray
    // localStorage value can never make the suite order-dependent.
    window.localStorage.setItem('fintracker_locale', 'es');
    window.history.pushState({}, '', import.meta.env.BASE_URL || '/');
  });

  it('replaces the existing transaction with the incoming one', async () => {
    renderApp();

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

  it('replaces only the first row when several share the duplicate key', async () => {
    renderApp();

    fireEvent.click(screen.getByText('mock-upload-original'));
    // "Mantener" adds the incoming duplicate as a second row with the same key
    fireEvent.click(screen.getByText('mock-upload-duplicate'));
    fireEvent.click(screen.getByText('Mantener'));
    await waitFor(() => {
      expect(screen.getByText('Original description')).toBeTruthy();
      expect(screen.getByText('Updated description')).toBeTruthy();
    });

    fireEvent.click(screen.getByText('mock-upload-second-duplicate'));
    fireEvent.click(screen.getByText('Reemplazar'));

    await waitFor(() => {
      // Exactly one row (the first match) was replaced; the other survives.
      expect(screen.getByText('Third description')).toBeTruthy();
      expect(screen.queryByText('Original description')).toBeNull();
      expect(screen.getByText('Updated description')).toBeTruthy();
    });
  });
});
