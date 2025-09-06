import React from "react";
import { Navigate } from "react-router-dom";

const CheckAdmin = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Không có token hoặc không phải admin thì out
  if (!token || role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CheckAdmin;
