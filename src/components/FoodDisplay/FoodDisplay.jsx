
import React, { useContext, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import { FaPlus } from "react-icons/fa";
import "./FoodDisplay.css";

export const FoodDisplay = () => {
  const { food_list, categories, selectedCategory, url, addToCart } =
    useContext(StoreContext);

  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerRow = 5; 
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

  const filteredFoods =
    selectedCategory === "all"
      ? food_list
      : food_list.filter(
          (item) => getCategoryName(item) === selectedCategory
        );

  // tính số trang
  const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

  // lấy danh sách item theo trang hiện tại
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFoods = filteredFoods.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="food-display" id="food-display">
      <h2>Danh sách món ăn</h2>
      <div className="food-display-list">
        {currentFoods.map((item) => {
          const imgSrc = item.image?.startsWith("http")
            ? item.image
            : `${url}/${item.image}`;
          return (
            <div className="food-item" key={item._id}>
              <div className="food-img-wrapper">
                <img src={imgSrc} alt={item.name} />
                <button
                  className="add-btn"
                  onClick={() => addToCart(item)}
                  title="Thêm vào giỏ"
                >
                  <FaPlus />
                </button>
              </div>
              <h3>{item.name}</h3>
              <p>{getCategoryName(item)}</p>
              <span>{item.price.toLocaleString()} đ</span>
            </div>
          );
        })}
      </div>

      {/* phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.max(prev - 1, 1))
            }
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
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages)
              )
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
// import React, { useContext, useState } from "react";
// import { StoreContext } from "../../context/StoreContext";
// import { FaPlus } from "react-icons/fa"; // icon dấu cộng
// import { motion, AnimatePresence } from "framer-motion"; // hiệu ứng
// import "./FoodDisplay.css";

// export const FoodDisplay = () => {
//   const { food_list, categories, selectedCategory, url, addToCart } =
//     useContext(StoreContext);

//   const [currentPage, setCurrentPage] = useState(1);

//   const itemsPerRow = 5; // số món 1 hàng
//   const rowsPerPage = 2; // số hàng hiển thị ban đầu
//   const itemsPerPage = itemsPerRow * rowsPerPage; // => 10 món mỗi trang

//   const getCategoryName = (item) => {
//     if (item.categoryId && typeof item.categoryId === "object") {
//       return item.categoryId.name;
//     }
//     if (item.categoryId && typeof item.categoryId === "string") {
//       const cat = categories.find((c) => c._id === item.categoryId);
//       return cat ? cat.name : "";
//     }
//     return "";
//   };

//   const filteredFoods =
//     selectedCategory === "all"
//       ? food_list
//       : food_list.filter(
//           (item) => getCategoryName(item) === selectedCategory
//         );

//   // tính số trang
//   const totalPages = Math.ceil(filteredFoods.length / itemsPerPage);

//   // lấy danh sách item theo trang hiện tại
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const currentFoods = filteredFoods.slice(
//     startIndex,
//     startIndex + itemsPerPage
//   );

//   return (
//     <div className="food-display" id="food-display">
//       <h2>Danh sách món ăn</h2>
//       <div className="food-display-list">
//         <AnimatePresence>
//           {currentFoods.map((item) => {
//             const imgSrc = item.image?.startsWith("http")
//               ? item.image
//               : `${url}/${item.image}`;
//             return (
//               <motion.div
//                 key={item._id}
//                 initial={{ opacity: 0, scale: 0.9 }}
//                 animate={{ opacity: 1, scale: 1 }}
//                 exit={{ opacity: 0, scale: 0.9 }}
//                 transition={{ duration: 0.25 }}
//                 className="food-item"
//               >
//                 <div className="food-img-wrapper">
//                   <img src={imgSrc} alt={item.name} />
//                   <button
//                     className="add-btn"
//                     onClick={() => addToCart(item)}
//                     title="Thêm vào giỏ"
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//                 <h3>{item.name}</h3>
//                 <p>{getCategoryName(item)}</p>
//                 <span>{item.price.toLocaleString()} đ</span>
//               </motion.div>
//             );
//           })}
//         </AnimatePresence>
//       </div>

//       {/* phân trang */}
//       {totalPages > 1 && (
//         <div className="pagination">
//           <button
//             onClick={() =>
//               setCurrentPage((prev) => Math.max(prev - 1, 1))
//             }
//             disabled={currentPage === 1}
//           >
//             &lt; Trước
//           </button>

//           {[...Array(totalPages)].map((_, idx) => (
//             <button
//               key={idx}
//               onClick={() => setCurrentPage(idx + 1)}
//               className={currentPage === idx + 1 ? "active" : ""}
//             >
//               {idx + 1}
//             </button>
//           ))}

//           <button
//             onClick={() =>
//               setCurrentPage((prev) =>
//                 Math.min(prev + 1, totalPages)
//               )
//             }
//             disabled={currentPage === totalPages}
//           >
//             Sau &gt;
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };
