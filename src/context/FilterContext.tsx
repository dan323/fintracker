import React, { createContext, useContext, useState } from 'react';
import {Filters} from '../models/transaction'

// Create the context
const FilterContext = createContext<{
    filters: Filters;
    setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  }>({
    filters: {},
    setFilters: () => {},
  });

  export const FilterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [filters, setFilters] = useState<Filters>({});

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    );
};

// Hook to use the filter context
export const useFilters = () => useContext(FilterContext);