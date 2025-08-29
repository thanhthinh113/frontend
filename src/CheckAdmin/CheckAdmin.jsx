import React from "react";
import { Navigate } from "react-router-dom";

const CheckAdmin = ({ children }) => {
  const role = localStorage.getItem("role"); // lấy role đã lưu sau login

  if (role !== "admin") {
    return <Navigate to="/" replace />; // nếu không phải admin thì về trang chủ
  }

  return children; // nếu admin thì cho vào
};

export default CheckAdmin;
