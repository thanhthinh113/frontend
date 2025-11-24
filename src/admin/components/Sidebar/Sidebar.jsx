import React from "react";
import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import {
  FaChartBar,
  FaPlusCircle,
  FaListAlt,
  FaThLarge,
  FaShoppingCart,
  FaUsers,
  FaLayerGroup,
  FaTicketAlt,
  FaEnvelope,
} from "react-icons/fa";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        {/* 1. ANALYTICS / DASHBOARD (Ưu tiên cao nhất) */}
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaChartBar className="sidebar-icon" />
          <p>Dashboard</p>
        </NavLink>

        {/* 2. ORDERS (Thao tác kinh doanh hàng ngày) */}
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaShoppingCart className="sidebar-icon" />
          <p>Orders</p>
        </NavLink>

        {/* 3. VOUCHER (Quản lý chương trình khuyến mãi) */}
        <NavLink
          to="/admin/voucher"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaTicketAlt className="sidebar-icon" />
          <p>Voucher</p>
        </NavLink>

        {/* --- QUẢN LÝ SẢN PHẨM (MENU MANAGEMENT) --- */}

        {/* 4. LIST ITEMS (Xem/Sửa tất cả sản phẩm) */}
        <NavLink
          to="/admin/list"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaListAlt className="sidebar-icon" />
          <p>List Items</p>
        </NavLink>

        {/* 5. ADD ITEMS (Thêm sản phẩm mới) */}
        <NavLink
          to="/admin/add"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaPlusCircle className="sidebar-icon" />
          <p>Add Items</p>
        </NavLink>

        {/* 6. CATEGORIES (Danh mục sản phẩm) */}
        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaThLarge className="sidebar-icon" />
          <p>Categories</p>
        </NavLink>

        {/* 7. COMBO (Quản lý các gói/combo đặc biệt) */}
        <NavLink
          to="/admin/combos"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaLayerGroup className="sidebar-icon" />
          <p>Combo</p>
        </NavLink>

        {/* --- QUẢN LÝ NGƯỜI DÙNG & HỖ TRỢ --- */}

        {/* 8. USERS (Quản lý tài khoản khách hàng) */}
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaUsers className="sidebar-icon" />
          <p>Users</p>
        </NavLink>

        {/* 9. CONTACT MESSAGES (Hỗ trợ khách hàng/Tin nhắn) */}
        <NavLink
          to="/admin/contact"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaEnvelope className="sidebar-icon" />
          <p>Contact Messages</p>
        </NavLink>
      </div>
    </div>
  );
};
