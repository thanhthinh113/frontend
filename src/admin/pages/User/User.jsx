import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast } from "react-toastify";
import "./User.css";

export const User = () => {
  const { url, token } = useContext(StoreContext);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const formatVNDSimple = (amount) => amount.toLocaleString("vi-VN");

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
    if (token) fetchUsers();
  }, [token]);

  const formatAddress = (address) => {
    if (!address || Object.keys(address).length === 0) return "Chưa cập nhật";
    const { street, district, city } = address;
    const addressParts = [street, district, city].filter(
      (part) => part && part.trim() !== ""
    );
    return addressParts.length > 0 ? addressParts.join(", ") : "Chưa cập nhật";
  };

  // ---- Phân trang ----
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="user-container">
      <h3>Danh sách người dùng</h3>
      <div className="user-table">
        <div className="user-header user-row">
          <b>STT</b>
          <b>Tên</b>
          <b>Email</b>
          <b>Số điện thoại</b>
          <b>Địa chỉ</b>
          <b>Điểm tích lũy</b>
          <b>Vai trò</b>
          <b>Ngày tạo</b>
        </div>

        {currentUsers.map((u, index) => (
          <div className="user-row user-item" key={u._id}>
            <p>{indexOfFirstUser + index + 1}</p>
            <p>{u.name}</p>
            <p>{u.email}</p>
            <p>{u.phone || "N/A"}</p>
            <p>{formatAddress(u.address)}</p>
            <p>{formatVNDSimple(u.points || 0)}</p>
            <p>{u.role}</p>
            <p>{new Date(u.createdAt).toLocaleString("vi-VN")}</p>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(users.length / usersPerPage) },
          (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={currentPage === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};
