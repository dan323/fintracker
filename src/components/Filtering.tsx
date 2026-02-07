import React, { JSX, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { Filters } from '../models/transaction';
import { FlatCategory, categories } from '../models/categories';
import "./filter.css";
import { useTranslation } from '../i18n';

const Filtering: React.FC = () => {
  const { t } = useTranslation();
  const { setFilters } = useFilters(); // Access the setFilters method from the context

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [account, setAccount] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date('2010-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date());

  // Format a date to YYYY-MM-DD for input[type="date"]
  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Update filters in context
  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev: Filters) => ({ ...prev, ...newFilters }));
  };

  const countDepth = (catName: string): number => {
    const cats = categories || {};
    if (!cats[catName]) {
      return 0;
    } else {
      if (cats[catName].parentId) {
        return 1 +  countDepth(cats[catName].parentId);
      } else {
        return 0;
      }
    }
  }

  // Generate nested options from categories
  const toOptions = (categories: Record<string,FlatCategory>): JSX.Element[] => {
    const cats = categories || {};
    return Object.keys(cats).flatMap((cat) => {
      const prefix = "-".repeat(countDepth(cat));
      return (<option key={cat} value={cat}>
        {prefix + cats[cat].name}
      </option>);
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    if (selectedName === '') return;
    const updatedCategories = [...selectedCategories, selectedName];
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  const removeCategory = (category: string) => {
    const updatedCategories = selectedCategories.filter((cat) => cat !== category);
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  return (
    <div className="filter-bar">
      {/* Category Selector */}
      <label htmlFor="category-select">{t('filter.categories')}</label>
      <select id="category-select" value="" onChange={handleCategoryChange}>
        <option value="">{t('filter.selectCategory')}</option>
        {toOptions(categories)}
      </select>

      <div className="selected-categories">
        {selectedCategories.map((category) => (
          <span key={category} className="category-tag">
            {categories[category].name}
            <button
              className="remove-category"
              onClick={() => removeCategory(category)}
              title={`Remove ${categories[category].name}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Account Filter */}
      <label htmlFor="account-input">{t('filter.account')}</label>
      <input
        id="account-input"
        type="text"
        placeholder={t('filter.account.placeholder')}
        value={account}
        onChange={(e) => {
          const newAccount = e.target.value;
          setAccount(newAccount);
          updateFilters({ account: newAccount });
        }}
      />

      {/* Date Range Filter */}
      <div className="date-range">
        <label htmlFor="start-date">{t('filter.start')}</label>
        <input
          id="start-date"
          type="date"
          value={formatDate(startDate)}
          onChange={(e) => {
            const newStartDate = new Date(e.target.value);
            setStartDate(newStartDate);
            updateFilters({ dateRange: { start: newStartDate, end: endDate } });
          }}
          onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
        />

        <label htmlFor="end-date">{t('filter.end')}</label>
        <input
          id="end-date"
          type="date"
          value={formatDate(endDate)}
          onChange={(e) => {
            const newEndDate = new Date(e.target.value);
            setEndDate(newEndDate);
            updateFilters({ dateRange: { start: startDate, end: newEndDate } });
          }}
          onKeyDown={(e) => e.preventDefault()} // Prevent manual typing
        />
      </div>
    </div>
  );
};

export default Filtering;
