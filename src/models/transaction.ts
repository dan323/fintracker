export interface Transaction {
    id: string;
    date: Date; // Formato ISO (YYYY-MM-DD)
    description: string;
    amount: number;
    category: string;
    account: string;
    bussines?: boolean;
  }

// Define the shape of your filters
export interface Filters {
    dateRange?: { start: Date; end: Date };
    account?: string;
    categories?: string[];
}