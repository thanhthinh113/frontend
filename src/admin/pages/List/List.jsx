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
  // ---- Phân trang ----
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Reset page khi tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortPrice]);
  return (
    <div className="list-container">
      <h3>Tất cả sản phẩm</h3>

      {/* --- Thanh tìm kiếm giống User --- */}
      <div className="list-search pretty">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="🔍 Tìm kiếm theo tên hoặc mô tả..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
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
            <p>{formatVND(item.price)} VND</p>
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
      <div className="pagination">
        {Array.from(
          { length: Math.ceil(filteredList.length / itemsPerPage) },
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
