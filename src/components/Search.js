import debounce from "lodash.debounce";
import React, { useContext, useState } from "react";
import searchIcon from "../assets/search-icon.svg";
import { CryptoContext } from "./../context/CryptoContext";

// SearchInput Component for user input and search result suggestions
const SearchInput = ({ handleSearch }) => {
  const [searchText, setSearchText] = useState("");
  const { searchData, setCoinSearch, setSearchData } = useContext(CryptoContext);

  // Handle user input and update the state
  const handleInput = (e) => {
    e.preventDefault();
    let query = e.target.value;
    setSearchText(query); // Update the search text state
    handleSearch(query); // Trigger the search handler
  };

  // Handle form submission (if Enter key is pressed or button is clicked)
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(searchText); // Trigger the search handler with the current text
  };

  // Select a coin from the search results
  const selectCoin = (coin) => {
    setCoinSearch(coin); // Set the selected coin in the context
    setSearchText(""); // Clear the search input
    setSearchData(); // Reset the search results
  };

  return (
      <>
        {/* Search input form */}
        <form
            className="w-96 relative flex items-center ml-7 font-nunito"
            onSubmit={handleSubmit}
        >
          <input
              type="text"
              name="search"
              onChange={handleInput}
              value={searchText}
              className="w-full rounded bg-gray-200 placeholder:text-gray-100 pl-2
            required outline-0 border border-transparent focus:border-cyan"
              placeholder="search here..."
          />
          <button type="submit" className="absolute right-1 cursor-pointer">
            <img src={searchIcon} className="w-full h-auto" alt="search" />
          </button>
        </form>

        {/* Render search results if there is text in the search input */}
        {searchText.length > 0 && (
            <ul
                className="absolute top-11 right-0 w-96 h-96 rounded overflow-x-hidden py-2
            bg-gray-200 bg-opacity-60 backdrop-blur-md scrollbar-thin
            scrollbar-thumb-gray-100 scrollbar-track-gray-200"
            >
              {searchData ? (
                  // Map over the search data to display results
                  searchData.map((coin) => (
                      <li
                          className="flex items-center ml-4 my-2 cursor-pointer"
                          key={coin.id}
                          onClick={() => selectCoin(coin.id)}
                      >
                        <img
                            className="w-[1rem] h-[1rem] mx-1.5"
                            src={coin.thumb}
                            alt={coin.name}
                        />
                        <span>{coin.name}</span>
                      </li>
                  ))
              ) : (
                  // Loading spinner when data is being fetched
                  <div className="w-full h-full flex justify-center items-center">
                    <div
                        className="w-8 h-8 border-4 border-cyan rounded-full border-b-gray-200 animate-spin"
                        role="status"
                    />
                    <span className="ml-2">Searching...</span>
                  </div>
              )}
            </ul>
        )}
      </>
  );
};

// Search Component
const Search = () => {
  const { getSearchResult } = useContext(CryptoContext);

  // Debounced function to limit the frequency of search requests
  const debounceFunc = debounce((val) => {
    getSearchResult(val);
  }, 2000); // 2-second delay to avoid excessive API calls

  return (
      <div className="relative">
        <SearchInput handleSearch={debounceFunc} />
      </div>
  );
};

export default Search;
