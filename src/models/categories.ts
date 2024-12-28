export interface Category {
  name: string;
  emissionFactor?: number; // kg CO₂ per $ spent
  subcategories?: SubCategories;
}

export interface Categories extends Record<string, Category> { }
export interface SubCategories extends Record<string, Subcategory> { }

export interface Subcategory {
  name: string;
  emissionFactor?: number; // Optional, specific to this subcategory
  subcategories?: SubCategories; // Nested subcategories
  proportion?: number; // Proportion of spending, specific to nested breakdowns
}

export const fromSubCategory: (sub: Subcategory) => Category = (sub) => {
  return {
    name: sub.name,
    emissionFactor: sub.emissionFactor,
    subcategories: sub.subcategories
  }
}

export const expenseCategories: Categories = {
  "Food and Dining": {
    name: "Food and Dining",
    subcategories: {
      "Groceries": {
        name: "Groceries",
        subcategories: {
          "Meat Products": { name: "Meat Products", proportion: 0.3, emissionFactor: 1.5 },
          "Seafood": { name: "Seafood", proportion: 0.2, emissionFactor: 1.3 },
          "Vegan Options": { name: "Vegan Options", proportion: 0.1, emissionFactor: 0.5 },
          "Other Groceries (Processed)": { name: "Other Groceries (Processed)", proportion: 0.4, emissionFactor: 1 },
        },
      },
      "Dinning Out": { name: "Dining Out", emissionFactor: 1.3 },
      "Delivery Services": { name: "Delivery Services", emissionFactor: 1.75 },
    },
  },
  "Transport": {
    name: "Transport",
    subcategories: {
      "Public Transport": { name: "Public Transport", emissionFactor: 0.1 },
      "Private Vehicle Fuel": {
        name: "Private Vehicle Fuel",
        subcategories: {
          "Gasoline": { name: "Gasoline", emissionFactor: 2.0 },
          "Diesel": { name: "Diesel", emissionFactor: 2.3 },
          "Electric": { name: "Electric", emissionFactor: 0.4 },
        },
      },
      "Air Travel": {
        name: "Air Travel",
        subcategories: {
          "Domestic Flights": { name: "Domestic Flights", emissionFactor: 0.25 },
          "International Flights": { name: "International Flights", emissionFactor: 0.35 },
        },
      },
      "Taxi": { name: "Taxi", emissionFactor: 0.25 },
      "Rider Services": { name: "Rider Services", emissionFactor: 0.2 },
    },
  },
  "Housing and Utilities": {
    name: "Housing and Utilities",
    subcategories: {
      "Electricity": {
        name: "Electricity",
        subcategories: {
          "Electricity (Renewable)": { name: "Electricity (Renewable)", emissionFactor: 0.2, proportion: 0.75 },
          "Electricity (Coal-Based)": { name: "Electricity (Coal-Based)", emissionFactor: 0.6, proportion: 0.25 },
        },
      },
      "Water Usage": { name: "Water Usage", emissionFactor: 0.05 },
      "Heating": {
        name: "Heating",
        subcategories: {
          "Heating (Natural Gas)": { name: "Heating (Natural Gas)", emissionFactor: 0.3, proportion: 0.5 },
          "Heating (Electric)": { name: "Heating (Electric)", emissionFactor: 0.5, proportion: 0.5 },
        },
      },
      "Rent/Mortgage": { name: "Rent/Mortgage", emissionFactor: 0 },
      "Internet/Phone": { name: "Internet/Phone", emissionFactor: 0.05 },
      "Comunidad de vecinos": { name: "Comunidad de vecinos", emissionFactor: 0.1 },
      "Cleaning Service": { name: "Cleaning Service", emissionFactor: 0.2 },
      "Fix/Maintenance": { name: "Fix/Maintenance", emissionFactor: 0 },
      "Cloud Services and Subscriptions": { name: "Cloud Services and Subscriptions", emissionFactor: 0.1 },
    },
  },
  "Shopping": {
    name: "Shopping",
    subcategories: {
      "Clothing": {
        name: "Clothing",
        subcategories: {
          "Clothing (Fast Fashion)": { name: "Clothing (Fast Fashion)", emissionFactor: 1, proportion: 0.2 },
          "Clothing (Sustainable Brands)": { name: "Clothing (Sustainable Brands)", emissionFactor: 0.4, proportion: 0.8 },
        },
      },
      "Electronics": { name: "Electronics", emissionFactor: 0.6 },
      "Furniture (Wooden)": { name: "Furniture (Wooden)", emissionFactor: 0.8 },
      "Furniture (Metal)": { name: "Furniture (Metal)", emissionFactor: 1.5 },
      "Personal Care": { name: "Personal Care", emissionFactor: 0.7 },
    },
  },
  "Entertainment and Recreation": {
    name: "Entertainment and Recreation",
    subcategories: {
      "Streaming Services": { name: "Streaming Services", emissionFactor: 0.1 },
      "Movies and Events": { name: "Movies and Events", emissionFactor: 0.3 },
      "Outdoor Activities": { name: "Outdoor Activities", emissionFactor: 0.3 },
      "Travel and Tourism (Hotels)": { name: "Travel and Tourism (Hotels)", emissionFactor: 0.1 },
      "Gym Membership": { name: "Gym Membership", emissionFactor: 0.15 },
      "Video Games": { name: "Video Games", emissionFactor: 0.1 },
      "Physical Games": { name: "Physical Games", emissionFactor: 0.4 },
    },
  },
  "Healthcare": {
    name: "Healthcare",
    subcategories: {
      "Medication": { name: "Medication", emissionFactor: 0.4 },
      "Health Services": { name: "Health Services", emissionFactor: 0.3 },
      "Supplements": { name: "Supplements", emissionFactor: 0.15 },
    },
  },
  "Education": {
    name: "Education",
    subcategories: {
      "Books": {
        name: "Books",
        subcategories: {
          "Books (Physical)": { name: "Books (Physical)", emissionFactor: 0.5 },
          "Books (Digital)": { name: "Books (Digital)", emissionFactor: 0.1 },
        },
      },
      "Online Courses": { name: "Online Courses", emissionFactor: 0.05 },
      "School Supplies": { name: "School Supplies", emissionFactor: 0.2 },
    },
  },
  "Miscellaneous": {
    name: "Miscellaneous",
    subcategories: {
      "Donations": { name: "Donations", emissionFactor: 0.05 },
      "Pet Care": { name: "Pet Care", emissionFactor: 0.2 },
      "Hobbies": { name: "Hobbies", emissionFactor: 0.25 },
      "Others": { name: "Others", emissionFactor: 0.1 },
      "Internal": { name: "Internal", emissionFactor: 0 },
    },
  },
  "Taxes/Fees": {
    name: "Taxes/Fees",
    subcategories: {
      "Income Tax": { name: "Income Tax", emissionFactor: 0.05 },
      "Property Tax": { name: "Property Tax", emissionFactor: 0.03 },
      "Customs Duties": { name: "Customs Duties", emissionFactor: 0.08 },
      "Currency Exchange Fees": { name: "Currency Exchange Fees", emissionFactor: 0.0 },
    },
  },
};


