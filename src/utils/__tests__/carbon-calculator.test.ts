import { CarbonCalculator } from '../carbon-calculator';
import { Transaction } from '../../models/transaction';

describe('CarbonCalculator', () => {
  it('calculates emissions for simple transactions', () => {
    const transactions: Transaction[] = [
      {
        id: 't1',
        date: new Date('2023-01-01'),
        description: 'Grocery meat',
        amount: -100, // expense
        category: 'food-and-dining-groceries-meat-products',
        account: 'card',
      },
      {
        id: 't2',
        date: new Date('2023-01-02'),
        description: 'Electricity',
        amount: -50,
        category: 'housing-and-utilities-electricity-coal-based',
        account: 'card',
      },
      {
        id: 't3',
        date: new Date('2023-01-03'),
        description: 'Salary',
        amount: 1000, // income should be ignored
        category: 'income-salary-and-wages',
        account: 'bank',
      }
    ];

    const analysis = CarbonCalculator.analyzeFootprint(transactions, 'EU');
    expect(analysis.totalEmissions).toBeGreaterThan(0);
    expect(analysis.breakdown.length).toBeGreaterThan(0);
    // Check that income was ignored and monthlyAverage computed
    expect(analysis.monthlyAverage).toBeGreaterThan(0);
    expect(analysis.region).toBe('EU');
  });

  // Regression: emissions used to be looked up by category *name*, so
  // transactions categorized with canonical ids silently fell back to the
  // generic "Others" factor instead of the category's real one.
  it('applies the category emission factor when the category is an id', () => {
    const tx: Transaction = {
      id: 't1',
      date: new Date('2023-01-01'),
      description: 'Meat',
      amount: -100,
      category: 'food-and-dining-groceries-meat-products', // factor 3.2
      account: 'card',
    };

    expect(CarbonCalculator.calculateTransactionEmission(tx, 'EU')).toBeCloseTo(320);
  });
});

