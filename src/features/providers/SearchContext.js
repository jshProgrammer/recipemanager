import React, { createContext, useContext, useState } from 'react';

const SearchContext = createContext();

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
  const [maxPrice, setMaxPrice] = useState("");
  const [maxReadyTime, setMaxReadyTime] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [useEquipmentFilter, setUseEquipmentFilter] = useState(false);
  const [userEquipment, setUserEquipment] = useState({});

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
    setMaxPrice("");
    setMaxReadyTime("");
    setActiveTag("");
    setUseEquipmentFilter(false);
    setUserEquipment({});
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
        maxPrice, setMaxPrice,
        maxReadyTime, setMaxReadyTime,
        activeTag, setActiveTag,
        useEquipmentFilter, setUseEquipmentFilter,
        userEquipment, setUserEquipment,
        resetSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => useContext(SearchContext); 