export interface FlatCategory {
  id: string; // Unique identifier
  name: string;
  parentId?: string; // Reference to parent category
  emissionFactor?: number; // kg CO₂ per $ spent
  proportion?: number; // Proportion of spending (for nested breakdowns)
}

const expenseCategories: Record<string, FlatCategory> = {
  // Food and Dining
  "food-and-dining": { id: "food-and-dining", name: "Food and Dining" },
  "food-and-dining-groceries": { id: "food-and-dining-groceries", name: "Groceries", parentId: "food-and-dining" },
  "food-and-dining-groceries-meat-products": { id: "food-and-dining-groceries-meat-products", name: "Meat Products", parentId: "food-and-dining-groceries", proportion: 0.3, emissionFactor: 1.5 },
  "food-and-dining-groceries-seafood": { id: "food-and-dining-groceries-seafood", name: "Seafood", parentId: "food-and-dining-groceries", proportion: 0.2, emissionFactor: 1.3 },
  "food-and-dining-groceries-vegan-options": { id: "food-and-dining-groceries-vegan-options", name: "Vegan Options", parentId: "food-and-dining-groceries", proportion: 0.1, emissionFactor: 0.5 },
  "food-and-dining-groceries-other-processed": { id: "food-and-dining-groceries-other-processed", name: "Other Groceries (Processed)", parentId: "food-and-dining-groceries", proportion: 0.4, emissionFactor: 1.0 },
  "food-and-dining-dining-out": { id: "food-and-dining-dining-out", name: "Dining Out", parentId: "food-and-dining", emissionFactor: 1.3 },
  "food-and-dining-delivery-services": { id: "food-and-dining-delivery-services", name: "Delivery Services", parentId: "food-and-dining", emissionFactor: 1.75 },

  // Transport
  "transport": { id: "transport", name: "Transport" },
  "transport-public-transport": { id: "transport-public-transport", name: "Public Transport", parentId: "transport", emissionFactor: 0.1 },
  "transport-private-vehicle-fuel": { id: "transport-private-vehicle-fuel", name: "Private Vehicle Fuel", parentId: "transport" },
  "transport-private-vehicle-fuel-gasoline": { id: "transport-private-vehicle-fuel-gasoline", name: "Gasoline", parentId: "transport-private-vehicle-fuel", emissionFactor: 2.0 },
  "transport-private-vehicle-fuel-diesel": { id: "transport-private-vehicle-fuel-diesel", name: "Diesel", parentId: "transport-private-vehicle-fuel", emissionFactor: 2.3 },
  "transport-private-vehicle-fuel-electric": { id: "transport-private-vehicle-fuel-electric", name: "Electric", parentId: "transport-private-vehicle-fuel", emissionFactor: 0.4 },
  "transport-air-travel": { id: "transport-air-travel", name: "Air Travel", parentId: "transport" },
  "transport-air-travel-domestic": { id: "transport-air-travel-domestic", name: "Domestic Flights", parentId: "transport-air-travel", emissionFactor: 0.25 },
  "transport-air-travel-international": { id: "transport-air-travel-international", name: "International Flights", parentId: "transport-air-travel", emissionFactor: 0.35 },
  "transport-taxi": { id: "transport-taxi", name: "Taxi", parentId: "transport", emissionFactor: 0.25 },
  "transport-rider-services": { id: "transport-rider-services", name: "Rider Services", parentId: "transport", emissionFactor: 0.2 },

  // Housing and Utilities
  "housing-and-utilities": { id: "housing-and-utilities", name: "Housing and Utilities" },
  "housing-and-utilities-electricity": { id: "housing-and-utilities-electricity", name: "Electricity", parentId: "housing-and-utilities" },
  "housing-and-utilities-electricity-renewable": { id: "housing-and-utilities-electricity-renewable", name: "Electricity (Renewable)", parentId: "housing-and-utilities-electricity", proportion: 0.75, emissionFactor: 0.2 },
  "housing-and-utilities-electricity-coal-based": { id: "housing-and-utilities-electricity-coal-based", name: "Electricity (Coal-Based)", parentId: "housing-and-utilities-electricity", proportion: 0.25, emissionFactor: 0.6 },
  "housing-and-utilities-water-usage": { id: "housing-and-utilities-water-usage", name: "Water Usage", parentId: "housing-and-utilities", emissionFactor: 0.05 },
  "housing-and-utilities-heating": { id: "housing-and-utilities-heating", name: "Heating", parentId: "housing-and-utilities" },
  "housing-and-utilities-heating-natural-gas": { id: "housing-and-utilities-heating-natural-gas", name: "Heating (Natural Gas)", parentId: "housing-and-utilities-heating", proportion: 0.5, emissionFactor: 0.3 },
  "housing-and-utilities-heating-electric": { id: "housing-and-utilities-heating-electric", name: "Heating (Electric)", parentId: "housing-and-utilities-heating", proportion: 0.5, emissionFactor: 0.5 },
  "housing-and-utilities-rent-mortgage": { id: "housing-and-utilities-rent-mortgage", name: "Rent/Mortgage", parentId: "housing-and-utilities", emissionFactor: 0 },
  "housing-and-utilities-internet-phone": { id: "housing-and-utilities-internet-phone", name: "Internet/Phone", parentId: "housing-and-utilities", emissionFactor: 0.05 },
  "housing-and-utilities-comunidad-de-vecinos": { id: "housing-and-utilities-comunidad-de-vecinos", name: "Comunidad de vecinos", parentId: "housing-and-utilities", emissionFactor: 0.1 },
  "housing-and-utilities-cleaning-service": { id: "housing-and-utilities-cleaning-service", name: "Cleaning Service", parentId: "housing-and-utilities", emissionFactor: 0.2 },
  "housing-and-utilities-fix-maintenance": { id: "housing-and-utilities-fix-maintenance", name: "Fix/Maintenance", parentId: "housing-and-utilities", emissionFactor: 0 },
  "housing-and-utilities-cloud-services": { id: "housing-and-utilities-cloud-services", name: "Cloud Services and Subscriptions", parentId: "housing-and-utilities", emissionFactor: 0.1 },

  // Shopping
  "shopping": { id: "shopping", name: "Shopping" },
  "shopping-clothing": { id: "shopping-clothing", name: "Clothing", parentId: "shopping" },
  "shopping-clothing-fast-fashion": { id: "shopping-clothing-fast-fashion", name: "Clothing (Fast Fashion)", parentId: "shopping-clothing", proportion: 0.2, emissionFactor: 1 },
  "shopping-clothing-sustainable-brands": { id: "shopping-clothing-sustainable-brands", name: "Clothing (Sustainable Brands)", parentId: "shopping-clothing", proportion: 0.8, emissionFactor: 0.4 },
  "shopping-electronics": { id: "shopping-electronics", name: "Electronics", parentId: "shopping", emissionFactor: 0.6 },
  "shopping-furniture-wooden": { id: "shopping-furniture-wooden", name: "Furniture (Wooden)", parentId: "shopping", emissionFactor: 0.8 },
  "shopping-furniture-metal": { id: "shopping-furniture-metal", name: "Furniture (Metal)", parentId: "shopping", emissionFactor: 1.5 },
  "shopping-personal-care": { id: "shopping-personal-care", name: "Personal Care", parentId: "shopping", emissionFactor: 0.7 },
  "shopping-gifts": { id: "shopping-gifts", name: "Gifts", parentId: "shopping", emissionFactor: 0 },
  "shopping-house-utils": { id: "shopping-house-utils", name: "House Utils", parentId: "shopping", emissionFactor: 0.05 },

  // Entertainment and Recreation
  "entertainment-and-recreation": { id: "entertainment-and-recreation", name: "Entertainment and Recreation" },
  "entertainment-and-recreation-streaming-services": { id: "entertainment-and-recreation-streaming-services", name: "Streaming Services", parentId: "entertainment-and-recreation", emissionFactor: 0.1 },
  "entertainment-and-recreation-movies-and-events": { id: "entertainment-and-recreation-movies-and-events", name: "Movies and Events", parentId: "entertainment-and-recreation", emissionFactor: 0.3 },
  "entertainment-and-recreation-outdoor-activities": { id: "entertainment-and-recreation-outdoor-activities", name: "Outdoor Activities", parentId: "entertainment-and-recreation", emissionFactor: 0.3 },
  "entertainment-and-recreation-travel-and-tourism-hotels": { id: "entertainment-and-recreation-travel-and-tourism-hotels", name: "Travel and Tourism (Hotels)", parentId: "entertainment-and-recreation", emissionFactor: 0.1 },
  "entertainment-and-recreation-gym-membership": { id: "entertainment-and-recreation-gym-membership", name: "Gym Membership", parentId: "entertainment-and-recreation", emissionFactor: 0.15 },
  "entertainment-and-recreation-video-games": { id: "entertainment-and-recreation-video-games", name: "Video Games", parentId: "entertainment-and-recreation", emissionFactor: 0.1 },
  "entertainment-and-recreation-physical-games": { id: "entertainment-and-recreation-physical-games", name: "Physical Games", parentId: "entertainment-and-recreation", emissionFactor: 0.4 },

  // Healthcare
  "healthcare": { id: "healthcare", name: "Healthcare" },
  "healthcare-medication": { id: "healthcare-medication", name: "Medication", parentId: "healthcare", emissionFactor: 0.4 },
  "healthcare-health-services": { id: "healthcare-health-services", name: "Health Services", parentId: "healthcare", emissionFactor: 0.3 },
  "healthcare-supplements": { id: "healthcare-supplements", name: "Supplements", parentId: "healthcare", emissionFactor: 0.15 },

  // Education
  "education": { id: "education", name: "Education" },
  "education-books": { id: "education-books", name: "Books", parentId: "education" },
  "education-books-physical": { id: "education-books-physical", name: "Books (Physical)", parentId: "education-books", emissionFactor: 0.5 },
  "education-books-digital": { id: "education-books-digital", name: "Books (Digital)", parentId: "education-books", emissionFactor: 0.1 },
  "education-online-courses": { id: "education-online-courses", name: "Online Courses", parentId: "education", emissionFactor: 0.05 },
  "education-school-supplies": { id: "education-school-supplies", name: "School Supplies", parentId: "education", emissionFactor: 0.2 },

  // Miscellaneous
  "miscellaneous": { id: "miscellaneous", name: "Miscellaneous" },
  "miscellaneous-donations": { id: "miscellaneous-donations", name: "Donations", parentId: "miscellaneous", emissionFactor: 0.05 },
  "miscellaneous-pet-care": { id: "miscellaneous-pet-care", name: "Pet Care", parentId: "miscellaneous", emissionFactor: 0.2 },
  "miscellaneous-hobbies": { id: "miscellaneous-hobbies", name: "Hobbies", parentId: "miscellaneous", emissionFactor: 0.25 },
  "miscellaneous-others": { id: "miscellaneous-others", name: "Others", parentId: "miscellaneous", emissionFactor: 0.1 },
  "miscellaneous-internal": { id: "miscellaneous-internal", name: "Internal", parentId: "miscellaneous", emissionFactor: 0 },
  "miscellaneous-lawyer": { id: "miscellaneous-lawyer", name: "Lawyer", parentId: "miscellaneous", emissionFactor: 0 },

  // Taxes/Fees
  "taxes-fees": { id: "taxes-fees", name: "Taxes/Fees" },
  "taxes-fees-income-tax": { id: "taxes-fees-income-tax", name: "Income Tax", parentId: "taxes-fees", emissionFactor: 0.05 },
  "taxes-fees-property-tax": { id: "taxes-fees-property-tax", name: "Property Tax", parentId: "taxes-fees", emissionFactor: 0.03 },
  "taxes-fees-customs-duties": { id: "taxes-fees-customs-duties", name: "Customs Duties", parentId: "taxes-fees", emissionFactor: 0.08 },
  "taxes-fees-currency-exchange-fees": { id: "taxes-fees-currency-exchange-fees", name: "Currency Exchange Fees", parentId: "taxes-fees", emissionFactor: 0 },

}

