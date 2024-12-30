import { Transaction } from "../models/transaction";

export const findDuplicates = (
    newTransactions: Transaction[],
    existingTransactions: Transaction[]
): Transaction[] => {
    return newTransactions.filter((newTx) =>
        existingTransactions.some(
            (existingTx) =>
                newTx.date.toISOString() === existingTx.date.toISOString() &&
                newTx.amount === existingTx.amount &&
                newTx.account === existingTx.account
        )
    );
};