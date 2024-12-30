export interface Color {
    r: number,
    g: number,
    b: number,
}

const categoryColors: Record<string, Color> = {
    // Food and Dining
    "Food and Dining": { r: 255, g: 112, b: 67 }, // Coral
    "Groceries": { r: 244, g: 81, b: 30 }, // Deep Orange
    "Meat Products": { r: 229, g: 57, b: 53 }, // Red
    "Seafood": { r: 255, g: 193, b: 7 }, // Golden Yellow
    "Vegan Options": { r: 103, g: 58, b: 183 }, // Indigo
    "Other Groceries (Processed)": { r: 33, g: 150, b: 243 }, // Blue
    "Dining Out": { r: 3, g: 169, b: 244 }, // Light Blue
    "Delivery Services": { r: 0, g: 188, b: 212 }, // Cyan
  
    // Transport
    "Transport": { r: 41, g: 182, b: 246 }, // Sky Blue
    "Public Transport": { r: 0, g: 191, b: 165 }, // Teal
    "Private Vehicle Fuel": { r: 0, g: 150, b: 136 }, // Dark Teal
    "Gasoline": { r: 255, g: 202, b: 40 }, // Yellow
    "Diesel": { r: 255, g: 183, b: 77 }, // Amber
    "Electric": { r: 124, g: 179, b: 66 }, // Light Green
    "Air Travel": { r: 0, g: 121, b: 107 }, // Deep Teal
    "Domestic Flights": { r: 76, g: 175, b: 80 }, // Green
    "International Flights": { r: 139, g: 195, b: 74 }, // Lime
    "Taxi": { r: 183, g: 28, b: 28 }, // Crimson
    "Rider Services": { r: 230, g: 81, b: 0 }, // Burnt Orange
  
    // Housing and Utilities
    "Housing and Utilities": { r: 102, g: 187, b: 106 }, // Green
    "Electricity": { r: 255, g: 235, b: 59 }, // Bright Yellow
    "Electricity (Renewable)": { r: 253, g: 216, b: 53 }, // Light Yellow
    "Electricity (Coal-Based)": { r: 255, g: 152, b: 0 }, // Orange
    "Water Usage": { r: 3, g: 155, b: 229 }, // Deep Blue
    "Heating": { r: 30, g: 136, b: 229 }, // Deep Sky Blue
    "Heating (Natural Gas)": { r: 38, g: 198, b: 218 }, // Aqua
    "Heating (Electric)": { r: 0, g: 188, b: 212 }, // Cyan
    "Rent/Mortgage": { r: 121, g: 85, b: 72 }, // Brown
    "Internet/Phone": { r: 224, g: 224, b: 224 }, // Light Gray
    "Comunidad de vecinos": { r: 96, g: 125, b: 139 }, // Slate Gray
    "Cleaning Service": { r: 158, g: 158, b: 158 }, // Gray
    "Fix/Maintenance": { r: 33, g: 33, b: 33 }, // Dark Gray
    "Cloud Services and Subscriptions": { r: 100, g: 255, b: 218 }, // Mint
  
    // Shopping
    "Shopping": { r: 171, g: 71, b: 188 }, // Purple
    "Clothing": { r: 126, g: 87, b: 194 }, // Deep Purple
    "Clothing (Fast Fashion)": { r: 224, g: 64, b: 251 }, // Bright Purple
    "Clothing (Sustainable Brands)": { r: 186, g: 104, b: 200 }, // Light Purple
    "Electronics": { r: 0, g: 150, b: 136 }, // Dark Teal
    "Furniture (Wooden)": { r: 121, g: 85, b: 72 }, // Brown
    "Furniture (Metal)": { r: 158, g: 158, b: 158 }, // Gray
    "Personal Care": { r: 255, g: 138, b: 128 }, // Pink
    "Gifts": { r: 213, g: 0, b: 249 }, // Magenta
    "House Utils": { r: 156, g: 204, b: 101 }, // Lime
  
    // Entertainment and Recreation
    "Entertainment and Recreation": { r: 255, g: 167, b: 38 }, // Orange
    "Streaming Services": { r: 239, g: 108, b: 0 }, // Deep Orange
    "Movies and Events": { r: 255, g: 138, b: 101 }, // Coral
    "Outdoor Activities": { r: 255, g: 238, b: 88 }, // Yellow
    "Travel and Tourism (Hotels)": { r: 102, g: 187, b: 106 }, // Green
    "Gym Membership": { r: 76, g: 175, b: 80 }, // Dark Green
    "Video Games": { r: 255, g: 87, b: 34 }, // Deep Red
    "Physical Games": { r: 156, g: 39, b: 176 }, // Purple
  
 // Healthcare
 "Healthcare": { r: 183, g: 28, b: 28 },
 "Medication": { r: 239, g: 83, b: 80 },
 "Health Services": { r: 255, g: 82, b: 82 },
 "Supplements": { r: 244, g: 143, b: 177 },

 // Education
 "Education": { r: 30, g: 136, b: 229 },
 "Books": { r: 255, g: 193, b: 7 },
 "Books (Physical)": { r: 255, g: 214, b: 10 },
 "Books (Digital)": { r: 255, g: 235, b: 59 },
 "Online Courses": { r: 255, g: 238, b: 88 },
 "School Supplies": { r: 255, g: 249, b: 196 },

 // Miscellaneous
 "Miscellaneous": { r: 156, g: 39, b: 176 },
 "Donations": { r: 186, g: 104, b: 200 },
 "Pet Care": { r: 224, g: 64, b: 251 },
 "Hobbies": { r: 126, g: 87, b: 194 },
 "Others": { r: 103, g: 58, b: 183 },
 "Internal": { r: 72, g: 39, b: 128 },
 "Lawyer": { r: 56, g: 14, b: 95 },

 // Taxes/Fees
 "Taxes/Fees": { r: 139, g: 195, b: 74 },
 "Income Tax": { r: 174, g: 213, b: 129 },
 "Property Tax": { r: 124, g: 179, b: 66 },
 "Customs Duties": { r: 192, g: 202, b: 51 },
 "Currency Exchange Fees": { r: 156, g: 204, b: 101 },

 // Income Categories
 "Salary and Wages": { r: 0, g: 191, b: 165 },
 "Full-Time Job": { r: 0, g: 131, b: 143 },
 "Part-Time Job": { r: 0, g: 188, b: 212 },
 "Overtime and Bonuses": { r: 29, g: 233, b: 182 },

 "Investments": { r: 96, g: 125, b: 139 },
 "Stocks and Bonds": { r: 69, g: 90, b: 100 },
 "Dividends": { r: 38, g: 50, b: 56 },
 "Capital Gains": { r: 144, g: 164, b: 174 },
 "Real Estate": { r: 66, g: 66, b: 66 },
 "Rental Income": { r: 33, g: 33, b: 33 },
 "Sale of Property": { r: 158, g: 158, b: 158 },
 "Cryptocurrency": { r: 255, g: 87, b: 34 },
 "Trading": { r: 239, g: 83, b: 80 },
 "Staking": { r: 255, g: 138, b: 101 },

 "Business Income": { r: 255, g: 167, b: 38 },
 "Self-Employed Services": { r: 255, g: 183, b: 77 },
 "Freelancing": { r: 255, g: 204, b: 128 },
 "Small Business Profits": { r: 255, g: 224, b: 178 },

 "Government Benefits": { r: 129, g: 212, b: 250 },
 "Unemployment Benefits": { r: 79, g: 195, b: 247 },
 "Social Security": { r: 41, g: 182, b: 246 },
 "Disability Allowance": { r: 3, g: 169, b: 244 },

 "Pension and Retirement Funds": { r: 121, g: 85, b: 72 },
 "Private Pension": { r: 78, g: 52, b: 46 },
 "Employer Retirement Plan": { r: 141, g: 110, b: 99 },

 "Side Hustles": { r: 38, g: 166, b: 154 },
 "Gig Economy": { r: 0, g: 131, b: 143 },
 "Online Stores": { r: 0, g: 172, b: 193 },
 "Content Creation": { r: 0, g: 188, b: 212 },

 "Royalties and Licenses": { r: 255, g: 61, b: 0 },
 "Book Royalties": { r: 244, g: 67, b: 54 },
 "Music Royalties": { r: 229, g: 57, b: 53 },
 "Software Licenses": { r: 255, g: 87, b: 34 },

 "Gifts and Inheritances": { r: 103, g: 58, b: 183 },
 "Monetary Gifts": { r: 63, g: 81, b: 181 },
 "Inheritances": { r: 48, g: 63, b: 159 },

 "Miscellaneous Income": { r: 255, g: 214, b: 0 },
 "Lottery Winnings": { r: 255, g: 235, b: 59 },
 "Cashbacks and Rewards": { r: 253, g: 216, b: 53 },
 "Alimony or Child Support": { r: 255, g: 238, b: 88 },
};

const toString = (color: Color) => {
    return `rgb(${Math.min(color.r,255)},${Math.min(color.g,255)},${Math.min(color.b,255)})`;
}

// Get the adjusted color based on transaction type
export const getColorForTransaction = (category: string) => {
   return toString(categoryColors[category]);
};