import React from "react";
import ReviewItem from "../ReviewItem/ReviewItem.jsx"; // đường dẫn đúng của bạn

const ReviewList = ({ reviews, user, onUpdated }) => {
  return (
    <div className="review-list">
      <h3>Đánh giá từ khách hàng</h3>
      {reviews.length === 0 && <p>Chưa có đánh giá nào.</p>}
      {reviews.map((r) => (
        <ReviewItem
          key={r._id}
          review={r}
          user={user}
          onUpdated={onUpdated} 
        />
      ))}
    </div>
  );
};

export default ReviewList;