
// import React, { useEffect, useState, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import "./FoodDetail.css";
// import { StoreContext } from "../../../context/StoreContext";
// import { FaStar } from "react-icons/fa";

// const FoodDetail = () => {
//   const { id } = useParams();
//   const [food, setFood] = useState(null);
//   const [relatedFoods, setRelatedFoods] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [quantity, setQuantity] = useState(1);

//   // Dữ liệu đánh giá
//   const [reviews, setReviews] = useState([]);
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [userName, setUserName] = useState("");

//   const { addToCart, url } = useContext(StoreContext);

//   useEffect(() => {
//     const fetchFood = async () => {
//       try {
//         const res = await axios.get(`${url}/api/food/${id}`);
//         setFood(res.data);

//         // Fetch món liên quan
//         if (res.data?.categoryId?._id) {
//           const relatedRes = await axios.get(
//             `${url}/api/food?categoryId=${res.data.categoryId._id}`
//           );
//           setRelatedFoods(
//             relatedRes.data.filter((item) => item._id !== res.data._id)
//           );
//         }

//         // Fetch đánh giá
//         const reviewRes = await axios.get(`${url}/api/reviews/${id}`);
//         setReviews(reviewRes.data);
//       } catch (err) {
//         console.error("Error fetching food:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFood();
//   }, [id, url]);

//   // Gửi đánh giá mới
//   const handleReviewSubmit = async (e) => {
//     e.preventDefault();
//     if (!userName || !comment) return alert("Vui lòng nhập tên và bình luận!");

//     try {
//       await axios.post(`${url}/api/reviews`, {
//         foodId: id,
//         userName,
//         rating,
//         comment,
//       });
//       const res = await axios.get(`${url}/api/reviews/${id}`);
//       setReviews(res.data);
//       setUserName("");
//       setComment("");
//       setRating(5);
//     } catch (err) {
//       console.error("Lỗi khi gửi đánh giá:", err);
//     }
//   };

//   // Tính điểm trung bình sao
//   const averageRating =
//     reviews.length > 0
//       ? (
//           reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
//         ).toFixed(1)
//       : 0;

//   if (loading) return <p>Đang tải dữ liệu...</p>;
//   if (!food) return <p>Không tìm thấy món ăn</p>;

//   return (
//     <div className="food-detail">
//       <img
//         src={
//           food.image?.startsWith("http") ? food.image : `${url}/${food.image}`
//         }
//         alt={food.name}
//         className="food-detail-img"
//       />

//       <div className="food-detail-info">
//         <h2>{food.name}</h2>

//         {/* ⭐ Điểm trung bình + số lượng đánh giá */}
//         <div className="food-rating-summary">
//           {averageRating > 0 ? (
//             <>
//               <span className="avg-star">
//                 {Array.from({ length: 5 }, (_, i) => (
//                   <FaStar
//                     key={i}
//                     color={i < Math.round(averageRating) ? "#FFD700" : "#ddd"}
//                   />
//                 ))}
//               </span>
//               <span className="rating-text">
//                 {averageRating} / 5 ({reviews.length} đánh giá)
//               </span>
//             </>
//           ) : (
//             <span className="rating-text">Chưa có đánh giá</span>
//           )}
//         </div>

//         <p className="food-category">
//           Danh mục: {food.categoryId?.name || "Chưa có"}
//         </p>

//         <p className="food-price">
//           {food.price
//             ? `${food.price.toLocaleString("vi-VN")} đ`
//             : "Giá chưa cập nhật"}
//         </p>

//         <p className="food-desc">{food.description || "Không có mô tả"}</p>

//         {/* Chọn số lượng */}
//         <div className="quantity-control">
//           <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
//             -
//           </button>
//           <span>{quantity}</span>
//           <button onClick={() => setQuantity((q) => q + 1)}>+</button>
//         </div>

//         {/* Thêm vào giỏ */}
//         <button
//           className="add-to-cart"
//           onClick={() => addToCart(food, quantity)}
//         >
//           Thêm vào giỏ hàng
//         </button>
//       </div>

//       {/* 🧾 PHẦN ĐÁNH GIÁ & BÌNH LUẬN */}
//       <div className="review-section">
//         <h3>⭐ Đánh giá & Bình luận</h3>
//         <form className="review-form" onSubmit={handleReviewSubmit}>
//           <input
//             type="text"
//             placeholder="Tên của bạn"
//             value={userName}
//             onChange={(e) => setUserName(e.target.value)}
//             required
//           />
//           <select
//             value={rating}
//             onChange={(e) => setRating(Number(e.target.value))}
//           >
//             {[5, 4, 3, 2, 1].map((r) => (
//               <option key={r} value={r}>
//                 {r} ⭐
//               </option>
//             ))}
//           </select>
//           <textarea
//             placeholder="Viết bình luận..."
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             required
//           ></textarea>
//           <button type="submit">Gửi đánh giá</button>
//         </form>

