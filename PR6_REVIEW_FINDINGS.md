# Code Review: PR #6 - Internationalization

**Reviewer:** GitHub Copilot Coding Agent  
**Date:** 2026-02-08  
**PR:** #6 - Internationalization  
**Status:** Reviewed - Issues Found

## Overview
This PR adds internationalization (i18n) support to the fintracker application with Spanish and English translations. The implementation includes a custom i18n provider, translation files, and a language switcher component. While the overall approach is solid, there are several issues that need to be addressed.

---

## Critical Issues

### 1. Translation Key Mismatch: "total" vs "totals"
**Severity:** 🔴 Critical  
**Files:** 
- `src/i18n/locales/es.json` (line 33)
- `src/i18n/locales/en.json` (line 34)
- `src/components/table/TransactionTable.tsx` (line 28)
- `src/components/bar-charts/TransactionChart.tsx` (line 90)

**Issue:** The Spanish translation file uses `"chart.toggle.total"` (singular) while the English file uses `"chart.toggle.totals"` (plural). The code references both keys inconsistently:
- `TransactionTable.tsx` uses `t('chart.toggle.total')` 
- `TransactionChart.tsx` uses `t('chart.toggle.totals')`

**Impact:** When switching to English, `TransactionTable` will fail to find the translation and show the key string or fallback to Spanish. When in Spanish, `TransactionChart` will have the same issue.

**Recommendation:** Standardize on one key name (suggest `"chart.toggle.totals"`) in both locale files and update all code references to use the same key.

---

### 2. Hardcoded Category Comparison Breaks i18n
**Severity:** 🔴 Critical  
**File:** `src/components/pie-charts/PieChartCategoryAccount.tsx` (line 71)

**Issue:** The code compares transaction categories against the hardcoded English string `"Internal"`:
```tsx
if (tx.category !== "Internal") {
```

**Impact:** When the app displays in Spanish, transactions with category "Interno" won't be filtered out as internal movements, breaking the analytics logic.

**Recommendation:** Use the translated category name:
```tsx
if (tx.category !== t('categories.internal')) {
```

---

### 3. CSV Import Using UI Translation Strings as Data Values
**Severity:** 🔴 Critical  
**File:** `src/components/CsvUploader.tsx` (line 74-75)

**Issue:** The CSV importer uses UI translation strings as fallback values for category and account:
```tsx
category: row.category || t('filter.selectCategory'),
account: row.account || t('filter.account.placeholder'),
```

**Impact:** This pollutes the data with UI strings like "Select a category" or "Seleccionar una categoría" depending on the active locale, which will break filtering and analytics.

**Recommendation:** Use stable canonical fallback values:
```tsx
category: row.category || "Others",
account: row.account || "Unknown",
```

---

## High Priority Issues

### 4. Race Condition in Locale Initialization
**Severity:** 🟡 High  
**Files:** 
- `src/i18n/index.tsx` (line 24)
- `src/components/LanguageSwitcher.tsx` (lines 9-14)

**Issue:** The `I18nProvider` initializes with hardcoded Spanish (`useState<Locale>('es')`), but `LanguageSwitcher` tries to override this from localStorage in a `useEffect` that runs after the first render.

**Impact:** Users see a "flash" of Spanish text on every app load before switching to their saved language preference.

**Recommendation:** Initialize the locale by reading from localStorage immediately:
```tsx
const getInitialLocale = (): Locale => {
  try {
    const saved = window.localStorage.getItem('fintracker_locale');
    if (saved === 'es' || saved === 'en') return saved;
  } catch (err) {
    // localStorage not available
  }
  return 'es';
};

const [locale, setLocale] = useState<Locale>(getInitialLocale());
```

---

### 5. Missing LocalStorage Validation
**Severity:** 🟡 High  
**File:** `src/components/LanguageSwitcher.tsx` (line 11)

**Issue:** The code type-asserts localStorage value without runtime validation:
```tsx
const saved = window.localStorage.getItem(STORAGE_KEY) as 'es' | 'en' | null;
```

**Impact:** If storage contains an unexpected value (manual edit/corruption), the app can enter an invalid locale state.

**Recommendation:** Add runtime validation:
```tsx
const isSupportedLocale = (value: string | null): value is 'es' | 'en' =>
  value === 'es' || value === 'en';

const savedRaw = window.localStorage.getItem(STORAGE_KEY);
if (isSupportedLocale(savedRaw) && savedRaw !== locale) {
  setLocale(savedRaw);
}
```

---

## Medium Priority Issues

