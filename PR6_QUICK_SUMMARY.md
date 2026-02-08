# PR #6 Quick Status Summary

## Progress: 7/11 Fixed (64%) ✅

```
Critical Issues:     [■■■□□]  1/2 fixed (50%)
High Priority:       [□□□□□]  0/2 fixed (0%)
Medium Priority:     [■■■■■□] 5/7 fixed (71%)
```

## What's Fixed ✅

### Critical (1/2)
- ✅ Category comparison now uses translations

### High Priority (0/2)  
- ❌ Locale initialization race condition
- ❌ LocalStorage validation missing

### Medium (5/7)
- ✅ Translation key consistency
- ✅ Hardcoded Spanish in toggles
- ✅ Hardcoded English in pie charts
- ✅ Carbon tooltip wrong key
- ✅ Back button language inference
- ✅ Toggle label mappings
- ❌ Bar chart "Totales" hardcoded

## What's Left ❌

### 🔴 Must Fix (Critical)
**Issue:** CSV import data pollution  
**File:** `src/components/CsvUploader.tsx` lines 74-75  
**Current:**
```tsx
category: row.category || t('filter.selectCategory'),
account: row.account || t('filter.account.placeholder'),
```
**Fix:**
```tsx
category: row.category || t('categories.other'),
account: row.account || t('account.unknown'),
```
**Why critical:** Pollutes database with UI strings like "Select a category"

---

### 🟡 Should Fix (High)
**Issue #1:** Locale initialization flash  
**File:** `src/i18n/index.tsx` line 24  
**Current:**
```tsx
const [locale, setLocale] = useState<Locale>('es');
```
**Fix:**
```tsx
const getInitialLocale = (): Locale => {
  try {
    const saved = window.localStorage.getItem('fintracker_locale');
    if (saved === 'es' || saved === 'en') return saved;
  } catch { }
  return 'es';
};
const [locale, setLocale] = useState<Locale>(getInitialLocale());
```

**Issue #2:** LocalStorage validation  
**File:** `src/components/LanguageSwitcher.tsx` line 10  
**Current:**
```tsx
const saved = window.localStorage.getItem(STORAGE_KEY) as 'es' | 'en' | null;
```
**Fix:**
```tsx
const isSupportedLocale = (value: string | null): value is 'es' | 'en' =>
  value === 'es' || value === 'en';

const savedRaw = window.localStorage.getItem(STORAGE_KEY);
if (isSupportedLocale(savedRaw) && savedRaw !== locale) {
  setLocale(savedRaw);
}
```

---

### 🟠 Nice to Fix (Medium)
**Issue:** Hardcoded bar chart label  
**File:** `src/components/bar-charts/TransactionChart.tsx` line 100  
**Current:**
```tsx
name="Totales"
```
**Fix:**
```tsx
name={t('chart.toggle.total')}
```

---

## Time Estimate
⏱️ All 4 fixes: **~30 minutes**

## Files to Change
1. `src/components/CsvUploader.tsx` (2 lines)
2. `src/i18n/index.tsx` (add function, change 1 line)
3. `src/components/LanguageSwitcher.tsx` (add validation function, change useEffect)
4. `src/components/bar-charts/TransactionChart.tsx` (1 line)

Total: **4 files, ~20 lines of code**
