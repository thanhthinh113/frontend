import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FoodReview.css";

export default function FoodReview({ foodId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [userName, setUserName] = useState("");

  const url = "http://localhost:4000/api/reviews";

  useEffect(() => {
    if (foodId) fetchReviews();
  }, [foodId]);

  const fetchReviews = async () => {
    const res = await axios.get(`${url}/${foodId}`);
    setReviews(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(url, { foodId, userName, rating, comment });
    setComment("");
    setUserName("");
    fetchReviews();
  };

  return (
    <div className="review-section">
      <h3>⭐ Đánh giá & Bình luận</h3>

      <form className="review-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên của bạn"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
        />
        <select value={rating} onChange={(e) => setRating(e.target.value)}>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r} ⭐
            </option>
          ))}
        </select>
        <textarea
          placeholder="Viết bình luận..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        ></textarea>
        <button type="submit">Gửi đánh giá</button>
      </form>

      <div className="review-list">
        {reviews.length === 0 ? (
          <p>Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="review-item">
              <strong>{r.userName}</strong> – {r.rating}⭐
              <p>{r.comment}</p>
              <small>{new Date(r.createdAt).toLocaleString()}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
