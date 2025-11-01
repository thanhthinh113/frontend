import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export const LoginPopup = ({ setShowLogin }) => {
  const { url, loginUser } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login"); // login || signup
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // trạng thái con mắt

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    if (
      !data.email ||
      !data.password ||
      (currState === "Sign Up" && !data.name)
    ) {
      toast.warn("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      let newUrl =
        url +
        (currState === "Login" ? "/api/user/login" : "/api/user/register");

      const response = await axios.post(newUrl, data);

      if (response.data.success && response.data.user) {
        // Chỉ khi thành công và có user mới xử lý
        toast.success(
          currState === "Login"
            ? "Đăng nhập thành công!"
            : "Đăng ký tài khoản thành công!"
        );

        loginUser({
          token: response.data.token,
          user: response.data.user,
        });

        localStorage.setItem("role", response.data.user.role);

        if (response.data.user.role === "admin") {
          navigate("/admin/analytics");
        }

        setShowLogin(false);
        // window.location.reload(); // không nên reload ngay, để toast hiển thị
      } else {
        toast.error(response.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi khi xử lý. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState === "Login" ? "Đăng nhập" : "Đăng ký"}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Nhập tên của bạn"
              required
            />
          )}
          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Nhập email"
            required
          />
          <div className="password-input">
            <input
              name="password"
              onChange={onChangeHandler}
              value={data.password}
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              required
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : currState === "Sign Up"
            ? "Tạo tài khoản"
            : "Đăng nhập"}
        </button>

        {currState === "Login" ? (
          <p>
            Chưa có tài khoản?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Đăng ký ngay</span>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Login")}>Đăng nhập</span>
          </p>
        )}
      </form>
    </div>
  );
};
