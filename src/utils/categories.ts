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

/**
 * Resolves arbitrary category input (canonical id, display name, or legacy
 * free text from CSV imports / old saved files) to a canonical category id.
 * Unknown input falls back to "miscellaneous-others".
 */
export const toCategoryId = (input: string | undefined | null): string => {
    if (!input) return FALLBACK_CATEGORY_ID;
    if (categories[input]) return input;
    const needle = normalizeForLookup(input);
    const match = Object.values(categories).find(
        (c) => c.id === needle || normalizeForLookup(c.name) === needle
    );
    return match ? match.id : FALLBACK_CATEGORY_ID;
}

/** Display name for a transaction category (id or legacy free text). */
export const categoryName = (category: string): string =>
    categories[toCategoryId(category)].name;

export const subCategories = (cat: FlatCategory): FlatCategory[] => {
    return Object.values(categories).filter((c) => isUnderCategory(c, cat) && c.id !== cat.id);
}