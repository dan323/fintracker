export interface Transaction {
    id: string;
    date: string; // Formato ISO (YYYY-MM-DD)
    description: string;
    amount: number;
    category: string;
    account: string;
  }

// Define the shape of your filters
export interface Filters {
    dateRange?: { start: Date; end: Date };
    account?: string;
    category?: string;
    type:""|"positive"|"negative";
}