export const incomeCategories: Categories = {
  "Salary and Wages": {
    name: "Salary and Wages",
    subcategories: {
      "Full-Time Job": { name: "Full-Time Job" },
      "Part-Time Job": { name: "Part-Time Job" },
      "Overtime and Bonuses": { name: "Overtime and Bonuses" },
    },
  },
  "Investments": {
    name: "Investments",
    subcategories: {
      "Stocks and Bonds": {
        name: "Stocks and Bonds",
        subcategories: {
          "Dividends": { name: "Dividends" },
          "Capital Gains": { name: "Capital Gains" },
        },
      },
      "Real Estate": {
        name: "Real Estate",
        subcategories: {
          "Rental Income": { name: "Rental Income" },
          "Sale of Property": { name: "Sale of Property" },
        },
      },
      "Cryptocurrency": {
        name: "Cryptocurrency",
        subcategories: {
          "Trading": { name: "Trading", proportion: 0.7 },
          "Staking": { name: "Staking", proportion: 0.3 },
        },
      },
    },
  },
  "Business Income": {
    name: "Business Income",
    subcategories: {
      "Self-Employed Services": { name: "Self-Employed Services", proportion: 0.5 },
      "Freelancing": { name: "Freelancing", proportion: 0.3 },
      "Small Business Profits": { name: "Small Business Profits", proportion: 0.2 },
    },
  },
  "Government Benefits": {
    name: "Government Benefits",
    subcategories: {
      "Unemployment Benefits": { name: "Unemployment Benefits", proportion: 0.4 },
      "Social Security": { name: "Social Security", proportion: 0.4 },
      "Disability Allowance": { name: "Disability Allowance", proportion: 0.2 },
    },
  },
  "Pension and Retirement Funds": {
    name: "Pension and Retirement Funds",
    subcategories: {
      "Private Pension": { name: "Private Pension", proportion: 0.6 },
      "Employer Retirement Plan": { name: "Employer Retirement Plan", proportion: 0.4 },
    },
  },
  "Side Hustles": {
    name: "Side Hustles",
    subcategories: {
      "Gig Economy": { name: "Gig Economy", proportion: 0.5 },
      "Online Stores": { name: "Online Stores", proportion: 0.3 },
      "Content Creation": { name: "Content Creation", proportion: 0.2 },
    },
  },
  "Royalties and Licenses": {
    name: "Royalties and Licenses",
    subcategories: {
      "Book Royalties": { name: "Book Royalties", proportion: 0.4 },
      "Music Royalties": { name: "Music Royalties", proportion: 0.4 },
      "Software Licenses": { name: "Software Licenses", proportion: 0.2 },
    },
  },
  "Gifts and Inheritances": {
    name: "Gifts and Inheritances",
    subcategories: {
      "Monetary Gifts": { name: "Monetary Gifts", proportion: 0.7 },
      "Inheritances": { name: "Inheritances", proportion: 0.3 },
    },
  },
  "Miscellaneous Income": {
    name: "Miscellaneous Income",
    subcategories: {
      "Lottery Winnings": { name: "Lottery Winnings", proportion: 0.2 },
      "Cashbacks and Rewards": { name: "Cashbacks and Rewards", proportion: 0.4 },
      "Alimony or Child Support": { name: "Alimony or Child Support", proportion: 0.4 },
    },
  },
};

export const categories: Categories = {...expenseCategories, ...incomeCategories};