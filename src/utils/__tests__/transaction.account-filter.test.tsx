import React from 'react';
import { render } from '@testing-library/react';
import * as FilterContext from '../../context/FilterContext';
import { useFilteredTransactions } from '../transaction';

const TestHookComponent: React.FC<{ transactions: any[] }> = ({ transactions }) => {
  const filtered = useFilteredTransactions(transactions as any);
  return <div data-testid="accounts">{filtered.map((tx) => tx.account).join(',')}</div>;
};

const transactions = [
  { id: 't1', date: new Date('2023-01-05'), description: '', amount: -1, category: 'miscellaneous-others', account: 'Cuenta Nómina' },
  { id: 't2', date: new Date('2023-01-06'), description: '', amount: -2, category: 'miscellaneous-others', account: 'Cuenta Ahorro' },
  { id: 't3', date: new Date('2023-01-07'), description: '', amount: -3, category: 'miscellaneous-others', account: 'Tarjeta' },
];

const renderWithAccountFilter = (account: string) => {
  vi.spyOn(FilterContext, 'useFilters').mockReturnValue({ filters: { account } } as any);
  return render(<TestHookComponent transactions={transactions} />);
};

describe('account filter (free-text input)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('matches while the user is still typing a prefix', () => {
    const { getByTestId } = renderWithAccountFilter('Cuen');
    expect(getByTestId('accounts').textContent).toBe('Cuenta Nómina,Cuenta Ahorro');
  });

  it('matches case-insensitively', () => {
    const { getByTestId } = renderWithAccountFilter('cuenta nómina');
    expect(getByTestId('accounts').textContent).toBe('Cuenta Nómina');
  });

  it('matches substrings anywhere in the account name', () => {
    const { getByTestId } = renderWithAccountFilter('ahorro');
    expect(getByTestId('accounts').textContent).toBe('Cuenta Ahorro');
  });

  it('still excludes accounts that do not match at all', () => {
    const { getByTestId } = renderWithAccountFilter('inexistente');
    expect(getByTestId('accounts').textContent).toBe('');
  });

  it('matches accent-insensitively', () => {
    const { getByTestId } = renderWithAccountFilter('nomina');
    expect(getByTestId('accounts').textContent).toBe('Cuenta Nómina');
  });

  it('treats whitespace-only input as no filter', () => {
    const { getByTestId } = renderWithAccountFilter('   ');
    expect(getByTestId('accounts').textContent).toBe('Cuenta Nómina,Cuenta Ahorro,Tarjeta');
  });

  it('ignores surrounding whitespace in the filter', () => {
    const { getByTestId } = renderWithAccountFilter('  tarjeta  ');
    expect(getByTestId('accounts').textContent).toBe('Tarjeta');
  });
});
