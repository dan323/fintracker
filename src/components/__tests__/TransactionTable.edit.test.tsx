import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TransactionTable from '../table/TransactionTable';
import { I18nProvider } from '../../i18n';
import { Transaction } from '../../models/transaction';

const transaction: Transaction = {
  id: 'tx-1',
  date: new Date('2024-03-01T00:00:00.000Z'),
  description: 'Original description',
  amount: -42.5,
  category: 'miscellaneous-others',
  account: 'main',
};

const renderTable = (onEdit = vi.fn(), onDelete = vi.fn(), transactions = [transaction]) => {
  render(
    <I18nProvider>
      <TransactionTable transactions={transactions} onEdit={onEdit} onDelete={onDelete} />
    </I18nProvider>
  );
  return { onEdit, onDelete };
};

describe('inline transaction editing', () => {
  beforeEach(() => {
    // The tests assert Spanish UI strings; pin the locale so a stray
    // localStorage value can never make the suite order-dependent.
    window.localStorage.setItem('fintracker_locale', 'es');
  });
  it('saves the edited fields through onEdit', () => {
    const { onEdit } = renderTable();

    fireEvent.click(screen.getByText('Editar'));

    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Updated description' },
    });
    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '-10.25' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onEdit).toHaveBeenCalledTimes(1);
    const updated = onEdit.mock.calls[0][0] as Transaction;
    expect(updated.id).toBe('tx-1');
    expect(updated.description).toBe('Updated description');
    expect(updated.amount).toBeCloseTo(-10.25);
    expect(updated.date.toISOString().slice(0, 10)).toBe('2024-03-01');
  });

  it('cancel discards the draft without calling onEdit', () => {
    const { onEdit } = renderTable();

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Discarded' },
    });
    fireEvent.click(screen.getByText('Cancelar'));

    expect(onEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Original description')).toBeTruthy();
  });

  it('preserves the original timestamp when the day is not changed', () => {
    const timed: Transaction = {
      ...transaction,
      id: 'tx-timed',
      date: new Date('2024-03-01T15:30:45.000Z'),
    };
    const { onEdit } = renderTable(vi.fn(), vi.fn(), [timed]);

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByLabelText('Descripción'), {
      target: { value: 'Only description changed' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    const updated = onEdit.mock.calls[0][0] as Transaction;
    expect(updated.date.toISOString()).toBe('2024-03-01T15:30:45.000Z');
  });

  it('uses the new day when the date is edited', () => {
    const { onEdit } = renderTable();

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByLabelText('Fecha'), {
      target: { value: '2024-04-15' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    const updated = onEdit.mock.calls[0][0] as Transaction;
    expect(updated.date.toISOString().slice(0, 10)).toBe('2024-04-15');
  });

  it('does not save when the amount is not a number', () => {
    const { onEdit } = renderTable();

    fireEvent.click(screen.getByText('Editar'));
    fireEvent.change(screen.getByLabelText('Monto'), {
      target: { value: '' },
    });
    fireEvent.click(screen.getByText('Guardar'));

    expect(onEdit).not.toHaveBeenCalled();
  });
});
