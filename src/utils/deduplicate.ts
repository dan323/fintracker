import { Transaction } from "../models/transaction";

// Two transactions are considered duplicates of each other when date,
// amount and account all match. Ids are NOT compared: imported rows get
// freshly generated UUIDs, so id equality never holds across imports.
export const isDuplicateOf = (
    a: Transaction,
    b: Transaction
): boolean =>
    a.date.toISOString() === b.date.toISOString() &&
    a.amount === b.amount &&
    a.account === b.account;

export const findDuplicates = (
    newTransactions: Transaction[],
    existingTransactions: Transaction[]
): Transaction[] => {
    return newTransactions.filter((newTx) =>
        existingTransactions.some((existingTx) => isDuplicateOf(newTx, existingTx))
    );
};