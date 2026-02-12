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
});

