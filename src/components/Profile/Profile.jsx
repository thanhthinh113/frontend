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
} from "react-icons/fa";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export const Profile = () => {
  const { user, setUser, url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(user?.address || {});
  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setPhone(user.phone || "");
      setAddress(user.address || {});
    }
  }, [user]);
  const handleSave = async () => {
    try {
      const res = await axios.post(
        `${url}/api/user/update-profile`,
        {
          name,
          phone,
          address,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success("Cập nhật thông tin thành công");

        const updatedUser = {
          ...user, // giữ lại email, role, _id
          ...res.data.data, // cập nhật name, phone, address
        };

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser)); // ✅ lưu full user
        setEditing(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi cập nhật thông tin");
    }
  };

  return (
    <div className="profile-wrapper">
      {/* Thông tin user */}
      <div className="profile-card">
        <FaUserCircle className="profile-avatar" />
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
        </div>
        <div className="menu-item">
          <FaCog className="menu-icon" />
          <span>Cài đặt tài khoản</span>
        </div>
      </div>
    </div>
  );
};
