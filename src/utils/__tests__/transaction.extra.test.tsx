import React from 'react';
import { render } from '@testing-library/react';
import * as FilterContext from '../../context/FilterContext';
import * as mp from '../message-pack';
import { useFilteredTransactions, saveFile, normalizeTransactions } from '../transaction';

const TestHookComponent: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  const filtered = useFilteredTransactions(transactions as any);
  return <div data-testid="count">{filtered.length}</div>;
};

describe('useFilteredTransactions extra cases', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('includes transactions on boundary dates (start and end inclusive)', () => {
    const transactions = [
      { id: 't1', date: new Date('2023-01-01'), description: '', amount: -1, category: 'miscellaneous-others', account: 'a' },
      { id: 't2', date: new Date('2023-01-15'), description: '', amount: -2, category: 'miscellaneous-others', account: 'a' },
      { id: 't3', date: new Date('2023-01-31'), description: '', amount: -3, category: 'miscellaneous-others', account: 'a' }
    ];

    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { dateRange: { start: new Date('2023-01-01'), end: new Date('2023-01-31') } } } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    expect(getByTestId('count').textContent).toBe('3');
  });

  it('excludes transactions with invalid date (not Date instance)', () => {
    const transactions = [
      { id: 't1', date: '2023-01-01', description: '', amount: -1, category: 'miscellaneous-others', account: 'a' },
      { id: 't2', date: new Date('2023-01-02'), description: '', amount: -2, category: 'miscellaneous-others', account: 'a' }
    ];

    // No filters
    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: {} } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    // first entry is string date -> excluded, second included
    expect(getByTestId('count').textContent).toBe('1');
  });

  it("matches transactions with unknown category when filtering for 'Others'", () => {
    const transactions = [
      { id: 't1', date: new Date('2023-01-01'), description: '', amount: -1, category: 'non-existent-cat', account: 'a' },
      { id: 't2', date: new Date('2023-01-02'), description: '', amount: -2, category: 'shopping-clothing', account: 'a' }
    ];

    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { categories: ['Others'] } } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    expect(getByTestId('count').textContent).toBe('1');
  });
});

describe('saveFile behavior', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    // cleanup any global stubs
    delete (globalThis as any).showSaveFilePicker;
  });

  it('calls fallback when showSaveFilePicker is not available', async () => {
    // Ensure no showSaveFilePicker
    delete (globalThis as any).showSaveFilePicker;

    const fallbackSpy = vi.spyOn(mp, 'saveTransactionsFallback').mockImplementation(async () => {});

    await saveFile([]);

    expect(fallbackSpy).toHaveBeenCalled();
  });

  it('uses showSaveFilePicker path when available and calls saveTransactionsToFile', async () => {
    const fakeFileHandle = { /* dummy */ } as any;
    (globalThis as any).showSaveFilePicker = vi.fn().mockResolvedValue(fakeFileHandle);

    const toFileSpy = vi.spyOn(mp, 'saveTransactionsToFile').mockImplementation(async () => {});

    await saveFile([{ id: '1', date: new Date(), description: '', amount: -1, category: 'miscellaneous-others', account: 'a' }]);

    expect((globalThis as any).showSaveFilePicker).toHaveBeenCalled();
    expect(toFileSpy).toHaveBeenCalledWith(expect.any(Array), fakeFileHandle);
  });
});

