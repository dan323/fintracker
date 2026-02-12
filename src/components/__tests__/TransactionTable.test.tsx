// Replacing empty file with test content
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TransactionTable from '../table/TransactionTable';
import { Transaction } from '../../models/transaction';

// Mock useTranslation to return identity function for t
vi.mock('../../i18n', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

describe('TransactionTable', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls onEdit and onDelete when edit/delete buttons are clicked', () => {
    const tx: Transaction = {
      id: 'tx1',
      date: new Date('2023-02-02'),
      description: 'Coffee',
      amount: -3.5,
      category: 'food',
      account: 'card',
    };

    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const { getByText } = render(
      <TransactionTable transactions={[tx]} onEdit={onEdit} onDelete={onDelete} />
    );

    fireEvent.click(getByText('table.edit'));
    expect(onEdit).toHaveBeenCalledWith(tx);

    fireEvent.click(getByText('table.delete'));
    expect(onDelete).toHaveBeenCalledWith(tx.id);
  });
});

