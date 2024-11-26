import React from "react";
import { useNavigate } from "react-router-dom";

const TrendingCoin = ({ data }) => {
  const navigate = useNavigate();

  const getCoinDetails = (id) => {
    navigate(`${id}`);
  };

  return (
      <div
          className="w-full sm:w-[48%] lg:w-[30%] bg-gray-200 mb-6
        last:mb-0 rounded-lg p-6 relative cursor-pointer
        transition-transform transform hover:scale-105
        hover:bg-gray-100 hover:bg-opacity-60 shadow-md"
          onClick={() => getCoinDetails(data.id)}
      >
        {data ? (
            <>
              {/* Coin Name and Icon */}
              <h3 className="text-base flex items-center my-1">
                <span className="text-gray-600 font-medium capitalize">Name:&nbsp;</span>
                <span className="text-cyan font-bold">{data.name}</span>
                <img
                    src={data.small}
                    alt={data.name}
                    className="w-6 h-6 mx-2 rounded-full border border-gray-300"
                />
              </h3>

              {/* Market Cap Rank */}
              <h3 className="text-base flex items-center my-1">
            <span className="text-gray-600 font-medium capitalize">
              Market Cap Rank:&nbsp;
            </span>
                <span className="text-cyan font-bold">{data.market_cap_rank}</span>
              </h3>

              {/* Price in BTC */}
              <h3 className="text-base flex items-center my-1">
            <span className="text-gray-600 font-medium capitalize">
              Price (in BTC):&nbsp;
            </span>
                <span className="text-cyan font-bold">
              {new Intl.NumberFormat("en-IN", {
                style: "currency",
                currency: "btc",
                maximumSignificantDigits: 5,
              }).format(data.price_btc)}
            </span>
              </h3>

              {/* Coin Score */}
              <h3 className="text-base flex items-center my-1">
                <span className="text-gray-600 font-medium capitalize">Score:&nbsp;</span>
                <span className="text-cyan font-bold">{data.score}</span>
              </h3>

              {/* Large Coin Image */}
              <img
                  src={data.large}
                  alt={data.name}
                  className="w-[30%] sm:w-[25%] lg:w-[20%] h-auto rounded-full absolute top-1/2 -right-8
              transform -translate-y-1/2 shadow-lg"
              />
            </>
        ) : (
            // Loading State
            <div className="w-full h-full flex justify-center items-center">
              <div
                  className="w-8 h-8 border-4 border-cyan rounded-full
               border-b-gray-200 animate-spin"
                  role="status"
              />
              <span className="ml-2 text-gray-600">Please wait...</span>
            </div>
        )}
      </div>
  );
};

export default TrendingCoin;
