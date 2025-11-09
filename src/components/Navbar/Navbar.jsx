import React, { useContext, useState, useEffect } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";
import { FaUserCircle, FaBars, FaTimes, FaBell } from "react-icons/fa";

export const Navbar = ({ setShowLogin }) => {
  const {
    token,
    user,
    logoutUser,
    cartItems,
    notifications,
    fetchNotifications,
    markAsReadST,
  } = useContext(StoreContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.read).length || 0;

  const getCartItemCount = () =>
    Object.values(cartItems || {}).reduce((sum, qty) => sum + qty, 0);

  // 🔹 Fetch notifications từ server khi Navbar mount hoặc token thay đổi
  useEffect(() => {
    if (token) fetchNotifications();
  }, [token]);

  const handleSignInClick = () => {
    setShowLogin(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLinkClick = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const markAsRead = async (notifId) => {
    if (!token) return;
    markAsReadST(notifId);
  };

  const handleBellClick = () => {
    setShowNotifDropdown((prev) => !prev);
  };

  return (
    <div className="navbar-container">
      <div className="navbar">
        <Link to="/">
          <img src={assets.logo} alt="Logo" className="logo" />
        </Link>

        <ul className={`navbar-menu ${isMenuOpen ? "open" : ""}`}>
          <Link
            to="/"
            className={isActive("/") ? "active" : ""}
            onClick={() => setIsMenuOpen(false)}
          >
            home
          </Link>
          <a
            onClick={() => handleLinkClick("/menu")}
            className={isActive("/menu") ? "active" : ""}
          >
            menu
          </a>
          <a
            onClick={() => handleLinkClick("/policy")}
            className={isActive("/policy") ? "active" : ""}
          >
            policy
          </a>
          <a
            onClick={() => handleLinkClick("/contact")}
            className={isActive("/contact") ? "active" : ""}
          >
            contact us
          </a>
        </ul>

        <div className="navbar-right">
          <img src={assets.search_icon} alt="Search icon" />

          <div className="navbar-search-icon" style={{ position: "relative" }}>
            <Link to="/cart">
              <img src={assets.basket_icon} alt="Basket icon" />
              {getCartItemCount() > 0 && (
                <span className="cart-count">{getCartItemCount()}</span>
              )}
            </Link>
          </div>

          {token && (
            <div
              className="navbar-notification"
              style={{ position: "relative", marginLeft: 10 }}
            >
              <FaBell
                style={{ color: "#49557e" }}
                size={24}
                onClick={handleBellClick}
              />
              {unreadCount > 0 && (
                <span className="notif-badge">{unreadCount}</span>
              )}

              {showNotifDropdown && (
                <div className="notif-dropdown">
                  {notifications.length === 0 ? (
                    <p>No notifications</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id}
                        className={`notif-item ${n.read ? "" : "unread"}`}
                        onClick={() => markAsRead(n._id)}
                      >
                        <p>
                          {n.message.replace(
                            /#([a-f0-9]{24})/,
                            (_, fullId) => `#${fullId.slice(-6)}`
                          )}
                        </p>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          <div
            className="mobile-menu-icon"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
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
