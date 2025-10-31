import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FoodDetail.css";
import { StoreContext } from "../../../context/StoreContext";
import { FaStar } from "react-icons/fa";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // 🧠 Lấy các hàm và biến từ StoreContext (đã cập nhật)
  const { addToCart, url, user, syncGuestCartToUser } = useContext(StoreContext);

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);

  // 📦 Lấy dữ liệu món ăn + đánh giá + kiểm tra quyền review
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, reviewRes] = await Promise.all([
          axios.get(`${url}/api/food/${id}`),
          axios.get(`${url}/api/reviews/${id}`),
        ]);

        setFood(foodRes.data);
        setReviews(reviewRes.data);

        // ✅ Kiểm tra quyền đánh giá (đã mua hay chưa)
        if (user && user._id) {
          const orderRes = await axios.post(
            `${url}/api/order/userorders`,
            {},
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
          );

          const orders = Array.isArray(orderRes.data)
            ? orderRes.data
            : orderRes.data.orders || [];

          const hasPurchased = orders.some((order) =>
            order.items.some((item) => {
              const itemId = item.foodId?._id || item.foodId || item._id;
              return itemId?.toString() === id.toString();
            })
          );

          setCanReview(hasPurchased);
        } else {
          setCanReview(false);
        }
      } catch (err) {
        console.error("❌ Lỗi khi tải dữ liệu:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, url, user]);

  // ✍️ Gửi đánh giá
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!canReview) return alert("Chỉ được đánh giá khi đã mua món này!");

    try {
      await axios.post(
        `${url}/api/reviews`,
        { foodId: id, userId: user._id, userName: user.name, rating, comment },
        { headers: { token: localStorage.getItem("token") } }
      );
      const res = await axios.get(`${url}/api/reviews/${id}`);
      setReviews(res.data);
      setComment("");
      setRating(5);
    } catch (err) {
      console.error(err);
    }
  };

  // 🛒 Thêm vào giỏ hàng — đã cập nhật tương thích với StoreContext mới
  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity, "food");
    alert(`${quantity} ${food.name} đã được thêm vào giỏ hàng!`);
    setQuantity(1);
  };

  // ⭐ Tính điểm trung bình
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  if (loading) return <p className="loading">Đang tải dữ liệu...</p>;
  if (!food) return <p>Không tìm thấy món ăn</p>;

  return (
    <div className="food-detail-container">
      <div className="food-card">
        <div className="food-image">
          <img
            src={food.image?.startsWith("http") ? food.image : `${url}/${food.image}`}
            alt={food.name}
          />
        </div>

        <div className="food-info">
          <h2>{food.name}</h2>
          <div className="food-rating">
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                color={i < Math.round(averageRating) ? "#FFD700" : "#ddd"}
              />
            ))}
            <span>{averageRating} / 5 ({reviews.length} đánh giá)</span>
          </div>

          <p className="category">Danh mục: {food.categoryId?.name || "Chưa có"}</p>
          <h3 className="price">{food.price?.toLocaleString("vi-VN")} đ</h3>
          <p className="desc">{food.description}</p>

          <div className="quantity-box">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>-</button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>

          <button className="btn-cart" onClick={handleAddToCart}>
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div className="review-section">
        <h3>Đánh giá & Bình luận</h3>

        {!user ? (
          <p className="warning">
            ⚠️ Vui lòng <span onClick={() => navigate("/login")}>đăng nhập</span> để bình luận.
          </p>
        ) : !canReview ? (
          <p className="warning">
            ⚠️ Bạn chỉ có thể đánh giá khi đã mua món ăn này.
          </p>
        ) : (
          <form onSubmit={handleReviewSubmit} className="review-form">
            <div className="rating-select">
              {Array.from({ length: 5 }, (_, i) => (
                <FaStar
                  key={i}
                  onClick={() => setRating(i + 1)}
                  color={i < rating ? "#FFD700" : "#ddd"}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết bình luận..."
              required
            ></textarea>
            <button type="submit" className="btn-submit">
              Gửi đánh giá
            </button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            reviews.map((r) => (
              <div key={r._id} className="review-item">
                <div className="review-header">
                  <strong>{r.userName}</strong>
                  <span>
                    {Array.from({ length: r.rating }, (_, i) => (
                      <FaStar key={i} color="#FFD700" />
                    ))}
                  </span>
                </div>
                <p>{r.comment}</p>
                <small>{new Date(r.createdAt).toLocaleString()}</small>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FoodDetail;
