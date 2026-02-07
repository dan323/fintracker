export interface FlatCategory {
  id: string; // Unique identifier
  name: string;
  parentId?: string; // Reference to parent category
  emissionFactor?: number; // kg CO₂e per € spent
  proportion?: number; // Proportion of spending (for nested breakdowns)
  region?: string; // For regional variations
  lastUpdated?: string; // Data freshness tracking
}

const expenseCategories: Record<string, FlatCategory> = {
  // Food and Dining - Updated based on lifecycle analysis
  "food-and-dining": { id: "food-and-dining", name: "Food and Dining" },
  "food-and-dining-groceries": { id: "food-and-dining-groceries", name: "Groceries", parentId: "food-and-dining" },
  "food-and-dining-groceries-meat-products": { id: "food-and-dining-groceries-meat-products", name: "Meat Products", parentId: "food-and-dining-groceries", proportion: 0.3, emissionFactor: 3.2 }, // Higher due to livestock
  "food-and-dining-groceries-seafood": { id: "food-and-dining-groceries-seafood", name: "Seafood", parentId: "food-and-dining-groceries", proportion: 0.2, emissionFactor: 2.1 },
  "food-and-dining-groceries-vegan-options": { id: "food-and-dining-groceries-vegan-options", name: "Vegan Options", parentId: "food-and-dining-groceries", proportion: 0.1, emissionFactor: 0.8 },
  "food-and-dining-groceries-other-processed": { id: "food-and-dining-groceries-other-processed", name: "Other Groceries (Processed)", parentId: "food-and-dining-groceries", proportion: 0.4, emissionFactor: 1.4 },
  "food-and-dining-dining-out": { id: "food-and-dining-dining-out", name: "Dining Out", parentId: "food-and-dining", emissionFactor: 2.5 }, // Higher due to food waste and preparation
  "food-and-dining-delivery-services": { id: "food-and-dining-delivery-services", name: "Delivery Services", parentId: "food-and-dining", emissionFactor: 3.1 }, // Includes delivery transport

  // Transport - Updated with realistic fuel consumption ratios
  "transport": { id: "transport", name: "Transport" },
  "transport-public-transport": { id: "transport-public-transport", name: "Public Transport", parentId: "transport", emissionFactor: 0.15 },
  "transport-private-vehicle-fuel": { id: "transport-private-vehicle-fuel", name: "Private Vehicle Fuel", parentId: "transport" },
  "transport-private-vehicle-fuel-gasoline": { id: "transport-private-vehicle-fuel-gasoline", name: "Gasoline", parentId: "transport-private-vehicle-fuel", emissionFactor: 0.82 }, // ~2.3 kg CO₂/liter ÷ €1.4/liter
  "transport-private-vehicle-fuel-diesel": { id: "transport-private-vehicle-fuel-diesel", name: "Diesel", parentId: "transport-private-vehicle-fuel", emissionFactor: 0.95 }, // ~2.6 kg CO₂/liter ÷ €1.3/liter
  "transport-private-vehicle-fuel-electric": { id: "transport-private-vehicle-fuel-electric", name: "Electric", parentId: "transport-private-vehicle-fuel", emissionFactor: 0.25 }, // Depends on grid mix
  "transport-air-travel": { id: "transport-air-travel", name: "Air Travel", parentId: "transport" },
  "transport-air-travel-domestic": { id: "transport-air-travel-domestic", name: "Domestic Flights", parentId: "transport-air-travel", emissionFactor: 1.2 }, // Much higher - aviation is carbon-intensive
  "transport-air-travel-international": { id: "transport-air-travel-international", name: "International Flights", parentId: "transport-air-travel", emissionFactor: 0.8 }, // More efficient per km but still high
  "transport-taxi": { id: "transport-taxi", name: "Taxi", parentId: "transport", emissionFactor: 0.45 },
  "transport-rider-services": { id: "transport-rider-services", name: "Rider Services", parentId: "transport", emissionFactor: 0.38 },

  // Housing and Utilities - Regional variations for electricity
  "housing-and-utilities": { id: "housing-and-utilities", name: "Housing and Utilities" },
  "housing-and-utilities-electricity": { id: "housing-and-utilities-electricity", name: "Electricity", parentId: "housing-and-utilities" },
  "housing-and-utilities-electricity-renewable": { id: "housing-and-utilities-electricity-renewable", name: "Electricity (Renewable)", parentId: "housing-and-utilities-electricity", proportion: 0.6, emissionFactor: 0.1 }, // EU renewable average
  "housing-and-utilities-electricity-coal-based": { id: "housing-and-utilities-electricity-coal-based", name: "Electricity (Coal-Based)", parentId: "housing-and-utilities-electricity", proportion: 0.4, emissionFactor: 1.2 }, // Eastern Europe coal plants
  "housing-and-utilities-water-usage": { id: "housing-and-utilities-water-usage", name: "Water Usage", parentId: "housing-and-utilities", emissionFactor: 0.08 },
  "housing-and-utilities-heating": { id: "housing-and-utilities-heating", name: "Heating", parentId: "housing-and-utilities" },
  "housing-and-utilities-heating-natural-gas": { id: "housing-and-utilities-heating-natural-gas", name: "Heating (Natural Gas)", parentId: "housing-and-utilities-heating", proportion: 0.5, emissionFactor: 0.52 }, // ~0.185 kg CO₂/kWh
  "housing-and-utilities-heating-electric": { id: "housing-and-utilities-heating-electric", name: "Heating (Electric)", parentId: "housing-and-utilities-heating", proportion: 0.5, emissionFactor: 0.35 }, // Grid average
  "housing-and-utilities-rent-mortgage": { id: "housing-and-utilities-rent-mortgage", name: "Rent/Mortgage", parentId: "housing-and-utilities", emissionFactor: 0.12 }, // Embodied carbon in housing
  "housing-and-utilities-internet-phone": { id: "housing-and-utilities-internet-phone", name: "Internet/Phone", parentId: "housing-and-utilities", emissionFactor: 0.18 }, // Data centers
  "housing-and-utilities-comunidad-de-vecinos": { id: "housing-and-utilities-comunidad-de-vecinos", name: "Comunidad de vecinos", parentId: "housing-and-utilities", emissionFactor: 0.15 },
  "housing-and-utilities-cleaning-service": { id: "housing-and-utilities-cleaning-service", name: "Cleaning Service", parentId: "housing-and-utilities", emissionFactor: 0.25 },
  "housing-and-utilities-fix-maintenance": { id: "housing-and-utilities-fix-maintenance", name: "Fix/Maintenance", parentId: "housing-and-utilities", emissionFactor: 0.35 }, // Materials and transport
  "housing-and-utilities-cloud-services": { id: "housing-and-utilities-cloud-services", name: "Cloud Services and Subscriptions", parentId: "housing-and-utilities", emissionFactor: 0.22 },

  // Shopping - Updated based on product lifecycle assessments
  "shopping": { id: "shopping", name: "Shopping" },
  "shopping-clothing": { id: "shopping-clothing", name: "Clothing", parentId: "shopping" },
  "shopping-clothing-fast-fashion": { id: "shopping-clothing-fast-fashion", name: "Clothing (Fast Fashion)", parentId: "shopping-clothing", proportion: 0.2, emissionFactor: 4.5 }, // Very high due to production methods
  "shopping-clothing-sustainable-brands": { id: "shopping-clothing-sustainable-brands", name: "Clothing (Sustainable Brands)", parentId: "shopping-clothing", proportion: 0.8, emissionFactor: 1.8 },
  "shopping-electronics": { id: "shopping-electronics", name: "Electronics", parentId: "shopping", emissionFactor: 2.1 }, // Manufacturing intensive
  "shopping-furniture-wooden": { id: "shopping-furniture-wooden", name: "Furniture (Wooden)", parentId: "shopping", emissionFactor: 1.2 },
  "shopping-furniture-metal": { id: "shopping-furniture-metal", name: "Furniture (Metal)", parentId: "shopping", emissionFactor: 2.8 }, // Steel production
  "shopping-personal-care": { id: "shopping-personal-care", name: "Personal Care", parentId: "shopping", emissionFactor: 1.1 },
  "shopping-gifts": { id: "shopping-gifts", name: "Gifts", parentId: "shopping", emissionFactor: 1.5 }, // Average of various products
  "shopping-house-utils": { id: "shopping-house-utils", name: "House Utils", parentId: "shopping", emissionFactor: 0.85 },

  // Entertainment and Recreation
  "entertainment-and-recreation": { id: "entertainment-and-recreation", name: "Entertainment and Recreation" },
  "entertainment-and-recreation-streaming-services": { id: "entertainment-and-recreation-streaming-services", name: "Streaming Services", parentId: "entertainment-and-recreation", emissionFactor: 0.35 }, // Data transmission and servers
  "entertainment-and-recreation-movies-and-events": { id: "entertainment-and-recreation-movies-and-events", name: "Movies and Events", parentId: "entertainment-and-recreation", emissionFactor: 0.45 },
  "entertainment-and-recreation-outdoor-activities": { id: "entertainment-and-recreation-outdoor-activities", name: "Outdoor Activities", parentId: "entertainment-and-recreation", emissionFactor: 0.25 },
  "entertainment-and-recreation-travel-and-tourism-hotels": { id: "entertainment-and-recreation-travel-and-tourism-hotels", name: "Travel and Tourism (Hotels)", parentId: "entertainment-and-recreation", emissionFactor: 0.65 }, // Hotel operations
  "entertainment-and-recreation-gym-membership": { id: "entertainment-and-recreation-gym-membership", name: "Gym Membership", parentId: "entertainment-and-recreation", emissionFactor: 0.32 },
  "entertainment-and-recreation-video-games": { id: "entertainment-and-recreation-video-games", name: "Video Games", parentId: "entertainment-and-recreation", emissionFactor: 0.28 },
  "entertainment-and-recreation-physical-games": { id: "entertainment-and-recreation-physical-games", name: "Physical Games", parentId: "entertainment-and-recreation", emissionFactor: 0.95 },

  // Healthcare
  "healthcare": { id: "healthcare", name: "Healthcare" },
  "healthcare-medication": { id: "healthcare-medication", name: "Medication", parentId: "healthcare", emissionFactor: 1.8 }, // Pharmaceutical manufacturing is intensive
  "healthcare-health-services": { id: "healthcare-health-services", name: "Health Services", parentId: "healthcare", emissionFactor: 0.55 },
  "healthcare-supplements": { id: "healthcare-supplements", name: "Supplements", parentId: "healthcare", emissionFactor: 1.2 },

  // Education
  "education": { id: "education", name: "Education" },
  "education-books": { id: "education-books", name: "Books", parentId: "education" },
  "education-books-physical": { id: "education-books-physical", name: "Books (Physical)", parentId: "education-books", emissionFactor: 1.1 }, // Paper production
  "education-books-digital": { id: "education-books-digital", name: "Books (Digital)", parentId: "education-books", emissionFactor: 0.05 },
  "education-online-courses": { id: "education-online-courses", name: "Online Courses", parentId: "education", emissionFactor: 0.12 },
  "education-school-supplies": { id: "education-school-supplies", name: "School Supplies", parentId: "education", emissionFactor: 0.65 },

  // Miscellaneous
  "miscellaneous": { id: "miscellaneous", name: "Miscellaneous" },
  "miscellaneous-donations": { id: "miscellaneous-donations", name: "Donations", parentId: "miscellaneous", emissionFactor: 0.02 }, // Administrative costs only
  "miscellaneous-pet-care": { id: "miscellaneous-pet-care", name: "Pet Care", parentId: "miscellaneous", emissionFactor: 1.5 }, // Pet food has high emissions
  "miscellaneous-hobbies": { id: "miscellaneous-hobbies", name: "Hobbies", parentId: "miscellaneous", emissionFactor: 0.85 },
  "miscellaneous-others": { id: "miscellaneous-others", name: "Others", parentId: "miscellaneous", emissionFactor: 0.5 }, // Conservative average
  "miscellaneous-internal": { id: "miscellaneous-internal", name: "Internal", parentId: "miscellaneous", emissionFactor: 0 },
  "miscellaneous-lawyer": { id: "miscellaneous-lawyer", name: "Lawyer", parentId: "miscellaneous", emissionFactor: 0.15 }, // Office services

  // Taxes/Fees
  "taxes-fees": { id: "taxes-fees", name: "Taxes/Fees" },
  "taxes-fees-income-tax": { id: "taxes-fees-income-tax", name: "Income Tax", parentId: "taxes-fees", emissionFactor: 0.08 }, // Government operations
  "taxes-fees-property-tax": { id: "taxes-fees-property-tax", name: "Property Tax", parentId: "taxes-fees", emissionFactor: 0.05 },
  "taxes-fees-customs-duties": { id: "taxes-fees-customs-duties", name: "Customs Duties", parentId: "taxes-fees", emissionFactor: 0.12 },
  "taxes-fees-currency-exchange-fees": { id: "taxes-fees-currency-exchange-fees", name: "Currency Exchange Fees", parentId: "taxes-fees", emissionFactor: 0.02 },
}

