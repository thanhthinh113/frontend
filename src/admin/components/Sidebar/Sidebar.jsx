// Sidebar.jsx
import React from "react";
import "./sidebar.css";
import { assets } from "../../../assets/assets"; // Đảm bảo đường dẫn này đúng
import { NavLink } from "react-router-dom";

export const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-options">
        <NavLink
          to="/admin/add"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.add_icon} alt="Add Items Icon" />
          <p>Add Items</p>
        </NavLink>
        <NavLink
          to="/admin/list"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.order_icon} alt="List Items Icon" />
          <p>List Items</p>
        </NavLink>
        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.order_icon} alt="Orders Icon" />
          <p>Orders</p>
        </NavLink>
        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <img src={assets.order_icon} alt="Users Icon" />
          <p>Users</p>
        </NavLink>
      </div>
    </div>
  );
};
