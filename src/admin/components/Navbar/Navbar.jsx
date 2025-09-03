import React, { useContext } from "react";
import "./navbar.css";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";

export const Navbar = () => {
  const { user } = useContext(StoreContext);
  return (
    <div className="navbar">
      <img src={assets.logo} className="logo" alt="" />
      <span className="profile">{user?.name}</span>
    </div>
  );
};
