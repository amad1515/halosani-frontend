import React from "react";
import logo from "../assets/halosanilogo.png"; // sesuaikan dengan path

const Logo = () => {
  return (
    <div className="p-4">
      <img src={logo} alt="Logo" className="w-32 h-auto" />
    </div>
  );
};

export default Logo;
