/* eslint-disable react-hooks/exhaustive-deps */
import { createContext, useLayoutEffect, useState } from "react";

// Create the context object
export const CryptoContext = createContext({});

// Create the provider component
export const CryptoProvider = ({ children }) => {
    // States for storing data
    const [cryptoData, setCryptoData] = useState();
    const [searchData, setSearchData] = useState();
    const [coinData, setCoinData] = useState();
    const [coinSearch, setCoinSearch] = useState("");

    // States for user preferences
    const [currency, setCurrency] = useState("usd");
    const [sortBy, setSortBy] = useState("market_cap_desc");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(250);
    const [perPage, setPerPage] = useState(10);

    // State for error handling
    const [error, setError] = useState({ data: "", coinData: "", search: "" });

    /**
     * Fetch crypto data from CoinGecko API based on user preferences.
     */
    const getCryptoData = async () => {
        setError((prev) => ({ ...prev, data: "" })); // Clear previous errors
        setCryptoData(); // Reset data state
        setTotalPages(13220); // Example total page count

        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&ids=${coinSearch}&order=${sortBy}&per_page=${perPage}&page=${page}&sparkline=false&price_change_percentage=1h%2C24h%2C7d`
            );

            if (!response.ok) {
                const errorResponse = await response.json();
                setError((prev) => ({ ...prev, data: errorResponse.error }));
                throw new Error(errorResponse.error);
            }

            const data = await response.json();
            setCryptoData(data); // Update crypto data state
        } catch (err) {
            console.error("Error fetching crypto data:", err);
        }
    };

    /**
     * Fetch detailed data for a specific coin.
     * @param {string} coinId - The ID of the coin.
     */
    const getCoinData = async (coinId) => {
        setCoinData(); // Reset coin data state
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=true&sparkline=false`
            );

            const data = await response.json();
            setCoinData(data); // Update coin data state
        } catch (err) {
            console.error("Error fetching coin data:", err);
        }
    };

    /**
     * Fetch search results for a query.
     * @param {string} query - The search term.
     */
    const getSearchResult = async (query) => {
        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/search?query=${query}`
            );

            const data = await response.json();
            setSearchData(data.coins); // Update search results state
        } catch (err) {
            console.error("Error fetching search results:", err);
        }
    };

    /**
     * Reset pagination and search states.
     */
    const resetFunction = () => {
        setPage(1);
        setCoinSearch("");
    };

    /**
     * Fetch data whenever dependencies change.
     */
    useLayoutEffect(() => {
        getCryptoData();
    }, [coinSearch, currency, sortBy, page, perPage]);

    return (
        <CryptoContext.Provider
            value={{
                cryptoData,
                searchData,
                getSearchResult,
                setCoinSearch,
                setSearchData,
                currency,
                setCurrency,
                sortBy,
                setSortBy,
                page,
                setPage,
                totalPages,
                resetFunction,
                setPerPage,
                perPage,
                getCoinData,
                coinData,
                error, // Include error state in the provider value
            }}
        >
            {children}
        </CryptoContext.Provider>
    );
};
