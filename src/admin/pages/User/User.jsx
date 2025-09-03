import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import "./User.css";

export const User = () => {
  const { url, token } = useContext(StoreContext);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/user/all`, {
        headers: { token },
      });
      if (response.data.success) {
        setUsers(response.data.users);
      } else {
        toast.error("Không lấy được danh sách user");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error khi lấy danh sách user");
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  return (
    <div className="user-container">
      <h3>Danh sách người dùng</h3>
      <div className="user-table">
        <div className="user-header user-row">
          <b>STT</b>
          <b>Tên</b>
          <b>Email</b>
          <b>Vai trò</b>
          <b>Ngày tạo</b>
        </div>
        {users.map((u, index) => (
          <div className="user-row user-item" key={u._id}>
            <p>{index + 1}</p>
            <p>{u.name}</p>
            <p>{u.email}</p>
            <p>{u.role}</p>
            <p>{new Date(u.createdAt).toLocaleString("vi-VN")}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
