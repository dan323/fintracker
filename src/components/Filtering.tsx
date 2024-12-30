import React, { JSX, useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { Filters } from '../models/transaction';
import { Categories, Category, categories } from '../models/categories';
import "./filter.css";

const Filtering: React.FC = () => {
  const { setFilters } = useFilters(); // Access the setFilters method from the context

  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
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

  // Generate nested options from categories
  const toOptions = (categories: Categories, prefix: string = ""): JSX.Element[] => {
    const cats = categories || {};
    return Object.keys(cats).flatMap((cat) => [
      <option key={prefix + cat} value={cat}>
        {prefix + cat}
      </option>,
      ...(cats[cat].subcategories ? toOptions(cats[cat].subcategories, `${prefix}— `) : []),
    ]);
  };

  // Recursively find a category by name
  const findByName = (name: string, categories: Categories): Category | null => {
    const cats = categories || {};
    for (const cat of Object.keys(cats)) {
      if (cat === name) return cats[cat];
      if (cats[cat].subcategories) {
        const found = findByName(name, cats[cat].subcategories);
        if (found) return found;
      }
    }
    return null;
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedName = e.target.value;
    if (selectedName === '') return;

    const newCategory = findByName(selectedName, categories);
    if (newCategory && !selectedCategories.includes(newCategory)) {
      const updatedCategories = [...selectedCategories, newCategory];
      setSelectedCategories(updatedCategories);
      updateFilters({ categories: updatedCategories });
    }
  };

  const removeCategory = (category: Category) => {
    const updatedCategories = selectedCategories.filter((cat) => cat !== category);
    setSelectedCategories(updatedCategories);
    updateFilters({ categories: updatedCategories });
  };

  return (
    <div className="filter-bar">
      {/* Category Selector */}
      <label htmlFor="category-select">Categorías:</label>
      <select id="category-select" value="" onChange={handleCategoryChange}>
        <option value="">Seleccionar una categoría</option>
        {toOptions(categories)}
      </select>

      <div className="selected-categories">
        {selectedCategories.map((category) => (
          <span key={category.name} className="category-tag">
            {category.name}
            <button
              className="remove-category"
              onClick={() => removeCategory(category)}
              title={`Remove ${category.name}`}
            >
              &times;
            </button>
          </span>
        ))}
      </div>

      {/* Account Filter */}
      <label htmlFor="account-input">Cuenta:</label>
      <input
        id="account-input"
        type="text"
        placeholder="Filtrar por cuenta"
        value={account}
        onChange={(e) => {
          const newAccount = e.target.value;
          setAccount(newAccount);
          updateFilters({ account: newAccount });
        }}
      />

      {/* Date Range Filter */}
      <div className="date-range">
        <label htmlFor="start-date">Inicio:</label>
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

        <label htmlFor="end-date">Fin:</label>
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
