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
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [lastSearchOptions, setLastSearchOptions] = useState({});
  const [selectedDiet, setSelectedDiet] = useState("");
  const [selectedIntolerances, setSelectedIntolerances] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [useEquipmentFilter, setUseEquipmentFilter] = useState(false);

  // Reset function for new search or clear
  const resetSearch = () => {
    setQuery("");
    setResults([]);
    setAutocompleteResults([]);
    setShowAutocomplete(false);
    setIsLoading(false);
    setHasSearched(false);
    setCurrentOffset(0);
    setTotalResults(0);
    setIsLoadingMore(false);
    setLastSearchOptions({});
    setSelectedDiet("");
    setSelectedIntolerances("");
    setSelectedIngredients("");
    setMaxReadyTime("");
    setActiveTag("");
    setUseEquipmentFilter(false);
  };

  return (
    <SearchContext.Provider
      value={{
        query, setQuery,
        results, setResults,
        autocompleteResults, setAutocompleteResults,
        showAutocomplete, setShowAutocomplete,
        isLoading, setIsLoading,
        hasSearched, setHasSearched,
        currentOffset, setCurrentOffset,
        totalResults, setTotalResults,
        isLoadingMore, setIsLoadingMore,
        lastSearchOptions, setLastSearchOptions,
        selectedDiet, setSelectedDiet,
        selectedIntolerances, setSelectedIntolerances,
        selectedIngredients, setSelectedIngredients,
        maxReadyTime, setMaxReadyTime,
        activeTag, setActiveTag,
        useEquipmentFilter, setUseEquipmentFilter,
        resetSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
