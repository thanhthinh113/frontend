// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./FoodDetail.css";

// const FoodDetail = () => {
//   const { id } = useParams(); 
//   const [food, setFood] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchFood = async () => {
//       try {
//         const res = await axios.get(`http://localhost:4000/api/food/${id}`);
//         console.log("Food detail data:", res.data); // debug
//         setFood(res.data);
//       } catch (err) {
//         console.error("Error fetching food:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFood();
//   }, [id]);

//   if (loading) return <p>Loading...</p>;
//   if (!food) return <p>Không tìm thấy món ăn</p>;

//   return (
//     <div className="food-detail">
//       <img
//         src={
//           food.image?.startsWith("http")
//             ? food.image
//             : `http://localhost:4000/${food.image}`
//         }
//         alt={food.name}
//         className="food-detail-img"
//       />
//       <div className="food-detail-info">
//         <h2>{food.name}</h2>
//         <p className="food-category">
//           Danh mục: {food.categoryId?.name || "Chưa có"}
//         </p>
//         <p className="food-price">
//           {food.price ? `${food.price.toLocaleString()} đ` : "Giá chưa cập nhật"}
//         </p>
//         <p className="food-desc">{food.description || "Không có mô tả"}</p>
//         <button className="add-to-cart">Thêm vào giỏ hàng</button>
//       </div>
//     </div>
//   );
// };

// export default FoodDetail;
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import { StoreContext } from "../../../context/StoreContext";

const FoodDetail = () => {
  const { id } = useParams();
  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const { addToCart, url } = useContext(StoreContext);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`${url}/api/food/${id}`);
        setFood(res.data);

        // fetch related foods theo categoryId
        if (res.data?.categoryId?._id) {
          const relatedRes = await axios.get(
            `${url}/api/food?categoryId=${res.data.categoryId._id}`
          );
          setRelatedFoods(
            relatedRes.data.filter((item) => item._id !== res.data._id)
          );
        }
      } catch (err) {
        console.error("Error fetching food:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id, url]);

  if (loading) return <p>Loading...</p>;
  if (!food) return <p>Không tìm thấy món ăn</p>;

  return (
    <div className="food-detail">
      <img
        src={
          food.image?.startsWith("http")
            ? food.image
            : `${url}/${food.image}`
        }
        alt={food.name}
        className="food-detail-img"
      />
      <div className="food-detail-info">
        <h2>{food.name}</h2>
        <p className="food-category">
          Danh mục: {food.categoryId?.name || "Chưa có"}
        </p>
        <p className="food-price">
          {food.price
            ? `${food.price.toLocaleString("vi-VN")} đ`
            : "Giá chưa cập nhật"}
        </p>
        <p className="food-desc">{food.description || "Không có mô tả"}</p>

        {/* Chọn số lượng */}
        <div className="quantity-control">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        {/* Thêm vào giỏ */}
        <button
          className="add-to-cart"
          onClick={() => addToCart(food, quantity)}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* Gợi ý món ăn liên quan */}
      {relatedFoods.length > 0 && (
        <div className="related-foods">
          <h3>Món ăn liên quan</h3>
          <div className="related-list">
            {relatedFoods.map((item) => (
              <div className="related-item" key={item._id}>
                <img
                  src={`${url}/images/${item.image}`}
                  alt={item.name}
                  className="related-img"
                />
                <p>{item.name}</p>
                <p>{item.price.toLocaleString("vi-VN")} đ</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodDetail;
