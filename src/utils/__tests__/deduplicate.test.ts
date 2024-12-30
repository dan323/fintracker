import {findDuplicates} from '../deduplicate'
import { Transaction } from "../../models/transaction";

describe("When new transactions are added", () => {
    describe("if no collisions are there", () => {
        it("finds no duplicates", () => {
            expect(findDuplicates(mockTransactions, mockNewTransactions)).toStrictEqual([]);
        })
    });

    describe("if collisions are there", () => {
        it("finds duplicates", () => {
            expect(findDuplicates(mockTransactions, mockDuplicated).length).toBe(2);
        })
    });

});

export const mockTransactions: Transaction[] = [
    {
      id: "1",
      date: new Date("2023-12-01"),
      description: "Supermercado",
      amount: -50.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
    {
      id: "2",
      date: new Date("2023-12-02"),
      description: "Supermercado",
      amount: -10.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
    {
      id: "3",
      date: new Date("2023-12-02"),
      description: "Supermercado",
      amount: -1.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
  ];


  export const mockNewTransactions: Transaction[] = [
    {
      id: "9",
      date: new Date("2023-12-01"),
      description: "Supermercado",
      amount: -50.05,
      category: "Compras",
      account: "Tarjeta 1234",
    },
    {
      id: "10",
      date: new Date("2023-12-06"),
      description: "Supermercado",
      amount: -10.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
    {
      id: "11",
      date: new Date("2023-12-06"),
      description: "Supermercado",
      amount: -1.25,
      category: "Compras",
      account: "Tarjeta 1234",
    },
  ];

  export const mockDuplicated: Transaction[] = [
    {
        id: "100",
        date: new Date("2023-12-01"),
        description: "Supermercado",
        amount: -50.25,
        category: "Compras",
        account: "Tarjeta 1234",
      },
      {
        id: "200",
        date: new Date("2023-12-02"),
        description: "Supermercado",
        amount: -10.25,
        category: "Compras",
        account: "Tarjeta 1234",
      },
  ];