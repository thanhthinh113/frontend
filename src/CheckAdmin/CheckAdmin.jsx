import React from "react";
import { Navigate } from "react-router-dom";

const CheckAdmin = ({ children }) => {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default CheckAdmin;
