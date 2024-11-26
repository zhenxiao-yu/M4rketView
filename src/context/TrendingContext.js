import { createContext, useLayoutEffect, useState } from "react";

// Create the context object
export const TrendingContext = createContext({});

// Create the provider component
export const TrendingProvider = ({ children }) => {
  const [trendData, setTrendData] = useState(); // State to hold trending data
  const [error, setError] = useState(null); // State to hold any errors during fetch

  /**
   * Fetch trending data from the CoinGecko API.
   */
  const getTrendData = async () => {
    setError(null); // Clear any previous errors
    try {
      const response = await fetch(`https://api.coingecko.com/api/v3/search/trending`);

      if (!response.ok) {
        throw new Error(`Failed to fetch trending data: ${response.statusText}`);
      }

      const data = await response.json();
      setTrendData(data.coins); // Update the trending data state
    } catch (err) {
      console.error("Error fetching trending data:", err);
      setError(err.message); // Set error state for better feedback
    }
  };

  /**
   * Reset and re-fetch the trending data.
   */
  const resetTrendingResult = () => {
    getTrendData();
  };

  /**
   * Fetch trending data on initial render.
   */
  useLayoutEffect(() => {
    getTrendData();
  }, []);

  return (
      <TrendingContext.Provider
          value={{
            trendData,
            resetTrendingResult,
            error, // Provide error state for error handling in UI
          }}
      >
        {children}
      </TrendingContext.Provider>
  );
};
