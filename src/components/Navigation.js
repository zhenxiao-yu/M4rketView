import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => {
    return (
        <nav
            className="w-[40%] mt-16 flex justify-around align-middle
        border border-cyan rounded-lg"
        >
            {/* NavLink for the Crypto page */}
            <NavLink
                to="/"
                end
                className={({ isActive }) =>
                    `w-full text-base text-center font-nunito m-2.5
          ${isActive ? "bg-cyan text-gray-300" : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"}
          border-0 cursor-pointer rounded capitalize font-semibold`
                }
            >
                Crypto
            </NavLink>

            {/* NavLink for the Trending page */}
            <NavLink
                to="/trending"
                className={({ isActive }) =>
                    `w-full text-base text-center font-nunito m-2.5
          ${isActive ? "bg-cyan text-gray-300" : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"}
          border-0 cursor-pointer rounded capitalize font-semibold`
                }
            >
                Trending
            </NavLink>

            {/* NavLink for the Saved page */}
            <NavLink
                to="/saved"
                className={({ isActive }) =>
                    `w-full text-base text-center font-nunito m-2.5
          ${isActive ? "bg-cyan text-gray-300" : "bg-gray-200 text-gray-100 hover:text-cyan active:bg-cyan active:text-gray-300"}
          border-0 cursor-pointer rounded capitalize font-semibold`
                }
            >
                Saved
            </NavLink>
        </nav>
    );
};

export default Navigation;
