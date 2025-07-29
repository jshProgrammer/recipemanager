import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [lastSearchOptions, setLastSearchOptions] = useState({});
  
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedIntolerances, setSelectedIntolerances] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [activeTag, setActiveTag] = useState(""); 

  const value = {
    query,
    setQuery,
    results,
    setResults,
    hasSearched,
    setHasSearched,
    isLoading,
    setIsLoading,
    
    currentOffset,
    setCurrentOffset,
    totalResults,
    setTotalResults,
    lastSearchOptions,
    setLastSearchOptions,
    
    selectedDiet,
    setSelectedDiet,
    selectedIntolerances,
    setSelectedIntolerances,
    selectedIngredients,
    setSelectedIngredients,
    maxReadyTime,
    setMaxReadyTime,
    activeTag,
    setActiveTag,
    
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
};