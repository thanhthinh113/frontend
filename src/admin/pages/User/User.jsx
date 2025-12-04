import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../../context/StoreContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./User.css";
import { FaSearch } from "react-icons/fa"; // Thêm icon tìm kiếm

export const User = () => {
  const { url, token } = useContext(StoreContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pointFilter, setPointFilter] = useState("all");

  // --- Tìm kiếm ---
  const [search, setSearch] = useState("");

  // --- Phân trang ---
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const formatVNDSimple = (amount) => amount.toLocaleString("vi-VN");

  const fetchUsers = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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

  // ---- Lọc và Tìm kiếm ----
  const filteredUsers = users.filter((user) => {
    const searchTerm = search.toLowerCase();

    const matchName = user.name?.toLowerCase().includes(searchTerm);
    const matchEmail = user.email?.toLowerCase().includes(searchTerm);
    const matchPhone = user.phone?.includes(searchTerm);

    const searchMatch = matchName || matchEmail || matchPhone;

    // --- Lọc điểm ---
    const points = user.points || 0;
    let pointMatch = true;

    if (pointFilter === "0-1000") pointMatch = points <= 1000;
    if (pointFilter === "1000-5000")
      pointMatch = points >= 1000 && points <= 5000;
    if (pointFilter === "5000+") pointMatch = points > 5000;

    return searchMatch && pointMatch;
  });

  // Đặt lại trang về 1 khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  // ---- Phân trang ----
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalUsers = users.length;
  const totalPoints = users.reduce((sum, user) => sum + (user.points || 0), 0);
  const vipUsers = users.filter((user) => (user.points || 0) > 5000).length;
  const rangeStart = filteredUsers.length ? indexOfFirstUser + 1 : 0;
  const rangeEnd = Math.min(indexOfLastUser, filteredUsers.length);

  return (
    <div className="user-container">
      <div className="user-header">
        <div>
          <h3>👥 Danh sách người dùng</h3>
          <p>
            Quản lý tài khoản khách hàng, xem điểm tích lũy và phân loại theo
            từng nhóm điểm thưởng.
          </p>
        </div>
      </div>

      <div className="user-metrics">
        <div className="metric-card">
          <span className="metric-label">Tổng người dùng</span>
          <strong className="metric-value">{totalUsers}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Điểm đã tích lũy</span>
          <strong className="metric-value accent-green">
            {formatVNDSimple(totalPoints)}
          </strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">VIP (5000+)</span>
          <strong className="metric-value accent-purple">{vipUsers}</strong>
        </div>
        <div className="metric-card">
          <span className="metric-label">Đang hiển thị</span>
          <strong className="metric-value accent-blue">
            {rangeStart}-{rangeEnd || 0}
          </strong>
        </div>
      </div>

      {/* --- Thanh công cụ tìm kiếm --- */}
      <div className="user-tools">
        <div className="search-box-user pretty">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo Tên, Email, SĐT..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="point-filter-group">
          <button
            className={pointFilter === "all" ? "pf-btn active" : "pf-btn"}
            onClick={() => setPointFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={pointFilter === "0-1000" ? "pf-btn active" : "pf-btn"}
            onClick={() => setPointFilter("0-1000")}
          >
            0 – 1000
          </button>
          <button
            className={pointFilter === "1000-5000" ? "pf-btn active" : "pf-btn"}
            onClick={() => setPointFilter("1000-5000")}
          >
            1000 – 5000
          </button>
          <button
            className={pointFilter === "5000+" ? "pf-btn active" : "pf-btn"}
            onClick={() => setPointFilter("5000+")}
          >
            5000+
          </button>
        </div>
      </div>

      {loading ? (
        <p className="user-loading">Đang tải dữ liệu người dùng...</p>
      ) : filteredUsers.length === 0 ? (
        <p className="user-empty">
          Không tìm thấy người dùng nào khớp với tìm kiếm.
        </p>
      ) : (
        <>
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
                <p className="user-email">{u.email}</p>
                <p className="user-phone">{u.phone || "N/A"}</p>
                <p className="user-address">{formatAddress(u.address)}</p>
                <p className="user-points">
                  {formatVNDSimple(u.points || 0)}{" "}
                  <span className="points-suffix">điểm</span>
                </p>
                <p className={`user-role-pill ${u.role}`}>
                  {u.role === "admin" ? "Quản trị" : "Khách hàng"}
                </p>
                <p className="user-date">
                  {new Date(u.createdAt).toLocaleDateString("vi-VN")}
                </p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                ◀
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => paginate(i + 1)}
                  className={currentPage === i + 1 ? "active" : ""}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                ▶
              </button>
            </div>
          )}
        </>
      )}
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};
