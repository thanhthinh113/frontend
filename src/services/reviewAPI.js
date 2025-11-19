import axios from "axios";

// Tạo hàm khởi tạo API với URL backend
export const reviewAPI = (baseURL) => {
  const API = `${baseURL}/api/reviews`;

  return {
    getReviewsByFood: (foodId) => axios.get(`${API}/${foodId}`),

    addReview: (data) =>
      axios.post(API, data, {
        headers: { token: localStorage.getItem("token") },
      }),

    adminReaction: (reviewId, reaction) =>
      axios.post(
        `${API}/reaction/${reviewId}`,
        { reaction },
        { headers: { token: localStorage.getItem("token") } }
      ),

    adminReply: (reviewId, text) =>
      axios.post(
        `${API}/reply/${reviewId}`,
        { text },
        { headers: { token: localStorage.getItem("token") } }
      ),
  };
};
