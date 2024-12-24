import * as msgpack from "@msgpack/msgpack";
import { Transaction } from "../models/transaction";

export async function saveTransactionsToFile(transactions: any[], fileHandle: FileSystemFileHandle) {
    const serialized = msgpack.encode(transactions); // Convert transactions to MessagePack binary
    const writableStream = await (fileHandle as any).createWritable();
    await writableStream.write(serialized); // Write binary data to the file
    await writableStream.close();
}

export async function saveTransactionsFallback(transactions: any[]) {
    const serialized = msgpack.encode(transactions); // Serialize transactions to MessagePack
    const blob = new Blob([serialized], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
  
    const a = document.createElement("a");
    a.href = url;
    a.download = "transactions.msgpack"; // Default file name
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
export async function loadTransactionsFromFile(fileHandle: FileSystemFileHandle, transformer: (f: File) => Promise<Transaction[]>): Promise<any[]> {
    return fileHandle.getFile().then(transformer);
}

export async function msgpackTransformer(file: File): Promise<Transaction[]> {
    const arrayBuffer = await file.arrayBuffer(); // Read file as an ArrayBuffer
    return (msgpack.decode(new Uint8Array(arrayBuffer)) as Transaction[]).map((tx, index) => {
        if (tx.id){
            return tx;
        } else {
            return {
                ...tx,
                id: String(index),
            }
        }
    }); // Decode binary back to JavaScript
}

export async function jsonTransformer(file: File): Promise<Transaction[]> {
    const text = await file.text(); // Read file contents as text
    const data = JSON.parse(text); // Parse the text as JSON
  
    return data as Transaction[];
}