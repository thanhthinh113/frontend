import React from "react";
import "./StatCard.css";
const StatCard = ({ title, value, icon, className }) => (
  <div className={`stat-card ${className}`}>
    <div className="stat-icon">{icon}</div>
    <div className="stat-content">
      <p className="stat-title">{title}</p>
      <h3 className="stat-value">{value.toLocaleString("vi-VN")}</h3>
    </div>
  </div>
);

export default StatCard;
