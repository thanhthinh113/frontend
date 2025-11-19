import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaStar } from "react-icons/fa";
import { StoreContext } from "../../context/StoreContext";
import "./FoodDetail.css";

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, url, user, url_AI } = useContext(StoreContext);

  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [canReview, setCanReview] = useState(false);
  const [, setPendingOrders] = useState([]);
  const [reviewOrderId, setReviewOrderId] = useState(null);
  const [relatedFoods, setRelatedFoods] = useState([]);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);

  const reviewsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [foodRes, reviewRes, recommendRes] = await Promise.all([
          axios.get(`${url}/api/food/${id}`),
          axios.get(`${url}/api/reviews/${id}`),
          axios.get(`${url_AI}/recommend/${id}`),
        ]);

        setFood(foodRes.data);
        setReviews(reviewRes.data);
        setRelatedFoods(
          Array.isArray(recommendRes.data) ? recommendRes.data : []
        );

        if (user && user._id) {
          const canRes = await axios.get(`${url}/api/reviews/can/${id}`, {
            headers: { token: localStorage.getItem("token") },
          });
          setCanReview(canRes.data.canReview);
          setPendingOrders(canRes.data.orders || []);
          if (canRes.data.orders && canRes.data.orders.length > 0) {
            setReviewOrderId(canRes.data.orders[0]._id);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, url, url_AI, user]);

  // Upload file lên S3
  const uploadFileToS3 = async (file) => {
    try {
      const res = await axios.get(
        `${url}/api/upload-url?fileName=${encodeURIComponent(
          file.name
        )}&fileType=${file.type}`
      );
      const uploadUrl = res.data.uploadUrl;

      await axios.put(uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      // Trả về URL public từ BE
      return res.data.fileUrl;
    } catch (err) {
      console.error("❌ Upload failed:", err.response?.data || err.message);
      throw err;
    }
  };

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);

  // Tính toán số trang
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate("/login");
    if (!canReview || !reviewOrderId)
      return alert("Chỉ được đánh giá khi đã mua món này!");

    try {
      let mediaUrl = null;
      if (selectedFile) {
        setUploading(true);
        mediaUrl = await uploadFileToS3(selectedFile);
        setUploading(false);
      }

      await axios.post(
        `${url}/api/reviews`,
        {
          foodId: id,
          userId: user._id,
          userName: user.name,
          rating,
          comment,
          orderId: reviewOrderId,
          media: mediaUrl,
        },
        { headers: { token: localStorage.getItem("token") } }
      );

      const res = await axios.get(`${url}/api/reviews/${id}`);
      setReviews(res.data);
      setComment("");
      setRating(5);
      setSelectedFile(null);
      setCanReview(false);
      setReviewOrderId(null);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert(err.response?.data?.message || "Lỗi đánh giá");
    }
  };

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity, "food");
    setQuantity(1);
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
    <div className="food-detail-container">
      <div className="food-card">
        <div className="food-image">
          <img
            src={
              food.image?.startsWith("http")
                ? food.image
                : `${url}/${food.image}`
            }
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
            <span>
              {averageRating} / 5 ({reviews.length} đánh giá)
            </span>
          </div>
          <p>Danh mục: {food.categoryId?.name || "Chưa có"}</p>
          <h3>{food.price?.toLocaleString("vi-VN")} đ</h3>
          <p>{food.description}</p>
          <div className="quantity-box">
            <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
              -
            </button>
            <span>{quantity}</span>
            <button onClick={() => setQuantity((q) => q + 1)}>+</button>
          </div>
          <button className="btn-cart" onClick={handleAddToCart}>
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      {/* Món liên quan */}
      {relatedFoods.length > 0 && (
        <div className="review-section">
          <h3>Món ăn liên quan</h3>
          <div className="related-grid">
            {relatedFoods.map((item) => {
              const foodId = item._id || item.id;
              return (
                <div
                  key={foodId}
                  className="related-item"
                  onClick={() => navigate(`/food/${foodId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={
                      item.image?.startsWith("http")
                        ? item.image
                        : `${url}/${item.image}`
                    }
                    alt={item.name}
                  />
                  <h4>{item.name}</h4>
                  <p>{item.price?.toLocaleString("vi-VN")} đ</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Đánh giá */}
      <div className="review-section">
        <h3>Đánh giá & Bình luận</h3>
        {!user ? (
          <p className="warning">
            ⚠️ Vui lòng{" "}
            <span onClick={() => navigate("/login")}>đăng nhập</span> để bình
            luận.
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
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Viết bình luận..."
              required
            />

            {/* Upload ảnh/video */}
            <div className="file-upload">
              <input
                type="file"
                accept="image/*,video/*"
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              {selectedFile && (
                <div className="preview-container">
                  {selectedFile.type.startsWith("image") ? (
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="preview"
                      className="review-media"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(selectedFile)}
                      controls
                      className="review-media"
                    />
                  )}
                </div>
              )}
            </div>

            {uploading && (
              <p className="uploading-text">Đang tải lên dữ liệu...</p>
            )}

            <button type="submit" className="btn-submit" disabled={uploading}>
              {uploading ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </form>
        )}

        <div className="review-list">
          {reviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            currentReviews.map(
              (
                r // 👈 Sử dụng currentReviews
              ) => (
                <div key={r._id || r.createdAt} className="review-item">
                  <div className="review-header">
                    {/* ... (Nội dung review item) */}
                    <div className="user-info">
                      <div className="user-icon">
                        {r.userName?.charAt(0).toUpperCase()}
                      </div>
                      <strong>{r.userName}</strong>
                    </div>
                    <span className="user-rating">
                      {Array.from({ length: r.rating }, (_, i) => (
                        <FaStar key={i} color="#FFD700" />
                      ))}
                    </span>
                  </div>

                  <div className="review-body">
                    <p className="review-comment">{r.comment}</p>

                    {r.media && r.media.endsWith(".mp4") ? (
                      <video src={r.media} controls className="review-media" />
                    ) : r.media ? (
                      <img
                        src={r.media}
                        alt="review"
                        className="review-media"
                      />
                    ) : null}
                  </div>

                  <small className="review-date">
                    {new Date(r.createdAt).toLocaleString()}
                  </small>
                </div>
              )
            )
          )}
        </div>

        {/* 🌟 Hiển thị Phân Trang */}
        {reviews.length > reviewsPerPage && (
          <div className="pagination">
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={currentPage === number + 1 ? "active" : ""}
              >
                {number + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
