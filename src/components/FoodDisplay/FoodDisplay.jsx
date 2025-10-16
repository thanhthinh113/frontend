import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import SearchBar from "../SearchBar/SearchBar"; // ✅ thêm
import "./FoodDisplay.css";

export const FoodDisplay = () => {
  const { food_list, categories, selectedCategory, url, addToCart } =
    useContext(StoreContext);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState(food_list);

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
        if (searchTerm.trim() === "") {
          const filtered =
            selectedCategory === "all"
              ? food_list
              : food_list.filter(
                  (item) => getCategoryName(item) === selectedCategory
                );
          setFilteredFoods(filtered);
        } else {
          const res = await axios.get(
            `${url}/api/food/search?q=${encodeURIComponent(searchTerm)}`
          );
          console.log("Kết quả tìm kiếm:", res.data);
          setFilteredFoods(res.data.data || []);

          setFilteredFoods(res.data.data || []);
        }
      } catch (err) {
        console.error("Lỗi khi tìm kiếm món ăn:", err);
        setFilteredFoods([]);
      }
    };

    fetchFoods();
  }, [searchTerm, selectedCategory, food_list]);

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

      {/* ✅ Thanh tìm kiếm */}
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      <div className="food-display-list">
        {currentFoods.length > 0 ? (
          currentFoods.map((item) => {
            const imgSrc = item.image?.startsWith("http")
              ? item.image
              : `${url}/${item.image}`;
            return (
              <div className="food-item" key={item._id}>
                <div className="food-img-wrapper">
                  {/* Link sang trang chi tiết */}
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
                <span>{item.price.toLocaleString()} đ</span>
              </div>
            );
          })
        ) : (
          <p>Không tìm thấy món nào phù hợp.</p>
        )}
      </div>

      {/* ✅ Phân trang */}
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
