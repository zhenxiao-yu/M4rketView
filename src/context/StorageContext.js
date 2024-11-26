/* eslint-disable react-hooks/exhaustive-deps */
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { CryptoContext } from "./CryptoContext";

// Create the context object
export const StorageContext = createContext({});

// Create the provider component
export const StorageProvider = ({ children }) => {
  const [allCoins, setAllCoins] = useState([]);
  const [savedData, setSavedData] = useState();

  const { currency, sortBy } = useContext(CryptoContext);

  /**
   * Save a coin to local storage and update the state.
   * @param {string} coinId - The ID of the coin to be saved.
   */
  const saveCoin = (coinId) => {
    const oldCoins = JSON.parse(localStorage.getItem("coins")) || [];

    if (oldCoins.includes(coinId)) {
      return; // Do nothing if the coin is already saved
    }

    const newCoins = [...oldCoins, coinId];
    setAllCoins(newCoins);
    localStorage.setItem("coins", JSON.stringify(newCoins));
  };

  /**
   * Remove a coin from local storage and update the state.
   * @param {string} coinId - The ID of the coin to be removed.
   */
  const removeCoin = (coinId) => {
    const oldCoins = JSON.parse(localStorage.getItem("coins")) || [];

    const newCoins = oldCoins.filter((coin) => coin !== coinId);

    setAllCoins(newCoins);
    localStorage.setItem("coins", JSON.stringify(newCoins));
  };

  /**
   * Fetch data for saved coins.
   * @param {Array<string>} totalCoins - The list of coin IDs to fetch data for.
   */
  const getSavedData = async (totalCoins = allCoins) => {
    if (totalCoins.length === 0) {
      setSavedData([]); // Reset saved data if no coins are saved
      return;
    }

    try {
      const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${totalCoins.join(
              ","
          )}&order=${sortBy}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
      );

      if (!response.ok) {
        throw new Error(`Error fetching saved coins: ${response.statusText}`);
      }

      const data = await response.json();
      setSavedData(data);
    } catch (error) {
      console.error("Error fetching saved data:", error);
    }
  };

  /**
   * Re-fetch saved coin data based on current state.
   */
  const resetSavedResult = () => {
    getSavedData();
  };

  /**
   * Fetch saved data when `allCoins` changes.
   */
  useEffect(() => {
    if (allCoins.length > 0) {
      getSavedData(allCoins);
    } else {
      setSavedData([]);
    }
  }, [allCoins, currency, sortBy]);

  /**
   * Initialize local storage and state when the component mounts.
   */
  useLayoutEffect(() => {
    const storedCoins = JSON.parse(localStorage.getItem("coins")) || [];

    if (storedCoins.length > 0) {
      setAllCoins(storedCoins);
      getSavedData(storedCoins);
    } else {
      // Initialize local storage with an empty array if no coins exist
      localStorage.setItem("coins", JSON.stringify([]));
    }
  }, []);

  return (
      <StorageContext.Provider
          value={{
            saveCoin,
            allCoins,
            removeCoin,
            savedData,
            resetSavedResult,
          }}
      >
        {children}
      </StorageContext.Provider>
  );
};
