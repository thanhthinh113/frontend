import React, { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../context/StoreContext";
import {
  FaUserCircle,
  FaClipboardList,
  FaShoppingCart,
  FaGift,
  FaCog,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEdit,
  FaLock,
  FaSignOutAlt,
  FaCamera,
} from "react-icons/fa";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const Profile = () => {
  const { user, setUser, url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || {});
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || {});
      setAvatar(user.avatar || "");
    }
  }, [user]);

  // ✅ Lưu thông tin hồ sơ
  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", JSON.stringify(address));
      if (avatar instanceof File) formData.append("avatar", avatar);

      const res = await axios.post(`${url}/api/user/update-profile`, formData, {
        headers: { token, "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Cập nhật thông tin thành công");
        const updatedUser = { ...user, ...res.data.data };
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  // ✅ Đổi mật khẩu
  const handleChangePassword = async () => {
    if (newPass !== confirmPass) return toast.error("Mật khẩu không khớp");
    try {
      const res = await axios.post(
        `${url}/api/user/change-password`,
        { oldPass, newPass },
        { headers: { token } }
      );
      if (res.data.success) {
        toast.success("Đổi mật khẩu thành công!");
        setChangingPass(false);
        setOldPass("");
        setNewPass("");
        setConfirmPass("");
      }
    } catch (err) {
      console.error(err);
      toast.error("Sai mật khẩu cũ hoặc lỗi máy chủ");
    }
  };

  // ✅ Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
    toast.info("Đã đăng xuất!");
  };

  // ✅ Xử lý chọn ảnh đại diện
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
    }
  };

  return (
    <div className="profile-wrapper">
      {/* Thông tin user */}
      <div className="profile-card">
        <div className="avatar-section">
          {avatar && !(avatar instanceof File) ? (
            <img
              src={`${url}/${avatar}`}
              alt="avatar"
              className="profile-avatar-img"
            />
          ) : avatar instanceof File ? (
            <img
              src={URL.createObjectURL(avatar)}
              alt="preview"
              className="profile-avatar-img"
            />
          ) : (
            <FaUserCircle className="profile-avatar" />
          )}

          {editing && (
            <label className="avatar-upload">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: "none" }}
              />
            </label>
          )}
        </div>

        <div className="profile-info">
          {editing ? (
            <>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tên"
              />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Số điện thoại"
              />
              <input
                type="text"
                value={address.street || ""}
                placeholder="Tên đường"
                onChange={(e) =>
                  setAddress({ ...address, street: e.target.value })
                }
              />
              <input
                type="text"
                value={address.district || ""}
                placeholder="Quận/Huyện"
                onChange={(e) =>
                  setAddress({ ...address, district: e.target.value })
                }
              />
              <input
                type="text"
                value={address.city || ""}
                placeholder="Thành phố"
                onChange={(e) =>
                  setAddress({ ...address, city: e.target.value })
                }
              />
              <button className="save-btn" onClick={handleSave}>
                Lưu
              </button>
              <button className="cancel-btn" onClick={() => setEditing(false)}>
                Hủy
              </button>
            </>
          ) : (
            <>
              <h2>{user?.name || "Khách hàng"}</h2>
              <p>{user?.email || "Chưa có email"}</p>
              <p>
                <FaPhoneAlt /> {user?.phone || "Chưa có số điện thoại"}
              </p>
              <p>
                <FaMapMarkerAlt />{" "}
                {user?.address
                  ? `${user.address.street || ""}, ${
                      user.address.district || ""
                    }, ${user.address.city || ""}`
                  : "Chưa có địa chỉ"}
              </p>
              <button className="edit-btn" onClick={() => setEditing(true)}>
                <FaEdit /> Sửa
              </button>
            </>
          )}
        </div>
      </div>

      {/* Đổi mật khẩu */}
      {changingPass && (
        <div className="change-password">
          <h3>Đổi mật khẩu</h3>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <input
            type="password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPass}
            onChange={(e) => setConfirmPass(e.target.value)}
          />
          <button className="save-btn" onClick={handleChangePassword}>
            Cập nhật
          </button>
          <button className="cancel-btn" onClick={() => setChangingPass(false)}>
            Hủy
          </button>
        </div>
      )}

      {/* Menu chức năng */}
      <div className="profile-menu">
        <div className="menu-item" onClick={() => navigate("/myorders")}>
          <FaClipboardList className="menu-icon" />
          <span>Đơn hàng của tôi</span>
        </div>
        <div className="menu-item" onClick={() => navigate("/cart")}>
          <FaShoppingCart className="menu-icon" />
          <span>Giỏ hàng</span>
        </div>
        <div className="menu-item">
          <FaGift className="menu-icon" />
          <span>Tích điểm & Ưu đãi</span>
          <p className="loyalty">Cấp bậc: {user?.tier || "Thành viên mới"}</p>
          <p className="points">Điểm: {user?.points || 0}</p>
        </div>
        <div className="menu-item" onClick={() => setChangingPass(true)}>
          <FaLock className="menu-icon" />
          <span>Đổi mật khẩu</span>
        </div>
        <div className="menu-item" onClick={handleLogout}>
          <FaSignOutAlt className="menu-icon" />
          <span>Đăng xuất</span>
        </div>
      </div>
    </div>
  );
};
