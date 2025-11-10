import React, { useContext } from "react";
import "./Navbar.css";
import { assets } from "../../../assets/assets";
import { StoreContext } from "../../../context/StoreContext";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { user, logoutUser } = useContext(StoreContext);
  return (
    <div className="navbar">
      <Link to={"/"}>
        <img src={assets.logo} className="logo" alt="" />
      </Link>
      <div className="navbar-user">
        <img src={assets.profile_icon} alt="Profile icon" />
        <span className="profile">{user?.name}</span>
        <button className="logout-btn" onClick={logoutUser}>
          <img src={assets.logout_icon} alt="Logout icon" />
        </button>
      </div>
    </div>
  );
};
