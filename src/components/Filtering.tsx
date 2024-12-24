import React, { useState } from 'react';
import { useFilters } from '../context/FilterContext';
import { Filters } from '../models/transaction';

interface Props {}

const Filtering: React.FC<Props> = () => {
  const { setFilters } = useFilters(); // Access the setFilters method from the context

  const [category, setCategory] = useState<string>('');
  const [account, setAccount] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('2010-01-01');
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<'' | 'positive' | 'negative'>('');

  const updateFilters = (newFilters: Partial<Filters>) => {
    setFilters((prev) => ({
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
      <input
        type="date"
        value={startDate}
        onChange={(e) => {
          const newStartDate = e.target.value;
          setStartDate(newStartDate);
          updateFilters({ dateRange: { start: newStartDate, end: endDate } });
        }}
      />
      <input
        type="date"
        value={endDate}
        onChange={(e) => {
          const newEndDate = e.target.value;
          setEndDate(newEndDate);
          updateFilters({ dateRange: { start: startDate, end: newEndDate } });
        }}
      />
      <select
        value={type}
        onChange={(e) => {
          const newType = e.target.value as '' | 'positive' | 'negative';
          setType(newType);
          updateFilters({ type: newType });
        }}
      >
        <option value="">Todos</option>
        <option value="positive">Ingresos</option>
        <option value="negative">Gastos</option>
      </select>
    </div>
  );
};

export default Filtering;