### 6. Hardcoded Spanish Labels in Internationalized Components
**Severity:** 🟠 Medium  
**Files:**
- `src/components/pie-charts/PieChartCategoryAccount.tsx` (line 121)
- `src/components/table/TransactionTable.tsx` (line 35)

**Issue:** Toggle components have hardcoded Spanish labels:
```tsx
label="siendo agrupadas"  // PieChartCategoryAccount
label="siendo mostrados"  // TransactionTable
```

**Impact:** These labels don't change when users switch to English.

**Recommendation:** Add translation keys and use `t()`:
```tsx
label={t('chart.toggle.groupedBy')}
label={t('chart.toggle.showing')}
```

---

### 7. Hardcoded English Text in Pie Chart Headings
**Severity:** 🟠 Medium  
**File:** `src/components/pie-charts/PieChartCategoryAccount.tsx` (lines 130, 157)

**Issue:** Hardcoded "Main Categories" in English:
```tsx
`${t('chart.toggle.positive')} (Main Categories)`
`${t('chart.toggle.negative')} (Main Categories)`
```

**Impact:** This text doesn't translate to Spanish.

**Recommendation:** Add translation key:
```tsx
`${t('chart.toggle.positive')} (${t('chart.mainCategories')})`
```

And add to locale files:
- `en.json`: `"chart.mainCategories": "Main Categories"`
- `es.json`: `"chart.mainCategories": "Categorías Principales"`

---

### 8. Carbon Footprint Tooltip Using Wrong Translation Key
**Severity:** 🟠 Medium  
**File:** `src/components/line-charts/CarbonFootPrint.tsx` (line 107)

**Issue:** Tooltip label uses `t('filter.start')` which is meant for date range filters ("Start:"):
```tsx
labelFormatter={(label) => `${t('filter.start')} ${label}`}
```

**Impact:** Produces incorrect tooltip text like "Start: Jan 2024" instead of "Month: Jan 2024".

**Recommendation:** Add a dedicated translation key:
```tsx
labelFormatter={(label) => `${t('carbon.monthLabel')} ${label}`}
```

---

### 9. Hardcoded "Totales" in Bar Chart
**Severity:** 🟠 Medium  
**File:** `src/components/bar-charts/TransactionChart.tsx` (line 100)

**Issue:** When `showRevenue` is false, the bar label is hardcoded:
```tsx
<Bar dataKey="profit" fill="#000000" name="Totales">
```

**Impact:** The legend remains in Spanish when the user switches to English.

**Recommendation:** Use translation:
```tsx
<Bar dataKey="profit" fill="#000000" name={t('chart.toggle.totals')}>
```

---

### 10. Brittle Language Inference for Back Button
**Severity:** 🟠 Medium  
**File:** `src/components/pie-charts/PieChartCategoryAccount.tsx` (line 115)

**Issue:** The back button text uses a conditional that returns the same string in both branches, relying on `t('table.actions')` to infer language.

**Impact:** This is fragile and won't scale if more locales are added.

**Recommendation:** Add a dedicated translation key for the back button:
```tsx
<button onClick={() => setSelectedCategory(null)}>
  {t('button.backToAllCategories')}
</button>
```

---

### 11. Toggle Labels Not Properly Internationalized
**Severity:** 🟠 Medium  
**File:** `src/components/pie-charts/PieChartCategoryAccount.tsx` (line 125)

**Issue:** The toggle's label and option texts are mapped to incorrect keys:
- `textOff` uses `t('chart.toggle.account')` which includes a colon meant for form labels
- `textOn` uses `t('chart.toggle.categories')` which is a plural form

**Impact:** Toggle text may not make sense grammatically in all contexts.

**Recommendation:** Review and ensure translation keys match their usage context.

---

## Positive Aspects

✅ Good overall i18n architecture with centralized provider  
✅ Clean separation of translation files by locale  
✅ Persistent language preference with localStorage  
✅ User-facing language switcher component  
✅ Comprehensive coverage of most UI strings  
✅ Updated README with clear i18n documentation  

---

## Summary

**Total Issues Found:** 11  
- Critical: 3  
- High: 2  
- Medium: 6  

**Recommendation:** Address all critical and high priority issues before merging. Medium priority issues should also be fixed to ensure a fully internationalized experience.

---

## Additional Notes

1. Consider adding TypeScript strict mode to catch translation key mismatches at compile time
2. Consider using a linting tool for translation keys (e.g., i18next-parser)
3. Add unit tests to verify translation key consistency
4. Consider extracting the `STORAGE_KEY` constant to a shared configuration file
5. The custom agent configuration file (`.github/agents/my-agent.agent.md`) looks good and could help with future PR reviews

---

**Review completed by:** GitHub Copilot Coding Agent  
**Contact:** Available through PR comments
