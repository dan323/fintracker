import { categories, FlatCategory } from "../models/categories"

export const parentCategory = (category: FlatCategory): FlatCategory => {
    if (category.parentId) {
        return parentCategory(categories[category.parentId]);
    } else {
        return category;
    }
}

export const isUnderCategory = (subCategory: FlatCategory, superCategory: FlatCategory): boolean => {
    if (subCategory.id === superCategory.id) return true;
    if (subCategory.parentId) {
        return isUnderCategory(categories[subCategory.parentId], superCategory);
    } else {
        return false;
    }

}

export const findCategoryByName = (catName: string): FlatCategory => {
    return Object.values(categories).find((c) => c.name === catName) || categories['miscellaneous-others'];
}

export const FALLBACK_CATEGORY_ID = 'miscellaneous-others';

const normalizeForLookup = (text: string): string =>
    text.trim().toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

const categoryIdByNormalizedKey: Record<string, string> = Object.values(categories)
    .reduce((acc, c) => {
        acc[c.id] = c.id;
        acc[normalizeForLookup(c.name)] = c.id;
        return acc;
    }, {} as Record<string, string>);

/**
 * Resolves arbitrary category input (canonical id, display name, or legacy
 * free text from CSV imports / old saved files) to a canonical category id.
 * Unknown input falls back to "miscellaneous-others".
 */
export const toCategoryId = (input: string | undefined | null): string => {
    if (!input) return FALLBACK_CATEGORY_ID;
    if (categories[input]) return input;
    return categoryIdByNormalizedKey[normalizeForLookup(input)] ?? FALLBACK_CATEGORY_ID;
}

/**
 * Resolves arbitrary category input to its FlatCategory. Never returns
 * undefined: unknown input resolves to the fallback category.
 */
export const toCategory = (input: string | undefined | null): FlatCategory =>
    categories[toCategoryId(input)] ?? categories[FALLBACK_CATEGORY_ID];

/** Display name for a transaction category (id or legacy free text). */
export const categoryName = (category: string): string =>
    toCategory(category).name;

export const subCategories = (cat: FlatCategory): FlatCategory[] => {
    return Object.values(categories).filter((c) => isUnderCategory(c, cat) && c.id !== cat.id);
}