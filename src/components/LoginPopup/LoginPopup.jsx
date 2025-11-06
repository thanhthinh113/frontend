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
  const [currState, setCurrState] = useState("Login"); // "Login" | "Sign Up" | "Verify"
  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
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
      const endpoint =
        currState === "Login" ? "/api/user/login" : "/api/user/register";
      const response = await axios.post(url + endpoint, data);

      if (currState === "Login") {
        if (response.data.success && response.data.user) {
          toast.success("Đăng nhập thành công!");
          loginUser({
            token: response.data.token,
            user: response.data.user,
          });
          localStorage.setItem("role", response.data.user.role);
          if (response.data.user.role === "admin") navigate("/admin/analytics");
          setShowLogin(false);
        } else {
          toast.error(response.data.message || "Sai thông tin đăng nhập");
        }
      } else if (currState === "Sign Up") {
        if (response.data.success) {
          toast.info("Vui lòng kiểm tra email để lấy mã OTP");
          setCurrState("Verify"); // chuyển qua màn hình nhập OTP
        } else {
          toast.error(response.data.message || "Đăng ký thất bại");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.warn("Vui lòng nhập mã OTP");

    try {
      setLoading(true);
      const res = await axios.post(url + "/api/user/verify-email", {
        email: data.email,
        otpCode: otp,
      });

      if (res.data.success) {
        toast.success("Xác thực thành công! Giờ bạn có thể đăng nhập.");
        setCurrState("Login");
      } else {
        toast.error(res.data.message || "Mã OTP không hợp lệ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi xác thực OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={currState === "Verify" ? verifyOtp : onSubmit}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>
            {currState === "Login"
              ? "Đăng nhập"
              : currState === "Sign Up"
              ? "Đăng ký"
              : "Nhập mã OTP"}
          </h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt=""
          />
        </div>

        {currState !== "Verify" ? (
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
        ) : (
          <div className="login-popup-inputs">
            <p style={{ color: "#444", fontSize: "14px" }}>
              Mã xác thực đã được gửi đến email của bạn.
            </p>
            <input
              type="text"
              placeholder="Nhập mã OTP 6 số"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
            />
          </div>
        )}

        <button type="submit" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : currState === "Login"
            ? "Đăng nhập"
            : currState === "Sign Up"
            ? "Đăng ký"
            : "Xác thực OTP"}
        </button>

        {currState === "Login" ? (
          <p>
            Chưa có tài khoản?{" "}
            <span onClick={() => setCurrState("Sign Up")}>Đăng ký ngay</span>
          </p>
        ) : currState === "Sign Up" ? (
          <p>
            Đã có tài khoản?{" "}
            <span onClick={() => setCurrState("Login")}>Đăng nhập</span>
          </p>
        ) : (
          <p>
            <span onClick={() => setCurrState("Login")}>
              Quay lại đăng nhập
            </span>
          </p>
        )}
      </form>
    </div>
  );
};
