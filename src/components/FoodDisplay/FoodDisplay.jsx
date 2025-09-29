// import React, { useContext, useEffect } from "react";
// import "./FoodDisplay.css";
// import { StoreContext } from "../../context/StoreContext";

// export const FoodDisplay = () => {
//   const { food_list, url, selectedCategory } = useContext(StoreContext);

//   useEffect(() => {
//     console.log("Render FoodDisplay with selectedCategory:", selectedCategory);
//   }, [selectedCategory, food_list]);

//   const filteredFood =
//     selectedCategory === "all"
//       ? food_list
//       : food_list.filter((item) => item.category?.name === selectedCategory);

//   if (!filteredFood || filteredFood.length === 0) {
//     return (
//       <div className="food-display">
//         <h2>Our Menu</h2>
//         <p className="no-data">Không có món ăn nào để hiển thị.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="food-display">
//       <h2>Our Menu</h2>
//       <div className="food-grid">
//         {filteredFood.map((item) => (
//           <div className="food-card" key={item._id}>
//             <img
//               src={`${url}/images/${item.image}`}
//               alt={item.name}
//               className="food-img"
//             />
//             <h3 className="food-name">{item.name}</h3>
//             <p className="food-desc">{item.description}</p>
//             <span className="food-price">
//               {item.price.toLocaleString("vi-VN")} ₫
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
import React, { useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import "./FoodDisplay.css";

export const FoodDisplay = () => {
  const { food_list, categories, selectedCategory, url } =
    useContext(StoreContext);

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

  const filteredFoods =
    selectedCategory === "all"
      ? food_list
      : food_list.filter(
          (item) => getCategoryName(item) === selectedCategory
        );

  return (
    <div className="food-display" id="food-display">
      <h2>Danh sách món ăn</h2>
      <div className="food-display-list">
        {filteredFoods.map((item) => {
          const imgSrc = item.image?.startsWith("http")
            ? item.image
            : `${url}/${item.image}`;
          return (
            <div className="food-item" key={item._id}>
              <img src={imgSrc} alt={item.name} />
              <h3>{item.name}</h3>
              <p>{getCategoryName(item)}</p>
              <span>{item.price.toLocaleString()} đ</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
