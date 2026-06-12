import { categoryName, toCategoryId, FALLBACK_CATEGORY_ID } from '../categories';

describe('toCategoryId', () => {
  it('returns canonical ids unchanged', () => {
    expect(toCategoryId('food-and-dining-groceries')).toBe('food-and-dining-groceries');
    expect(toCategoryId('miscellaneous-internal')).toBe('miscellaneous-internal');
  });

  it('maps display names to their id', () => {
    expect(toCategoryId('Groceries')).toBe('food-and-dining-groceries');
    expect(toCategoryId('Transport')).toBe('transport');
    expect(toCategoryId('Others')).toBe('miscellaneous-others');
  });

  it('matches names case-insensitively and ignoring surrounding spaces', () => {
    expect(toCategoryId('  groceries ')).toBe('food-and-dining-groceries');
    expect(toCategoryId('DINING OUT')).toBe('food-and-dining-dining-out');
  });

  it('falls back to miscellaneous-others for unknown or empty input', () => {
    expect(toCategoryId('not a category')).toBe(FALLBACK_CATEGORY_ID);
    expect(toCategoryId('')).toBe(FALLBACK_CATEGORY_ID);
    expect(toCategoryId(undefined)).toBe(FALLBACK_CATEGORY_ID);
  });
});

describe('categoryName', () => {
  it('returns the display name for an id', () => {
    expect(categoryName('food-and-dining-groceries')).toBe('Groceries');
  });

  it('keeps legacy names readable via the id round-trip', () => {
    expect(categoryName('Groceries')).toBe('Groceries');
    expect(categoryName('whatever')).toBe('Others');
  });
});
