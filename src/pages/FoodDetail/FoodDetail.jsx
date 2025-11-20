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
  const [openReplyBox, setOpenReplyBox] = useState(null);
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

  /** ====================== FETCH DATA ====================== */
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

          if (canRes.data.orders?.length > 0) {
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

  /** ====================== UPLOAD MEDIA ====================== */
  const uploadFileToS3 = async (file) => {
    try {
      const res = await axios.post(
        `${url}/api/reviews/presign`,
        { fileName: file.name, fileType: file.type },
        { headers: { token: localStorage.getItem("token") } }
      );

      await axios.put(res.data.uploadUrl, file, {
        headers: { "Content-Type": file.type },
      });

      return res.data.fileUrl;
    } catch (err) {
      console.error("Upload failed:", err);
      throw err;
    }
  };

  /** ====================== SUBMIT REVIEW ====================== */
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
      setCurrentPage(1);
    } catch (err) {
      console.error(err);
      setUploading(false);
      alert(err.response?.data?.message || "Lỗi đánh giá");
    }
  };

  /** ====================== ADMIN REPLY ====================== */
  const handleAdminReply = async (reviewId, text) => {
    if (!text.trim() || !user || user.role !== "admin") return;

    try {
      await axios.post(
        `${url}/api/reviews/reply/${reviewId}`,
        { text },
        { headers: { token: localStorage.getItem("token") } }
      );

      const res = await axios.get(`${url}/api/reviews/${id}`);
      setReviews(res.data);
    } catch (err) {
      alert("Lỗi trả lời");
    }
  };

  /** ====================== PAGINATION ====================== */
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  /** ====================== CART ====================== */
  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity, "food");
    setQuantity(1);
  };

  /** ====================== AVG RATING ====================== */
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : 0;

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!food) return <p>Không tìm thấy món ăn</p>;

  /** ====================== JSX RETURN ====================== */
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
            Thêm vào giỏ hàng
          </button>
        </div>
      </div>

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

      {/* ====================== REVIEW SECTION ====================== */}
      <div className="review-section">
        <h3>Đánh giá & Bình luận</h3>

        {!user ? (
          <p className="warning">
            Vui lòng <span onClick={() => navigate("/login")}>đăng nhập</span>{" "}
            để bình luận.
          </p>
        ) : !canReview ? (
          <p className="warning">
            Bạn chỉ có thể đánh giá khi đã mua món ăn này.
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

            {uploading && <p className="uploading-text">Đang tải lên...</p>}

            <button type="submit" className="btn-submit" disabled={uploading}>
              Gửi đánh giá
            </button>
          </form>
        )}

        <div className="review-list">
          {currentReviews.length === 0 ? (
            <p>Chưa có đánh giá nào.</p>
          ) : (
            currentReviews.map((r) => (
              <div key={r._id} className="review-item">
                <div className="review-header">
                  <div className="user-info">
                    <div className="user-icon">
                      {r.userName?.charAt(0).toUpperCase() || "U"}
                    </div>
                    <strong>{r.userName}</strong>
                  </div>

                  <div className="user-rating">
                    {Array.from({ length: r.rating }, (_, i) => (
                      <FaStar key={i} color="#FFD700" />
                    ))}
                  </div>
                </div>

                <div className="review-body">
                  <p className="review-comment">{r.comment}</p>

                  {r.media &&
                    (r.media.includes(".mp4") || r.media.includes("video") ? (
                      <video src={r.media} controls className="review-media" />
                    ) : (
                      <img
                        src={r.media}
                        alt="review"
                        className="review-media"
                      />
                    ))}
                </div>

                <small className="review-date">
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </small>

                {user?.role === "admin" && (
                  <div className="admin-actions">
                    {!r.reply || !r.reply.text ? (
                      openReplyBox !== r._id ? (
                        <button
                          className="admin-reply-btn"
                          onClick={() => setOpenReplyBox(r._id)}
                        >
                          💬 Trả lời
                        </button>
                      ) : (
                        <div className="admin-reply-box">
                          <textarea
                            autoFocus
                            placeholder="Phản hồi từ cửa hàng..."
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAdminReply(r._id, e.target.value);
                                e.target.value = "";
                                setOpenReplyBox(null);
                              }
                            }}
                          />

                          <button
                            className="cancel-reply-btn"
                            onClick={() => setOpenReplyBox(null)}
                          >
                            Hủy
                          </button>
                        </div>
                      )
                    ) : null}
                  </div>
                )}

                {r.reply?.text && (
                  <div className="admin-reply-container">
                    <div className="admin-reply-header">
                      <div className="admin-reply-avatar">👤</div>

                      <div className="admin-reply-info">
                        <strong className="admin-reply-name">
                          Phản hồi của Tomato
                        </strong>

                        <span className="admin-reply-date">
                          {new Date(
                            r.reply.createdAt || Date.now()
                          ).toLocaleString("vi-VN")}
                        </span>
                      </div>
                    </div>

                    <div className="admin-reply-content">{r.reply.text}</div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ====================== PAGINATION ====================== */}
        {reviews.length > reviewsPerPage && (
          <div className="pagination">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={currentPage === i + 1 ? "active" : ""}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodDetail;
