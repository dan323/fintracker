import { loadFile } from '../transaction';
import * as mp from '../message-pack';

describe('loadFile branches', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    delete (globalThis as any).showOpenFilePicker;
    delete (globalThis as any).alert;
  });

  it('uses showOpenFilePicker and handles .msgpack files', async () => {
    const fakeFileHandle = {
      getFile: vi.fn().mockResolvedValue({ name: 'transactions.msgpack' } as any)
    } as any;

    (globalThis as any).showOpenFilePicker = vi.fn().mockResolvedValue([fakeFileHandle]);

    const rawTx = [{ DATE: '2023-02-01', AMOUNT: '10', description: 'x', category: 'miscellaneous-others', account: 'a' }];
    vi.spyOn(mp, 'loadTransactionsFromFile').mockResolvedValue(rawTx as any);

    const result = await loadFile();

    expect((globalThis as any).showOpenFilePicker).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].date instanceof Date).toBe(true);
    expect(typeof result[0].amount).toBe('number');
  });

  it('uses showOpenFilePicker and handles .json files', async () => {
    const fakeFileHandle = {
      getFile: vi.fn().mockResolvedValue({ name: 'transactions.json' } as any)
    } as any;

    (globalThis as any).showOpenFilePicker = vi.fn().mockResolvedValue([fakeFileHandle]);

    const rawTx = [{ DATE: '2023-03-01', AMOUNT: '20', description: 'y', category: 'miscellaneous-others', account: 'a' }];
    vi.spyOn(mp, 'loadTransactionsFromFile').mockResolvedValue(rawTx as any);

    const result = await loadFile();

    expect((globalThis as any).showOpenFilePicker).toHaveBeenCalled();
    expect(result).toHaveLength(1);
    expect(result[0].date instanceof Date).toBe(true);
    expect(typeof result[0].amount).toBe('number');
  });

  it('falls back to input file picker and uses msgpack transformer', async () => {
    // remove showOpenFilePicker to force fallback
    delete (globalThis as any).showOpenFilePicker;

    const fileLike: any = {
      name: 'transactions.msgpack',
      type: 'application/octet-stream'
    };

    // Mock document.createElement to return an input-like element
    const inputMock: any = {
      type: '',
      accept: '',
      files: [fileLike],
      onchange: null as any,
      click() {
        // simulate user selecting file by calling onchange
        if (this.onchange) this.onchange();
      }
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag: string) => {
      if (tag === 'input') return inputMock as any;
      return document.createElement(tag as any);
    });

    // Mock alert to avoid jsdom Not implemented error
    (globalThis as any).alert = vi.fn();

    const transformed = [{ DATE: '2023-04-01', AMOUNT: '30', description: 'z', category: 'miscellaneous-others', account: 'a' }];
    vi.spyOn(mp, 'msgpackTransformer').mockResolvedValue(transformed as any);

    const result = await loadFile();

    expect(result).toHaveLength(1);
    expect(result[0].date instanceof Date).toBe(true);
    expect(typeof result[0].amount).toBe('number');
  });
});