const incomeCategories: Record<string, FlatCategory> = {

  // Salary and Wages
  "income-salary-and-wages": { id: "income-salary-and-wages", name: "Salary and Wages" },
  "income-salary-and-wages-full-time-job": { id: "income-salary-and-wages-full-time-job", name: "Full-Time Job", parentId: "income-salary-and-wages" },
  "income-salary-and-wages-part-time-job": { id: "income-salary-and-wages-part-time-job", name: "Part-Time Job", parentId: "income-salary-and-wages" },
  "income-salary-and-wages-overtime-and-bonuses": { id: "income-salary-and-wages-overtime-and-bonuses", name: "Overtime and Bonuses", parentId: "income-salary-and-wages" },

  // ... (rest of income categories - no emission factors needed)
}

export const categories: Record<string,FlatCategory> = { ...expenseCategories, ...incomeCategories };

// Utility function to get regional emission factor adjustments
export const getRegionalAdjustment = (category: string, region: string = 'EU'): number => {
  const adjustments: Record<string, Record<string, number>> = {
    'housing-and-utilities-electricity': {
      'EU': 1.0,      // Base (mix of renewables and fossil)
      'NO': 0.1,      // Norway (hydro)
      'FR': 0.3,      // France (nuclear)
      'DE': 1.2,      // Germany (coal transition)
      'PL': 1.8,      // Poland (coal heavy)
      'US': 1.1,      // United States
      'CN': 2.0,      // China (coal heavy)
    },
    'transport-private-vehicle-fuel-electric': {
      'EU': 1.0,
      'NO': 0.2,      // Clean grid
      'PL': 2.5,      // Dirty grid makes EVs less efficient
      'FR': 0.4,      // Nuclear grid
    }
  };
  
  return adjustments[category]?.[region] || 1.0;
};

// Utility to update emission factors based on latest data
export const updateEmissionFactors = (updates: Record<string, number>) => {
  Object.keys(updates).forEach(categoryId => {
    if (categories[categoryId]) {
      categories[categoryId].emissionFactor = updates[categoryId];
      categories[categoryId].lastUpdated = new Date().toISOString();
    }
  });
};