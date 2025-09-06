// components/ProtectedRoute.jsx
import React from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useContext(StoreContext);

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
