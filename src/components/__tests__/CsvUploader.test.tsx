import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import CsvUploader from '../CsvUploader';
import Papa from 'papaparse';

// Mock useTranslation to return identity function for t
vi.mock('../../i18n', () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

describe('CsvUploader', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('parses CSV and calls onUpload with normalized transactions', async () => {
    const onUpload = vi.fn();

    // Mock Papa.parse to call complete callback
    vi.spyOn(Papa, 'parse').mockImplementation((file: any, opts: any) => {
      const results = { data: [{ amount: '12.34', date: '2023-01-02', description: 'x', category: 'c', account: 'a' }] };
      if (opts && typeof opts.complete === 'function') opts.complete(results);
      return {} as any;
    });

    const { container } = render(<CsvUploader onUpload={onUpload} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;

    // simulate file change
    const fakeFile = new File(['dummy'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(input, { target: { files: [fakeFile] } });

    await waitFor(() => expect(onUpload).toHaveBeenCalled());

    const uploaded = onUpload.mock.calls[0][0];
    expect(Array.isArray(uploaded)).toBe(true);
    expect(uploaded[0].amount).toBeCloseTo(12.34);
    expect(uploaded[0].date instanceof Date).toBe(true);
  });
});

