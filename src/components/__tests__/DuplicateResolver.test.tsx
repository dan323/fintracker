// Replacing empty file with test content
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DuplicateResolver from '../DuplicateResolver';
import { Transaction } from '../../models/transaction';

// Mock useTranslation to return identity function for t
vi.mock('../../i18n', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

describe('DuplicateResolver', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls onResolve with keep/replace/ignore when corresponding buttons are clicked', () => {
    const tx: Transaction = {
      id: '1',
      date: new Date('2023-01-01'),
      description: 'Sample',
      amount: 12.34,
      category: 'cat',
      account: 'acc',
    };

    const onResolve = vi.fn();

    const { getByText } = render(
      <DuplicateResolver duplicates={[tx]} onResolve={onResolve} />
    );

    // Buttons are rendered with translation keys because t returns the key
    fireEvent.click(getByText('duplicate.keep'));
    expect(onResolve).toHaveBeenCalledWith(tx, 'keep');

    fireEvent.click(getByText('duplicate.replace'));
    expect(onResolve).toHaveBeenCalledWith(tx, 'replace');

    fireEvent.click(getByText('duplicate.ignore'));
    expect(onResolve).toHaveBeenCalledWith(tx, 'ignore');
  });
});

