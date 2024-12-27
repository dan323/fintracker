export interface Category {
    name: string;
    emissionFactor?: number; // kg CO₂ per $ spent
    subcategories?: Subcategory[];
}

export interface Subcategory {
    name: string;
    emissionFactor?: number; // Optional, specific to this subcategory
    subcategories?: Subcategory[]; // Nested subcategories
    proportion?: number; // Proportion of spending, specific to nested breakdowns
}

export const fromSubCategory:(sub: Subcategory) => Category = (sub) => {
    return {
        name: sub.name,
        emissionFactor: sub.emissionFactor,
        subcategories: sub.subcategories
    }
}

export const expenseCategories: Category[] = [
    {
        name: "Food and Dining",
        subcategories: [
            {
                name: "Groceries",
                subcategories: [
                    {
                        name: "Meat Products",
                        proportion: 0.3,
                        emissionFactor: 3.0
                    },
                    {
                        name: "Seafood",
                        proportion: 0.2,
                        emissionFactor: 2.5
                    },
                    {
                        name: "Vegan Options",
                        proportion: 0.1,
                        emissionFactor: 0.1
                    },
                    {
                        name: "Other Groceries (Processed)",
                        proportion: 0.4,
                        emissionFactor: 0.5
                    },
                ],
            },
            {
                name: "Dining Out",
                emissionFactor: 0.8,
            },
            {
                name: "Delivery Services",
                emissionFactor: 1.0,
            },
        ],
    },
    {
        name: "Transport",
        subcategories: [
            {
                name: "Public Transport",
                emissionFactor: 0.05,
            },
            {
                name: "Private Vehicle Fuel",
                subcategories: [
                    { name: "Gasoline", emissionFactor: 2.3 },
                    { name: "Diesel", emissionFactor: 2.7 },
                    { name: "Electric", emissionFactor: 0.5 },
                ],
            },
            {
                name: "Air Travel",
                subcategories: [
                    { name: "Domestic Flights", emissionFactor: 0.15 },
                    { name: "International Flights", emissionFactor: 0.25 },
                ],
            },
        ],
    },
    {
        name: "Housing and Utilities",
        subcategories: [
            {
                name: "Electricity",
                subcategories: [
                    { name: "Electricity (Renewable)", emissionFactor: 0.05, proportion: 0.75 },
                    { name: "Electricity (Coal-Based)", emissionFactor: 0.9, proportion: 0.25 }
                ]
            },
            { name: "Water Usage", emissionFactor: 0.02 },
            {
                name: "Heating",
                subcategories: [
                    { name: "Heating (Natural Gas)", emissionFactor: 0.2, proportion: 0.5 },
                    { name: "Heating (Electric)", emissionFactor: 0.5, proportion: 0.5 }
                ]
            },
            { name: "Rent/Mortgage", emissionFactor: 0.3 },
        ],
    },
    {
        name: "Shopping",
        subcategories: [
            {
                name: "Clothing",
                subcategories: [
                    { name: "Clothing (Fast Fashion)", emissionFactor: 1.2, proportion: 0.2 },
                    { name: "Clothing (Sustainable Brands)", emissionFactor: 0.3, proportion: 0.8 },
                ]
            },
            { name: "Electronics", emissionFactor: 2.0 },
            { name: "Furniture (Wooden)", emissionFactor: 0.8 },
            { name: "Furniture (Metal)", emissionFactor: 1.5 },
            { name: "Personal Care", emissionFactor: 0.7 },
        ],
    },
    {
        name: "Entertainment and Recreation",
        subcategories: [
            { name: "Streaming Services", emissionFactor: 0.1 },
            { name: "Movies and Events", emissionFactor: 0.2 },
            { name: "Outdoor Activities", emissionFactor: 0.3 },
            { name: "Travel and Tourism (Hotels)", emissionFactor: 2.0 },
        ],
    },
    {
        name: "Healthcare",
        subcategories: [
            { name: "Medication", emissionFactor: 0.2 },
            { name: "Health Services", emissionFactor: 0.3 },
            { name: "Supplements", emissionFactor: 0.15 },
        ],
    },
    {
        name: "Education",
        subcategories: [
            {
                name: "Books",
                subcategories: [
                    { name: "Books (Physical)", emissionFactor: 0.5 },
                    { name: "Books (Digital)", emissionFactor: 0.1 }
                ]
            },
            { name: "Online Courses", emissionFactor: 0.05 },
            { name: "School Supplies", emissionFactor: 0.2 },
        ],
    },
    {
        name: "Miscellaneous",
        subcategories: [
            { name: "Donations", emissionFactor: 0.1 },
            { name: "Pet Care", emissionFactor: 0.3 },
            { name: "Hobbies", emissionFactor: 0.25 },
            { name: "Others", emissionFactor: 0.25 }
        ],
    },
];

export const incomeCategories: Category[] = [
    {
      name: "Salary and Wages",
      subcategories: [
        { name: "Full-Time Job", proportion: 0.7 },
        { name: "Part-Time Job", proportion: 0.2 },
        { name: "Overtime and Bonuses", proportion: 0.1 },
      ],
    },
    {
      name: "Investments",
      subcategories: [
        {
          name: "Stocks and Bonds",
          subcategories: [
            { name: "Dividends", proportion: 0.6 },
            { name: "Capital Gains", proportion: 0.4 },
          ],
        },
        {
          name: "Real Estate",
          subcategories: [
            { name: "Rental Income", proportion: 0.8 },
            { name: "Sale of Property", proportion: 0.2 },
          ],
        },
        {
          name: "Cryptocurrency",
          subcategories: [
            { name: "Trading", proportion: 0.7 },
            { name: "Staking", proportion: 0.3 },
          ],
        },
      ],
    },
    {
      name: "Business Income",
      subcategories: [
        { name: "Self-Employed Services", proportion: 0.5 },
        { name: "Freelancing", proportion: 0.3 },
        { name: "Small Business Profits", proportion: 0.2 },
      ],
    },
    {
      name: "Government Benefits",
      subcategories: [
        { name: "Unemployment Benefits", proportion: 0.4 },
        { name: "Social Security", proportion: 0.4 },
        { name: "Disability Allowance", proportion: 0.2 },
      ],
    },
    {
      name: "Pension and Retirement Funds",
      subcategories: [
        { name: "Private Pension", proportion: 0.6 },
        { name: "Employer Retirement Plan", proportion: 0.4 },
      ],
    },
    {
      name: "Side Hustles",
      subcategories: [
        { name: "Gig Economy (e.g., Delivery, Ride-Sharing)", proportion: 0.5 },
        { name: "Online Stores", proportion: 0.3 },
        { name: "Content Creation (e.g., YouTube, Twitch)", proportion: 0.2 },
      ],
    },
    {
      name: "Royalties and Licenses",
      subcategories: [
        { name: "Book Royalties", proportion: 0.4 },
        { name: "Music Royalties", proportion: 0.4 },
        { name: "Software Licenses", proportion: 0.2 },
      ],
    },
    {
      name: "Gifts and Inheritances",
      subcategories: [
        { name: "Monetary Gifts", proportion: 0.7 },
        { name: "Inheritances", proportion: 0.3 },
      ],
    },
    {
      name: "Miscellaneous Income",
      subcategories: [
        { name: "Lottery Winnings", proportion: 0.2 },
        { name: "Cashbacks and Rewards", proportion: 0.4 },
        { name: "Alimony or Child Support", proportion: 0.4 },
      ],
    },
  ];
  
export const categories: Category[] = expenseCategories.concat(incomeCategories);