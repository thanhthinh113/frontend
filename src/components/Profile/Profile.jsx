import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import {
  FaUserCircle,
  FaClipboardList,
  FaShoppingCart,
  FaGift,
  FaMapMarkerAlt,
  FaCog,
} from "react-icons/fa";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

export const Profile = () => {
  const { user } = useContext(StoreContext);
  const navigate = useNavigate();
  return (
    <div className="profile-wrapper">
      {/* Thông tin user */}
      <div className="profile-card">
        <FaUserCircle className="profile-avatar" />
        <div className="profile-info">
          <h2>{user?.name || "Khách hàng"}</h2>
          <p>{user?.email || "Chưa có email"}</p>
        </div>
      </div>

      {/* Menu chức năng */}
      <div className="profile-menu">
        <div className="menu-item">
          <FaClipboardList className="menu-icon" />
          <span onClick={() => navigate("/myorders")}>Đơn hàng của tôi</span>
        </div>
        <div className="menu-item">
          <FaShoppingCart className="menu-icon" />
          <span onClick={() => navigate("/cart")}>Giỏ hàng</span>
        </div>
        <div className="menu-item">
          <FaGift className="menu-icon" />
          <span onClick={() => navigate("/profile")}>Tích điểm & Ưu đãi</span>
        </div>
        <div className="menu-item">
          <FaCog className="menu-icon" />
          <span onClick={() => navigate("/profile")}>Cài đặt tài khoản</span>
        </div>
      </div>
    </div>
  );
};
