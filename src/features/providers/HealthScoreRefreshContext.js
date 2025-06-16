import { createContext, useContext, useState } from "react";

const HealthScoreRefreshContext = createContext();

export const HealthScoreRefreshProvider = ({ children }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => setRefreshKey(prev => prev + 1);

  return (
    <HealthScoreRefreshContext.Provider value={{ refreshKey, triggerRefresh }}>
      {children}
    </HealthScoreRefreshContext.Provider>
  );
};

export const useHealthScoreRefresh = () => useContext(HealthScoreRefreshContext);
