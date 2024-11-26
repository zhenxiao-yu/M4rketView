import React from "react";
import { Link } from "react-router-dom";
import logoSvg from "../assets/logo.svg";

const Logo = () => {
  return (
      <Link
          to="/"
          className="
        absolute top-[1.5rem] left-[1.5rem] no-underline
        flex items-center text-lg text-cyan
      "
      >
        <img src={logoSvg} alt="logo" className="m-3 w-8 h-8" />
        <span className="font-semibold">M4rketView</span>
      </Link>
  );
};

export default Logo;
