
import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./ExploreMenu.css";

export default function ExploreMenu() {
  const { setSelectedCategory } = useContext(StoreContext);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories");
        const data = await res.json();
        console.log("categories:", data);
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) return <p>Đang tải danh mục...</p>;

  return (
    <div className="explore-menu">
      <h2>Danh mục món ăn</h2>
      <div className="explore-menu-list">
        <button
          onClick={() => setSelectedCategory("all")}
          className="explore-menu-item"
        >
          Tất cả
        </button>
        {categories.map((item) => (
          <button
            key={item._id}
            onClick={() => setSelectedCategory(item.name)}
            className="explore-menu-item"
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
