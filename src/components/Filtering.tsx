import React, { useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { Filters } from '../models/transaction';

const Filtering: React.FC<{}> = () => {
  const { setFilters } = useFilters(); // Access the setFilters method from the context

  const [category, setCategory] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [startDate, setStartDate] = useState<Date>(new Date('2010-01-01'));
  const [endDate, setEndDate] = useState<Date>(new Date());

  const formatDate = (date: Date): string => {
    const year = String(date.getFullYear()).padStart(4,'0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev: Filters) => ({
      ...prev,
      ...newFilters,
    }));
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        placeholder="Filtrar por categoría"
        value={category}
        onChange={(e) => {
          const newCategory = e.target.value;
          setCategory(newCategory);
          updateFilters({ category: newCategory });
        }}
      />
      <input
        type="text"
        placeholder="Filtrar por cuenta"
        value={account}
        onChange={(e) => {
          const newAccount = e.target.value;
          setAccount(newAccount);
          updateFilters({ account: newAccount });
        }}
      />
      <>
      <label>Inicio:</label>
      <input
        type="date"
        value={formatDate(startDate)}
        onChange={(e) => {
          const newStartDate = new Date(e.target.value);
          setStartDate(newStartDate);
          updateFilters({ dateRange: { start: newStartDate, end: endDate } });
        }}
        onKeyDown={(e) => e.preventDefault()} // Disallow typing
        title="Use the date picker to select a date"
      /></><>
      <label>Fin:</label>
      <input
        type="date"
        value={formatDate(endDate)}
        onChange={(e) => {
          const newEndDate = new Date(e.target.value);
          setEndDate(newEndDate);
          updateFilters({ dateRange: { start: startDate, end: newEndDate } });
        }}
        onKeyDown={(e) => e.preventDefault()} // Disallow typing
        title="Use the date picker to select a date"
      /></>
    </div>
  );
};

export default Filtering;