const incomeCategories: Record<string, FlatCategory> = {

  // Salary and Wages
  "income-salary-and-wages": { id: "income-salary-and-wages", name: "Salary and Wages" },
  "income-salary-and-wages-full-time-job": { id: "income-salary-and-wages-full-time-job", name: "Full-Time Job", parentId: "income-salary-and-wages" },
  "income-salary-and-wages-part-time-job": { id: "income-salary-and-wages-part-time-job", name: "Part-Time Job", parentId: "income-salary-and-wages" },
  "income-salary-and-wages-overtime-and-bonuses": { id: "income-salary-and-wages-overtime-and-bonuses", name: "Overtime and Bonuses", parentId: "income-salary-and-wages" },

  // Investments
  "income-investments": { id: "income-investments", name: "Investments" },
  "income-investments-stocks-and-bonds": { id: "income-investments-stocks-and-bonds", name: "Stocks and Bonds", parentId: "income-investments" },
  "income-investments-stocks-and-bonds-dividends": { id: "income-investments-stocks-and-bonds-dividends", name: "Dividends", parentId: "income-investments-stocks-and-bonds" },
  "income-investments-stocks-and-bonds-capital-gains": { id: "income-investments-stocks-and-bonds-capital-gains", name: "Capital Gains", parentId: "income-investments-stocks-and-bonds" },
  "income-investments-real-estate": { id: "income-investments-real-estate", name: "Real Estate", parentId: "income-investments" },
  "income-investments-real-estate-rental-income": { id: "income-investments-real-estate-rental-income", name: "Rental Income", parentId: "income-investments-real-estate" },
  "income-investments-real-estate-sale-of-property": { id: "income-investments-real-estate-sale-of-property", name: "Sale of Property", parentId: "income-investments-real-estate" },
  "income-investments-cryptocurrency": { id: "income-investments-cryptocurrency", name: "Cryptocurrency", parentId: "income-investments" },
  "income-investments-cryptocurrency-trading": { id: "income-investments-cryptocurrency-trading", name: "Trading", parentId: "income-investments-cryptocurrency", proportion: 0.7 },
  "income-investments-cryptocurrency-staking": { id: "income-investments-cryptocurrency-staking", name: "Staking", parentId: "income-investments-cryptocurrency", proportion: 0.3 },

  // Business Income
  "business-income": { id: "business-income", name: "Business Income" },
  "business-income-self-employed-services": { id: "business-income-self-employed-services", name: "Self-Employed Services", parentId: "business-income", proportion: 0.5 },
  "business-income-freelancing": { id: "business-income-freelancing", name: "Freelancing", parentId: "business-income", proportion: 0.3 },
  "business-income-small-business-profits": { id: "business-income-small-business-profits", name: "Small Business Profits", parentId: "business-income", proportion: 0.2 },

  // Government Benefits
  "government-benefits": { id: "government-benefits", name: "Government Benefits" },
  "government-benefits-unemployment-benefits": { id: "government-benefits-unemployment-benefits", name: "Unemployment Benefits", parentId: "government-benefits", proportion: 0.4 },
  "government-benefits-social-security": { id: "government-benefits-social-security", name: "Social Security", parentId: "government-benefits", proportion: 0.4 },
  "government-benefits-disability-allowance": { id: "government-benefits-disability-allowance", name: "Disability Allowance", parentId: "government-benefits", proportion: 0.2 },

  // Pension and Retirement Funds
  "pension-and-retirement-funds": { id: "pension-and-retirement-funds", name: "Pension and Retirement Funds" },
  "pension-and-retirement-funds-private-pension": { id: "pension-and-retirement-funds-private-pension", name: "Private Pension", parentId: "pension-and-retirement-funds", proportion: 0.6 },
  "pension-and-retirement-funds-employer-retirement-plan": { id: "pension-and-retirement-funds-employer-retirement-plan", name: "Employer Retirement Plan", parentId: "pension-and-retirement-funds", proportion: 0.4 },

  // Side Hustles
  "side-hustles": { id: "side-hustles", name: "Side Hustles" },
  "side-hustles-gig-economy": { id: "side-hustles-gig-economy", name: "Gig Economy", parentId: "side-hustles", proportion: 0.5 },
  "side-hustles-online-stores": { id: "side-hustles-online-stores", name: "Online Stores", parentId: "side-hustles", proportion: 0.3 },
  "side-hustles-content-creation": { id: "side-hustles-content-creation", name: "Content Creation", parentId: "side-hustles", proportion: 0.2 },

  // Royalties and Licenses
  "royalties-and-licenses": { id: "royalties-and-licenses", name: "Royalties and Licenses" },
  "royalties-and-licenses-book-royalties": { id: "royalties-and-licenses-book-royalties", name: "Book Royalties", parentId: "royalties-and-licenses", proportion: 0.4 },
  "royalties-and-licenses-music-royalties": { id: "royalties-and-licenses-music-royalties", name: "Music Royalties", parentId: "royalties-and-licenses", proportion: 0.4 },
  "royalties-and-licenses-software-licenses": { id: "royalties-and-licenses-software-licenses", name: "Software Licenses", parentId: "royalties-and-licenses", proportion: 0.2 },

  // Gifts and Inheritances
  "gifts-and-inheritances": { id: "gifts-and-inheritances", name: "Gifts and Inheritances" },
  "gifts-and-inheritances-monetary-gifts": { id: "gifts-and-inheritances-monetary-gifts", name: "Monetary Gifts", parentId: "gifts-and-inheritances", proportion: 0.7 },
  "gifts-and-inheritances-inheritances": { id: "gifts-and-inheritances-inheritances", name: "Inheritances", parentId: "gifts-and-inheritances", proportion: 0.3 },

  // Miscellaneous Income
  "miscellaneous-income": { id: "miscellaneous-income", name: "Miscellaneous Income" },
  "miscellaneous-income-lottery-winnings": { id: "miscellaneous-income-lottery-winnings", name: "Lottery Winnings", parentId: "miscellaneous-income", proportion: 0.2 },
  "miscellaneous-income-cashbacks-and-rewards": { id: "miscellaneous-income-cashbacks-and-rewards", name: "Cashbacks and Rewards", parentId: "miscellaneous-income", proportion: 0.4 },
  "miscellaneous-income-alimony-or-child-support": { id: "miscellaneous-income-alimony-or-child-support", name: "Alimony or Child Support", parentId: "miscellaneous-income", proportion: 0.4 },

}

export const categories: Record<string,FlatCategory> = { ...expenseCategories, ...incomeCategories };