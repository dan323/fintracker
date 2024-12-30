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

export const subCategories = (cat: FlatCategory): FlatCategory[] => {
    return Object.values(categories).filter((c) => isUnderCategory(c, cat) && c.id !== cat.id);
}