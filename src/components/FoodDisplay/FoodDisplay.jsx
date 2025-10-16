import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar";
import "./FoodDisplay.css";
import { FaFilter, FaSortAmountDownAlt } from "react-icons/fa";

export const FoodDisplay = () => {
  const { food_list, categories, selectedCategory, url, addToCart } =
    useContext(StoreContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState(food_list);
  const [sortOrder, setSortOrder] = useState("none");
  const [priceRange, setPriceRange] = useState("all");

  const itemsPerRow = 4;
  const rowsPerPage = 2;
  const itemsPerPage = itemsPerRow * rowsPerPage;

  const getCategoryName = (item) => {
    if (item.categoryId && typeof item.categoryId === "object") {
      return item.categoryId.name;
    }
    if (item.categoryId && typeof item.categoryId === "string") {
      const cat = categories.find((c) => c._id === item.categoryId);
      return cat ? cat.name : "";
    }
    return "";
  };

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        let data = [];

        // 🔍 Nếu không có từ khóa => lọc theo danh mục
        if (searchTerm.trim() === "") {
          data =
            selectedCategory === "all"
              ? food_list
              : food_list.filter(
                  (item) => getCategoryName(item) === selectedCategory
                );
        } else {
          // Nếu có từ khóa => gọi API tìm kiếm
          const res = await axios.get(
            `${url}/api/food/search?q=${encodeURIComponent(searchTerm)}`
          );
          data = res.data.data || [];
        }

        // 💰 Lọc theo khoảng giá (chuyển price sang số)
        data = data.filter((item) => {
          const priceNum = parseFloat(
            item.price.toString().replace(/[^\d]/g, "")
          );
          if (priceRange === "all") return true;
          if (priceRange === "0-30000") return priceNum <= 30000;
          if (priceRange === "30000-100000")
            return priceNum > 30000 && priceNum <= 100000;
          if (priceRange === "100000+") return priceNum > 100000;
          return true;
        });

        // 🔽 Sắp xếp theo giá
        if (sortOrder === "asc") {
          data.sort(
            (a, b) =>
              parseFloat(a.price.toString().replace(/[^\d]/g, "")) -
              parseFloat(b.price.toString().replace(/[^\d]/g, ""))
          );
        } else if (sortOrder === "desc") {
          data.sort(
            (a, b) =>
              parseFloat(b.price.toString().replace(/[^\d]/g, "")) -
              parseFloat(a.price.toString().replace(/[^\d]/g, ""))
          );
        }

        setFilteredFoods(data);
        setCurrentPage(1);
      } catch (err) {
        console.error("Lỗi khi lọc/sắp xếp món ăn:", err);
        setFilteredFoods([]);
      }
    };

    fetchFoods();
  }, [searchTerm, selectedCategory, sortOrder, priceRange, food_list, url]);

  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFoods = filteredFoods.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="food-display" id="food-display">
      <div className="food-display-header">
        <h2>Danh sách món ăn</h2>
      </div>

      {/* 🔍 Thanh tìm kiếm */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* ⚙️ Bộ lọc sắp xếp & giá */}
      <div className="filter-sort-container">
        <div className="filter-left">
          <label>
            <FaFilter className="filter-icon" />
            Lọc theo giá:
          </label>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
          >
            <option value="all">Tất cả</option>
            <option value="0-30000">Dưới 30.000đ</option>
            <option value="30000-100000">30.000đ - 100.000đ</option>
            <option value="100000+">Trên 100.000đ</option>
          </select>
        </div>

        <div className="filter-right">
          <label>
            <FaSortAmountDownAlt className="sort-icon" />
            Sắp xếp theo:
          </label>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="none">Mặc định</option>
            <option value="asc">Giá thấp đến cao</option>
            <option value="desc">Giá cao đến thấp</option>
          </select>
        </div>
      </div>

      {/* 🧾 Danh sách món ăn */}
      <div className="food-display-list">
        {currentFoods.length > 0 ? (
          currentFoods.map((item) => {
            const imgSrc = item.image?.startsWith("http")
              ? item.image
              : `${url}/${item.image}`;
            return (
              <div className="food-item" key={item._id}>
                <div className="food-img-wrapper">
                  <Link to={`/food/${item._id}`}>
                    <img src={imgSrc} alt={item.name} />
                  </Link>
                  <button
                    className="add-btn"
                    onClick={() => addToCart(item._id)}
                    title="Thêm vào giỏ"
                  >
                    <FaPlus />
                  </button>
                </div>
                <Link to={`/food/${item._id}`} className="food-name-link">
                  <h3>{item.name}</h3>
                </Link>
                <p>{getCategoryName(item)}</p>
                <span>{parseFloat(item.price).toLocaleString()} đ</span>
              </div>
            );
          })
        ) : (
          <p>Không tìm thấy món nào phù hợp.</p>
        )}
      </div>

      {/* 📄 Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; Trước
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(idx + 1)}
              className={currentPage === idx + 1 ? "active" : ""}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Sau &gt;
          </button>
        </div>
      )}
    </div>
  );
};
