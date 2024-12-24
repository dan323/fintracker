import { Transaction } from "../../models/transaction";

export const mockTransactions: Transaction[] = [
    {
      id: "1",
      date: "2023-12-01",
      description: "Supermercado",
      amount: -50.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
  ];