import React, { useState } from "react";
import { reviewAPI } from "../../../services/reviewAPI"; // giữ nguyên như cũ
import { FaRegSmile } from "react-icons/fa";

const REACTIONS = ["thumbs up", "heart", "laugh", "angry"];

const ReviewItem = ({ review, user, onUpdated }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [replyText, setReplyText] = useState("");
  const isAdmin = user?.role === "admin";

  const reviewService = reviewAPI(import.meta.env.VITE_BACKEND_URL);

  const handleReaction = async (reaction) => {
    try {
      await reviewService.adminReaction(review._id, reaction);
      setShowPopup(false);
      onUpdated(); // Gọi lại để reload danh sách
    } catch (err) {
      console.log("Lỗi reaction:", err);
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    try {
      await reviewService.adminReply(review._id, replyText);
      setReplyText("");
      onUpdated(); // Gọi lại để reload danh sách
    } catch (err) {
      console.log("Lỗi reply:", err);
    }
  };

  return (
    <div className="review-item">
      <div className="review-header">
        <strong>{review.userName}</strong>
        <span> {review.rating}</span>
      </div>
      <div className="review-body">
        <p>{review.comment}</p>
        {review.media && (
          <>
            {review.media.includes(".mp4") || review.media.includes(".webm") ? (
              <video src={review.media} controls className="review-media" />
            ) : (
              <img src={review.media} className="review-media" alt="review media" />
            )}
          </>
        )}
      </div>

      {review.reaction && <div className="admin-reaction">Admin: {review.reaction}</div>}

      {review.reply?.text && (
        <div className="admin-reply">
          <strong>{review.reply.adminName || "Admin"}: </strong>
          {review.reply.text}
        </div>
      )}

      {isAdmin && (
        <div className="admin-tools">
          <button className="btn-reaction" onClick={() => setShowPopup(!showPopup)}>
            <FaRegSmile /> Thả cảm xúc
          </button>
          {showPopup && (
            <div className="reaction-popup">
              {REACTIONS.map((r) => (
                <span key={r} className="reaction-item" onClick={() => handleReaction(r)}>
                  {r}
                </span>
              ))}
            </div>
          )}
          <div className="reply-box">
            <input
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Trả lời bình luận..."
            />
            <button onClick={handleReply}>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewItem;