import React, { useContext, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaUserCircle } from "react-icons/fa";

export const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const { token, user, logoutUser, cartItems } = useContext(StoreContext);
  const navigate = useNavigate();

  // 👉 Đếm tổng số lượng sản phẩm trong giỏ
  const getCartItemCount = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  // 👉 Hàm mở form đăng nhập và tự cuộn lên đầu
  const handleSignInClick = () => {
    setShowLogin(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to={"/"}>
          <img src={assets.logo} alt="Logo" className="logo" />
        </Link>

        <ul className="navbar-menu">
          <Link
            to="/"
            onClick={() => setMenu("home")}
            className={menu === "home" ? "active" : ""}
          >
            home
          </Link>
          <a
            href="#explore-menu"
            onClick={() => setMenu("menu")}
            className={menu === "menu" ? "active" : ""}
          >
            menu
          </a>
          <a
            href="#app-download"
            onClick={() => setMenu("policy")}
            className={menu === "policy" ? "active" : ""}
          >
            policy
          </a>
          <a
            href="#footer"
            onClick={() => setMenu("contact-us")}
            className={menu === "contact-us" ? "active" : ""}
          >
            contact us
          </a>
        </ul>

        <div className="navbar-right">
          <img src={assets.search_icon} alt="Search icon" />
          <div className="navbar-search-icon" style={{ position: "relative" }}>
            <Link to={"/cart"}>
              <img src={assets.basket_icon} alt="Basket icon" />
              {/* 🧮 Hiển thị số lượng sản phẩm trong giỏ */}
              {getCartItemCount() > 0 && (
                <span className="cart-count">{getCartItemCount()}</span>
              )}
            </Link>
          </div>

          {!token ? (
            <button onClick={handleSignInClick}>sign in</button>
          ) : (
            <div className="navbar-profile">
              <img src={assets.profile_icon} alt="Profile icon" />
              <span className="profile-name">{user?.name}</span>
              <ul className="navbar-profile-dropdown">
                <li onClick={() => navigate("/profile")}>
                  <FaUserCircle size={30} color="tomato" />
                  <p>Profile</p>
                </li>
                <li onClick={() => navigate("/myorders")}>
                  <img src={assets.bag_icon} alt="Bag icon" />
                  <p>Orders</p>
                </li>
                <hr />
                <li onClick={logoutUser}>
                  <img src={assets.logout_icon} alt="Logout icon" />
                  <p>Logout</p>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
