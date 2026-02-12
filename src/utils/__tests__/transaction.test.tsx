import { normalizeTransaction, normalizeTransactions } from '../transaction';
import { Transaction } from '../../models/transaction';
import { CarbonCalculator } from '../carbon-calculator';
import React from 'react';
import { render } from '@testing-library/react';
import * as FilterContext from '../../context/FilterContext';
import { useFilteredTransactions } from '../transaction';

const TestHookComponent: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  const filtered = useFilteredTransactions(transactions as any);
  return <div data-testid="count">{filtered.length}</div>;
};

describe('normalizeTransaction', () => {
  it('converts string date and amount to proper types', () => {
    const raw = {
      id: '1',
      date: '2023-12-01T00:00:00.000Z',
      description: 'Test',
      amount: '123.45',
      category: 'miscellaneous-others',
      account: 'Cuenta',
    };

    const tx = normalizeTransaction(raw);
    expect(tx.date instanceof Date).toBe(true);
    expect(typeof tx.amount).toBe('number');
    expect(tx.amount).toBeCloseTo(123.45);
  });

  it('leaves Date and number unchanged', () => {
    const raw: any = {
      id: '2',
      date: new Date('2023-12-01'),
      description: 'Test2',
      amount: -50,
      category: 'shopping',
      account: 'Cuenta2',
    };

    const tx = normalizeTransaction(raw);
    expect(tx.date instanceof Date).toBe(true);
    expect(tx.amount).toBe(-50);
  });
});

describe('normalizeTransactions', () => {
  it('normalizes an array', () => {
    const arr = [
      {
        id: '1',
        date: '2023-12-01',
        amount: '10.5',
        description: '',
        category: 'miscellaneous-others',
        account: 'a'
      }
    ];

    const res = normalizeTransactions(arr);
    expect(res).toHaveLength(1);
    expect(res[0].amount).toBeCloseTo(10.5);
    expect(res[0].date instanceof Date).toBe(true);
  });
});

describe('useFilteredTransactions', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('filters by date range', () => {
    const transactions = [
      { id: 't1', date: new Date('2023-01-05'), description: '', amount: -1, category: 'miscellaneous-others', account: 'a' },
      { id: 't2', date: new Date('2023-02-05'), description: '', amount: -2, category: 'miscellaneous-others', account: 'a' }
    ];

    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { dateRange: { start: new Date('2023-01-01'), end: new Date('2023-01-31') } } } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    expect(getByTestId('count').textContent).toBe('1');
  });

  it('filters by account', () => {
    const transactions = [
      { id: 't1', date: new Date('2023-01-05'), description: '', amount: -1, category: 'miscellaneous-others', account: 'a' },
      { id: 't2', date: new Date('2023-01-06'), description: '', amount: -2, category: 'miscellaneous-others', account: 'b' }
    ];

    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { account: 'a' } } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    expect(getByTestId('count').textContent).toBe('1');
  });

  it('filters by category and matches parent category', () => {
    const transactions = [
      { id: 't1', date: new Date('2023-01-05'), description: '', amount: -1, category: 'food-and-dining-groceries-meat-products', account: 'a' },
      { id: 't2', date: new Date('2023-01-06'), description: '', amount: -2, category: 'shopping-clothing', account: 'a' }
    ];

    // Filter for top-level food-and-dining should match the meat-products subcategory
    vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { categories: ['food-and-dining'] } } as any);

    const { getByTestId } = render(<TestHookComponent transactions={transactions} />);
    expect(getByTestId('count').textContent).toBe('1');
  });
});

