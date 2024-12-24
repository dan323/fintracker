export interface Transaction {
    id: string;
    date: string; // Formato ISO (YYYY-MM-DD)
    description: string;
    amount: number;
    category: string;
    account: string;
  }