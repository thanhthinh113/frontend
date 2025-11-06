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
  const [currState, setCurrState] = useState("Login");
  // Các trạng thái: Login | Sign Up | Verify | Forgot | Reset

  const [data, setData] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // -------------------------
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  const onSubmit = async (e) => {
    e.preventDefault();

    // Validate input
    if (
      !data.email ||
      (currState !== "Forgot" && currState !== "Reset" && !data.password) ||
      (currState === "Sign Up" && !data.name)
    ) {
      toast.warn("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);

      // Xử lý từng loại form
      if (currState === "Login") {
        const res = await axios.post(url + "/api/user/login", data);
        if (res.data.success && res.data.user) {
          toast.success("Đăng nhập thành công!");
          loginUser({ token: res.data.token, user: res.data.user });
          localStorage.setItem("role", res.data.user.role);
          if (res.data.user.role === "admin") navigate("/admin/analytics");
          setShowLogin(false);
        } else {
          toast.error(res.data.message || "Sai thông tin đăng nhập");
        }
      } else if (currState === "Sign Up") {
        const res = await axios.post(url + "/api/user/register", data);
        if (res.data.success) {
          toast.info("Vui lòng kiểm tra email để lấy mã OTP");
          setCurrState("Verify");
        } else toast.error(res.data.message);
      } else if (currState === "Forgot") {
        const res = await axios.post(url + "/api/user/forgot-password", {
          email: data.email,
        });
        if (res.data.success) {
          toast.info("Đã gửi mã OTP đặt lại mật khẩu");
          setCurrState("Reset");
        } else toast.error(res.data.message);
      } else if (currState === "Reset") {
        const res = await axios.post(url + "/api/user/reset-password", {
          email: data.email,
          otpCode: otp,
          newPassword: data.password,
        });
        if (res.data.success) {
          toast.success("Đặt lại mật khẩu thành công! Hãy đăng nhập lại.");
          setCurrState("Login");
        } else toast.error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("Đã xảy ra lỗi, vui lòng thử lại");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------
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

  // -------------------------
  const renderTitle = () => {
    switch (currState) {
      case "Login":
        return "Đăng nhập";
      case "Sign Up":
        return "Đăng ký";
      case "Verify":
        return "Nhập mã OTP";
      case "Forgot":
        return "Quên mật khẩu";
      case "Reset":
        return "Đặt lại mật khẩu";
      default:
        return "";
    }
  };

  return (
    <div className="login-popup">
      <form
        onSubmit={currState === "Verify" ? verifyOtp : onSubmit}
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h2>{renderTitle()}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        {/* FORM NỘI DUNG */}
        {currState === "Login" && (
          <div className="login-popup-inputs">
            <input
              name="email"
              type="email"
              placeholder="Nhập email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
            <div className="password-input">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                onChange={onChangeHandler}
                value={data.password}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p
              style={{
                color: "tomato",
                cursor: "pointer",
                fontSize: "13px",
                textAlign: "right",
              }}
              onClick={() => setCurrState("Forgot")}
            >
              Quên mật khẩu?
            </p>
          </div>
        )}

        {currState === "Sign Up" && (
          <div className="login-popup-inputs">
            <input
              name="name"
              type="text"
              placeholder="Nhập tên của bạn"
              onChange={onChangeHandler}
              value={data.name}
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Nhập email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
            <div className="password-input">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu"
                onChange={onChangeHandler}
                value={data.password}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        )}

        {currState === "Verify" && (
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

        {currState === "Forgot" && (
          <div className="login-popup-inputs">
            <p style={{ color: "#444", fontSize: "14px" }}>
              Nhập email để nhận mã OTP đặt lại mật khẩu
            </p>
            <input
              name="email"
              type="email"
              placeholder="Nhập email"
              onChange={onChangeHandler}
              value={data.email}
              required
            />
          </div>
        )}

        {currState === "Reset" && (
          <div className="login-popup-inputs">
            <input
              type="text"
              placeholder="Nhập mã OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <div className="password-input">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu mới"
                onChange={onChangeHandler}
                value={data.password}
                required
              />
              <span onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>
        )}

        {/* NÚT */}
        <button type="submit" disabled={loading}>
          {loading
            ? "Đang xử lý..."
            : currState === "Login"
            ? "Đăng nhập"
            : currState === "Sign Up"
            ? "Đăng ký"
            : currState === "Verify"
            ? "Xác thực OTP"
            : currState === "Forgot"
            ? "Gửi mã OTP"
            : "Đặt lại mật khẩu"}
        </button>

        {/* DÒNG DƯỚI */}
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
