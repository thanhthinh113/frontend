import React, { useEffect, useState } from "react";
import "./ExploreMenu.css";

export const ExploreMenu = ({ category, setCategory }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://localhost:4000/api/categories");
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        console.error("Error loading categories:", err);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="explore-menu" id="explore-menu">
      <h1>Explore our menu</h1>
      <p className="explore-menu-text">
        Choose from a diverse menu featuring a delectable array of dishes
        crafted with the finest ingredients and culinary expertise.
      </p>

      <div className="explore-menu-list">
        {categories.map((item) => (
          <div
            role="button"
            tabIndex={0}
            onClick={() =>
              setCategory((prev) => (prev === item.name ? "ALL" : item.name))
            }
            onKeyDown={(e) =>
              e.key === "Enter" &&
              setCategory((prev) => (prev === item.name ? "ALL" : item.name))
            }
            className="explore-menu-list-item"
            key={item._id}
          >
            <img
              className={category === item.name ? "active" : ""}
              src={item.imageUrl}  
              alt={item.name}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};