//         <div className="review-list">
//           {reviews.length === 0 ? (
//             <p>Chưa có đánh giá nào.</p>
//           ) : (
//             reviews.map((r) => (
//               <div key={r._id} className="review-item">
//                 <strong>{r.userName}</strong> – {r.rating}⭐
//                 <p>{r.comment}</p>
//                 <small>{new Date(r.createdAt).toLocaleString()}</small>
//               </div>
//             ))
//           )}
//         </div>
//       </div>

//       {/* Món ăn liên quan */}
//       {relatedFoods.length > 0 && (
//         <div className="related-foods">
//           <h3>Món ăn liên quan</h3>
//           <div className="related-list">
//             {relatedFoods.map((item) => (
//               <div className="related-item" key={item._id}>
//                 <img
//                   src={`${url}/images/${item.image}`}
//                   alt={item.name}
//                   className="related-img"
//                 />
//                 <p>{item.name}</p>
//                 <p>{item.price.toLocaleString("vi-VN")} đ</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FoodDetail;
import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import { StoreContext } from "../../../context/StoreContext";
import { FaStar } from "react-icons/fa";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, url, user } = useContext(StoreContext); // user có từ context sau khi đăng nhập

  const [food, setFood] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false); // ✅ kiểm tra có được phép đánh giá không

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, reviewRes] = await Promise.all([
          axios.get(`${url}/api/food/${id}`),
          axios.get(`${url}/api/reviews/${id}`)
        ]);

        setFood(foodRes.data);
        setReviews(reviewRes.data);

        // Món liên quan
        if (foodRes.data?.categoryId?._id) {
          const relatedRes = await axios.get(
            `${url}/api/food?categoryId=${foodRes.data.categoryId._id}`
          );
          setRelatedFoods(
            relatedRes.data.filter((item) => item._id !== foodRes.data._id)
          );
        }

        // ✅ Kiểm tra người dùng có mua hàng chưa
        if (user && user._id) {
          const orderRes = await axios.get(`${url}/api/orders/user/${user._id}`);
          const hasPurchased = orderRes.data.some((order) =>
            order.items.some((item) => item.foodId === id)
          );
          setCanReview(hasPurchased);
        } else {
          setCanReview(false);
        }
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, url, user]);

  // ✅ Gửi đánh giá
  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Vui lòng đăng nhập để bình luận.");
      return navigate("/login");
    }

    if (!canReview) {
      alert("Bạn chỉ có thể đánh giá món ăn đã mua.");
      return;
    }

    if (!comment.trim()) {
      alert("Vui lòng nhập nội dung bình luận.");
      return;
    }

    try {
      await axios.post(`${url}/api/reviews`, {
        foodId: id,
        userId: user._id,
        userName: user.name,
        rating,
        comment,
      });

      const res = await axios.get(`${url}/api/reviews/${id}`);
      setReviews(res.data);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert("Không thể gửi đánh giá, vui lòng thử lại sau.");
    }
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!food) return <p>Không tìm thấy món ăn</p>;

  return (
    <div className="food-detail">
      <img
        src={
          food.image?.startsWith("http") ? food.image : `${url}/${food.image}`
        }
        alt={food.name}
        className="food-detail-img"
      />

      <div className="food-detail-info">
        <h2>{food.name}</h2>

        <div className="food-rating-summary">
          {averageRating > 0 ? (
            <>
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  color={i < Math.round(averageRating) ? "#FFD700" : "#ddd"}
                />
              ))}
              <span className="rating-text">
                {averageRating} / 5 ({reviews.length} đánh giá)
              </span>
            </>
          ) : (
            <span className="rating-text">Chưa có đánh giá</span>
          )}
        </div>

        <p className="food-category">
          Danh mục: {food.categoryId?.name || "Chưa có"}
        </p>

        <p className="food-price">
          {food.price
            ? `${food.price.toLocaleString("vi-VN")} đ`
            : "Giá chưa cập nhật"}
        </p>

        <p className="food-desc">{food.description || "Không có mô tả"}</p>

        <div className="quantity-control">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
            -
          </button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)}>+</button>
        </div>

        <button
          className="add-to-cart"
          onClick={() => addToCart(food, quantity)}
        >
          Thêm vào giỏ hàng
        </button>
      </div>

      {/* 💬 ĐÁNH GIÁ & BÌNH LUẬN */}
      <div className="review-section">
        <h3>⭐ Đánh giá & Bình luận</h3>

        {!user ? (
          <p className="login-warning">
            ⚠️ Vui lòng <span onClick={() => navigate("/login")}>đăng nhập</span> để bình luận.
          </p>
        ) : !canReview ? (
          <p className="login-warning">
            ⚠️ Bạn chỉ có thể đánh giá khi đã mua món ăn này.
          </p>
        ) : (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="rating-select">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  onClick={() => setRating(i + 1)}
                  color={i < rating ? "#FFD700" : "#ddd"}
                  style={{ cursor: "pointer", fontSize: "20px" }}
                />
              ))}
            </div>

            <textarea
              placeholder="Viết bình luận..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            ></textarea>

            <button type="submit">Gửi đánh giá</button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-item">
                <strong>{r.userName}</strong>{" "}
                <span>
                  {Array.from({ length: r.rating }, (_, i) => (
                    <FaStar key={i} color="#FFD700" />
                  ))}
                </span>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Món ăn liên quan */}
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
