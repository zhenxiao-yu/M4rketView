import React, { useContext, useRef } from "react";
import paginationArrow from "../assets/pagination-arrow.svg";
import { CryptoContext } from "./../context/CryptoContext";
import submitIcon from "../assets/submit-icon.svg";

// Component to select the number of items per page
const PerPage = () => {
  const { setPerPage } = useContext(CryptoContext);
  const inputRef = useRef(null);

  // Handle form submission to update the items per page
  const handleSubmit = (e) => {
    e.preventDefault();
    let val = parseInt(inputRef.current.value); // Parse the input value as an integer
    if (val > 0) { // Ensure the value is greater than 0
      setPerPage(val);
      inputRef.current.value = val; // Reset the input field value
    }
  };

  return (
      <form
          className="relative flex items-center font-nunito mr-12"
          onSubmit={handleSubmit}
      >
        <label
            htmlFor="perpage"
            className="relative flex justify-center items-center mr-2 font-bold"
        >
          per page:{" "}
        </label>
        <input
            type="number"
            name="perpage"
            min={1}
            max={250}
            ref={inputRef}
            placeholder="10"
            className="w-16 rounded bg-gray-200 placeholder:text-gray-100 pl-2 outline-0 border border-transparent
          focus:border-cyan leading-4"
        />
        <button type="submit" className="ml-1 cursor-pointer">
          <img src={submitIcon} alt="submit" className="w-full h-auto" />
        </button>
      </form>
  );
};

// Pagination component to handle navigation between pages
const Pagination = () => {
  const { page, setPage, totalPages, perPage, cryptoData } =
      useContext(CryptoContext);

  const totalNumber = Math.ceil(totalPages / perPage); // Calculate the total number of pages

  // Function to navigate to the next page
  const next = () => {
    if (page < totalNumber) setPage(page + 1);
  };

  // Function to navigate to the previous page
  const prev = () => {
    if (page > 1) setPage(page - 1);
  };

  // Function to jump multiple pages forward
  const multiStepNext = () => {
    setPage(Math.min(page + 3, totalNumber));
  };

  // Function to jump multiple pages backward
  const multiStepPrev = () => {
    setPage(Math.max(page - 3, 1));
  };

  // Render pagination controls only if there is enough data for multiple pages
  if (cryptoData && cryptoData.length >= perPage) {
    return (
        <div className="flex items-center">
          {/* PerPage Component */}
          <PerPage />

          {/* Pagination Controls */}
          <ul className="flex items-center justify-end text-sm">
            {/* Previous Page Button */}
            <li>
              <button className="outline-0 hover:text-cyan w-8" onClick={prev}>
                <img
                    className="w-full h-auto rotate-180"
                    src={paginationArrow}
                    alt="left"
                />
              </button>
            </li>

            {/* Multi-step Backward Button */}
            {page > 3 && (
                <li>
                  <button
                      onClick={multiStepPrev}
                      className="outline-0 hover:text-cyan rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    ...
                  </button>
                </li>
            )}

            {/* Previous Page Number */}
            {page > 1 && (
                <li>
                  <button
                      onClick={prev}
                      className="outline-0 hover:text-cyan rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 mx-1.5"
                  >
                    {page - 1}
                  </button>
                </li>
            )}

            {/* Current Page Number */}
            <li>
              <button
                  disabled
                  className="outline-0 rounded-full w-8 h-8 flex items-center justify-center bg-cyan text-gray-300 mx-1.5"
              >
                {page}
              </button>
            </li>

            {/* Next Page Number */}
            {page < totalNumber && (
                <li>
                  <button
                      onClick={next}
                      className="outline-0 hover:text-cyan rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 mx-1.5"
                  >
                    {page + 1}
                  </button>
                </li>
            )}

            {/* Multi-step Forward Button */}
            {page < totalNumber - 3 && (
                <li>
                  <button
                      onClick={multiStepNext}
                      className="outline-0 hover:text-cyan rounded-full w-8 h-8 flex items-center justify-center text-lg"
                  >
                    ...
                  </button>
                </li>
            )}

            {/* Last Page Button */}
            {page < totalNumber && (
                <li>
                  <button
                      onClick={() => setPage(totalNumber)}
                      className="outline-0 hover:text-cyan rounded-full w-8 h-8 flex items-center justify-center bg-gray-200 mx-1.5"
                  >
                    {totalNumber}
                  </button>
                </li>
            )}

            {/* Next Page Button */}
            <li>
              <button className="outline-0 hover:text-cyan w-8" onClick={next}>
                <img
                    className="w-full h-auto"
                    src={paginationArrow}
                    alt="right"
                />
              </button>
            </li>
          </ul>
        </div>
    );
  } else {
    return null; // Render nothing if there isn't enough data
  }
};

export default Pagination;
