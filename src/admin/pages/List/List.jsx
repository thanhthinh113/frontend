import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { FaSearch, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa"; // Thêm icon sắp xếp
import "./List.css";
import { StoreContext } from "../../../context/StoreContext";
import { Edit } from "../Edit/Edit";

export const List = () => {
  const { url } = useContext(StoreContext);
  const [list, setList] = useState([]);
  const [editingFood, setEditingFood] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortPrice, setSortPrice] = useState(null); // null | "asc" | "desc"

  // Phân trang
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const formatVND = (amount) => amount.toLocaleString("vi-VN");

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Không thể tải danh sách sản phẩm");
      }
    } catch (err) {
      toast.error("Lỗi server khi tải danh sách sản phẩm");
      console.error(err);
    }
  };

  const removeFood = async (id) => {
    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa món ăn này?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.post(`${url}/api/food/remove`, { id });
      if (response.data.success) {
        toast.success("Đã xóa sản phẩm");
        fetchList();
      } else {
        toast.error("Không thể xóa sản phẩm");
      }
    } catch (err) {
      toast.error("Lỗi server khi xóa sản phẩm");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // ---- Lọc theo tìm kiếm ----
  const totalItems = list.length;
  const filteredList = list.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (sortPrice === "asc") {
    filteredList.sort((a, b) => a.price - b.price);
  } else if (sortPrice === "desc") {
    filteredList.sort((a, b) => b.price - a.price);
  }
  const filteredCount = filteredList.length;
  const isFiltered = searchTerm.trim().length > 0 || sortPrice !== null;

  // ---- Phân trang ----
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredList.length / itemsPerPage);
  const rangeStart = filteredCount ? indexOfFirstItem + 1 : 0;
  const rangeEnd = Math.min(indexOfLastItem, filteredCount);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Reset page khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortPrice]);
  return (
    <div className="list-container">
      <div className="list-header">
        <div className="list-heading">
          <h3>Tất cả sản phẩm</h3>
          <p className="list-subtitle">
            Quản lý toàn bộ món ăn hiện có, tìm kiếm nhanh và chỉnh sửa dễ dàng.
          </p>
        </div>
        <div className="list-metrics">
          <div className="metric-card">
            <span className="metric-label">Tổng món</span>
            <p className="metric-value accent-purple1">{totalItems}</p>
          </div>
          <div className="metric-card">
            <span className="metric-label accent-blue1">Đang hiển thị</span>
            <p className="metric-value accent-blue1">
              {rangeStart}-{rangeEnd || 0}
            </p>
          </div>
          <div className="metric-card">
            <span className="metric-label ">Theo bộ lọc</span>
            <p className="metric-value accent-green1">{filteredCount}</p>
          </div>
        </div>
      </div>

      {/* --- Thanh tìm kiếm & filter pills --- */}
      <div className="list-toolbar">
        <div className="list-search pretty">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="🔍 Tìm kiếm theo tên hoặc mô tả..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {isFiltered && (
          <div className="active-filters">
            {searchTerm && (
              <span className="filter-chip">
                Từ khóa: <strong>{searchTerm}</strong>
              </span>
            )}
            {sortPrice === "asc" && (
              <span className="filter-chip success">Giá tăng dần</span>
            )}
            {sortPrice === "desc" && (
              <span className="filter-chip warning">Giá giảm dần</span>
            )}
            <button
              className="filter-reset"
              type="button"
              onClick={() => {
                setSearchTerm("");
                setSortPrice(null);
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      <div className="list-table">
        <div className="table-header table-row">
          <b>STT</b>
          <b>Ảnh</b>
          <b>Tên</b>
          <b>Mô tả</b>
          <b>Danh mục</b>
          <b>
            Giá
            <span className="sort-icons">
              <FaSortAmountUp
                className={`sort-icon ${sortPrice === "asc" ? "active" : ""}`}
                onClick={() =>
                  setSortPrice((prev) => (prev === "asc" ? null : "asc"))
                }
              />
              <FaSortAmountDown
                className={`sort-icon ${sortPrice === "desc" ? "active" : ""}`}
                onClick={() =>
                  setSortPrice((prev) => (prev === "desc" ? null : "desc"))
                }
              />
            </span>
          </b>

          <b>Hành động</b>
        </div>

        {currentItems.map((item, index) => (
          <div className="table-row table-item" key={item._id}>
            <p className="item-number">{indexOfFirstItem + index + 1}</p>
            <img
              src={
                item.image?.startsWith("https://")
                  ? item.image
                  : `${url}/${item.image}`
              }
              alt={item.name}
            />
            <p>{item.name}</p>
            <p className="item-description">{item.description}</p>
            <p>{item.categoryId?.name || "Chưa có danh mục"}</p>
            <p className="price-chip">
              {formatVND(item.price)} <span>VND</span>
            </p>
            <div className="action-buttons">
              <span onClick={() => setEditingFood(item)} className="edit-btn">
                Sửa
              </span>
              <span onClick={() => removeFood(item._id)} className="remove-btn">
                Xóa
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Phân trang */}
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

      {editingFood && (
        <Edit
          food={editingFood}
          onClose={() => setEditingFood(null)}
          onUpdated={fetchList}
        />
      )}
    </div>
  );
};
