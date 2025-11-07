import React from "react";
import "./sidebar.css";
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
        <NavLink
          to="/admin/analytics"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaChartBar className="sidebar-icon" />
          <p>Analytics</p>
        </NavLink>

        <NavLink
          to="/admin/add"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaPlusCircle className="sidebar-icon" />
          <p>Add Items</p>
        </NavLink>

        <NavLink
          to="/admin/list"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaListAlt className="sidebar-icon" />
          <p>List Items</p>
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaThLarge className="sidebar-icon" />
          <p>Categories</p>
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaShoppingCart className="sidebar-icon" />
          <p>Orders</p>
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaUsers className="sidebar-icon" />
          <p>Users</p>
        </NavLink>

        <NavLink
          to="/admin/combos"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaLayerGroup className="sidebar-icon" />
          <p>Combo</p>
        </NavLink>

        <NavLink
          to="/admin/voucher"
          className={({ isActive }) =>
            isActive ? "sidebar-option active" : "sidebar-option"
          }
        >
          <FaTicketAlt className="sidebar-icon" />
          <p>Voucher</p>
        </NavLink>
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
