import React, { useState, useContext } from "react";
import axios from "axios";
import { StoreContext } from "../../context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./ChangePassword.css";

export const ChangePassword = () => {
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // trạng thái ẩn/hiện
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.warn("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${url}/api/user/change-password`,
        { currentPassword, newPassword },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/profile");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi đổi mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi mật khẩu</h2>
      <div className="change-password-form">
        {/* Mật khẩu hiện tại */}
        <label>Mật khẩu hiện tại</label>
        <div className="password-input-wrapper">
          <input
            type={showCurrent ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Nhập mật khẩu hiện tại"
          />
          <span
            className="toggle-password"
            onClick={() => setShowCurrent(!showCurrent)}
          >
            {showCurrent ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Mật khẩu mới */}
        <label>Mật khẩu mới</label>
        <div className="password-input-wrapper">
          <input
            type={showNew ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nhập mật khẩu mới"
          />
          <span
            className="toggle-password"
            onClick={() => setShowNew(!showNew)}
          >
            {showNew ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {/* Xác nhận mật khẩu */}
        <label>Xác nhận mật khẩu mới</label>
        <div className="password-input-wrapper">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Nhập lại mật khẩu mới"
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button
          className="change-password-btn"
          onClick={handleChangePassword}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đổi mật khẩu"}
        </button>

        <button className="cancel-btn" onClick={() => navigate("/profile")}>
          Hủy
        </button>
      </div>
    </div>
  );
};
