import { msgpackTransformer, jsonTransformer, loadTransactionsFromFile, saveTransactionsToFile, saveTransactionsFallback } from '../message-pack';
import * as msgpack from '@msgpack/msgpack';
import { Transaction } from '../../models/transaction';

describe('message-pack utils', () => {
  it('msgpackTransformer decodes a msgpack file and assigns ids when missing', async () => {
    const transactions: any[] = [
      { id: 'a', date: new Date('2023-01-01').toISOString(), amount: -10, category: 'miscellaneous-others', description: 'x', account: 'c' },
      { date: new Date('2023-01-02').toISOString(), amount: -20, category: 'shopping', description: 'y', account: 'c' },
    ];

    const encoded = msgpack.encode(transactions); // Uint8Array
    const arrayBuffer = encoded.buffer.slice(encoded.byteOffset, encoded.byteOffset + encoded.byteLength);

    // Create a file-like object with arrayBuffer() method (jsdom File may not implement it in this environment)
    const fileLike: any = {
      arrayBuffer: async () => arrayBuffer,
      name: 'transactions.msgpack',
      type: 'application/octet-stream'
    };

    const result = await msgpackTransformer(fileLike as File);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('a');
    expect(typeof result[1].id).toBe('string');
    expect(result[1].id).toBe('1');
  });

  it('jsonTransformer parses JSON file', async () => {
    const transactions: Transaction[] = [
      { id: '1', date: new Date('2023-01-01'), description: 't', amount: -5, category: 'miscellaneous-others', account: 'a' }
    ];

    // file-like object with text() method
    const fileLike: any = {
      text: async () => JSON.stringify(transactions),
      name: 'transactions.json',
      type: 'application/json'
    };

    const result = await jsonTransformer(fileLike as File);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('loadTransactionsFromFile uses the transformer with given fileHandle', async () => {
    const mockFile = { text: async () => JSON.stringify([]) } as any;
    const fileHandle = { getFile: vi.fn().mockResolvedValue(mockFile) } as any;

    const transformer = vi.fn().mockResolvedValue([{ id: 'x', date: new Date('2023-01-01'), description: '', amount: -1, category: 'miscellaneous-others', account: 'a' }]);

    const result = await loadTransactionsFromFile(fileHandle, transformer);
    expect(fileHandle.getFile).toHaveBeenCalled();
    expect(transformer).toHaveBeenCalledWith(mockFile);
    expect(result).toBeDefined();
    expect(result.length).toBe(1);
  });

  it('saveTransactionsToFile writes msgpack bytes to writable', async () => {
    const transactions = [{ id: '1', date: new Date('2023-01-01'), description: 't', amount: -5, category: 'miscellaneous-others', account: 'a' }];

    let writtenData: any = null;
    const writable = {
      write: vi.fn().mockImplementation(async (data: any) => { writtenData = data; }),
      close: vi.fn().mockResolvedValue(undefined)
    };
    const fileHandle = { createWritable: vi.fn().mockResolvedValue(writable) } as any;

    await saveTransactionsToFile(transactions, fileHandle);

    expect(fileHandle.createWritable).toHaveBeenCalled();
    expect(writable.write).toHaveBeenCalled();
    // decode writtenData and compare
    const decoded = msgpack.decode(writtenData as Uint8Array);
    expect(decoded.length).toBe(1);
    expect(decoded[0].description).toBe('t');
    expect(writable.close).toHaveBeenCalled();
  });

  it('saveTransactionsFallback creates an anchor and revokes the object URL', async () => {
    const transactions = [{ id: '1', date: new Date('2023-01-01'), description: 't', amount: -5, category: 'miscellaneous-others', account: 'a' }];

    // Ensure URL.createObjectURL/revokeObjectURL exist in this environment
    (globalThis as any).URL = (globalThis as any).URL || {};
    (globalThis as any).URL.createObjectURL = vi.fn().mockReturnValue('blob:mock');
    (globalThis as any).URL.revokeObjectURL = vi.fn();

    const appendSpy = vi.spyOn(document.body, 'appendChild');
    const removeSpy = vi.spyOn(document.body, 'removeChild');

    await saveTransactionsFallback(transactions);

    expect((globalThis as any).URL.createObjectURL).toHaveBeenCalled();
    expect((globalThis as any).URL.revokeObjectURL).toHaveBeenCalled();
    expect(appendSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveBeenCalled();

    appendSpy.mockRestore();
    removeSpy.mockRestore();
  });
});

